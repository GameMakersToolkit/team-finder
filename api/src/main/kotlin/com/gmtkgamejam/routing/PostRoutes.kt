package com.gmtkgamejam.routing

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.dtos.*
import com.gmtkgamejam.repositories.PostRepository
import com.gmtkgamejam.respondData
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AnalyticsService
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import com.gmtkgamejam.services.InMemoryRateLimiter
import com.gmtkgamejam.services.PostService
import com.gmtkgamejam.validation.PostDtoValidator
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.*
import kotlinx.coroutines.launch
import org.jetbrains.exposed.sql.SortOrder
import org.koin.ktor.ext.inject
import org.slf4j.LoggerFactory
import java.net.URI
import java.time.LocalDateTime
import kotlin.math.ceil

fun Application.configurePostRouting() {
    val logger = LoggerFactory.getLogger("PostRoutes")

    val analyticsService: AnalyticsService by inject()
    val config: com.gmtkgamejam.Config by inject()
    val authService: AuthService by inject()
    val service: PostService by inject()
    val favouritesService: FavouritesService by inject()

    val mutationRateLimiter = InMemoryRateLimiter(
        maxRequests = config.getString("rateLimit.postMutationsPerMinute").toIntOrNull() ?: 30,
        windowSeconds = 60,
    )

    fun mutationRateLimitKey(discordId: String, remoteHost: String): String = "$discordId:$remoteHost"
    fun requestRemoteHost(call: ApplicationCall): String =
        call.request.headers[HttpHeaders.XForwardedFor]
            ?.substringBefore(',')
            ?.trim()
            ?.takeIf(String::isNotBlank)
            ?: call.request.local.remoteHost

    routing {
        route("/posts") {
            get {
                val start = LocalDateTime.now()
                val params = call.parameters
                val page = params["page"]?.toInt() ?: 1
                val jamId = params["jamId"] ?: "unknown"

                val posts = service.getPosts(params, page)
                val filteredCount = service.getPostCount(params)

                // For total count, we need all posts in this jam regardless of filters
                val totalCountParams = Parameters.build {
                    params["jamId"]?.let { append("jamId", it) }
                }
                val totalCount = service.getPostCount(totalCountParams)

                val queryEnd = LocalDateTime.now()

                val tokenSet = authService.getTokenSet(call)

                // Set isFavourite on posts for this user if they're logged in
                tokenSet
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList ->
                        posts.map { it.isFavourite = favouritesList.postIds.contains(it.id) }
                    }

                val pagination = Pagination(
                    page,
                    ceil(filteredCount / PostRepository.PAGE_SIZE.toDouble()).toInt(),
                    filteredCount,
                    totalCount,
                )

                val startResponse = LocalDateTime.now()
                call.respondData(
                    PostsDTO(
                        posts,
                        pagination
                    )
                )
                val endResponse = LocalDateTime.now()
                if (params["debug"] == "true") {
                    log.info("TIMINGS CHECK: start ${start}, queryEnd ${queryEnd}, startResponse: ${startResponse}, endResponse: ${endResponse}")
                }

                launch {
                    analyticsService.trackQuery(jamId, params.toMap().toSortedMap())
                    analyticsService.trackHomepageView(
                        jamId = jamId,
                        viewerKey = tokenSet?.discordId ?: requestRemoteHost(call),
                    )
                    posts.forEach { analyticsService.trackQueryView(it) }
                }
            }

            get("{id}") {
                val post: PostItem? = call.parameters["id"]?.let { service.getPost(it) }

                // Simple filter for full page post views
                val jamId = call.parameters["jamId"]
                val postBelongsToCurrentJam = jamId == null || post?.jamId == jamId

                if (post?.deletedAt != null || !postBelongsToCurrentJam) {
                    call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                }

                // Set isFavourite on posts for this user if they're logged in
                authService.getTokenSet(call)
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList ->
                        post?.isFavourite = favouritesList.postIds.contains(post.id)
                    }

                post
                    ?.also { launch { analyticsService.trackFullPageView(it) } }
                    ?.let { return@get call.respondData(it) }

                call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
            }

            authenticate("auth-jwt") {

                post {
                    val data = call.receive<PostItemCreateDto>()
                    val jamId = data.jamId

                    val validationErrors = PostDtoValidator.validateCreate(data)
                    if (validationErrors.isNotEmpty()) {
                        logger.info("Rejected post create payload for jam {} due to validation errors: {}", jamId, validationErrors.keys)
                        return@post call.respondJSON(
                            text = "Invalid create payload",
                            status = HttpStatusCode.BadRequest,
                            code = "validation_error",
                            details = validationErrors,
                        )
                    }

                    authService.getTokenSet(call)
                        ?.let {
                            val remoteHost = requestRemoteHost(call)
                            val limiterKey = mutationRateLimitKey(it.discordId, remoteHost)
                            if (!mutationRateLimiter.isAllowed(limiterKey)) {
                                logger.warn("Rate limit exceeded for post create by user {} from {}", it.discordId, remoteHost)
                                return@post call.respondJSON(
                                    text = "Rate limit exceeded",
                                    status = HttpStatusCode.TooManyRequests,
                                    code = "rate_limit_exceeded",
                                )
                            }

                            if (service.getPostByAuthorId(it.discordId, jamId) != null) {
                                logger.info("Rejected duplicate post create for user {} in jam {}", it.discordId, jamId)
                                return@post call.respondJSON(
                                    "Cannot have duplicate posts",
                                    status = HttpStatusCode.BadRequest,
                                    code = "duplicate_post",
                                )
                            }
                            it
                        }
                        ?.let { service.createPostFromDto(data, it.discordId) }
                        ?.let {
                            logger.info("Creating post {} for user {} in jam {}", it.id, it.authorId, it.jamId)
                            service.createPost(it)
                            launch { analyticsService.trackPostMutation(it.jamId, "created") }
                        }
                        ?.let { return@post call.respondData(it, HttpStatusCode.Created) }

                    call.respondJSON("Post could not be created", status = HttpStatusCode.NotFound, code = "create_failed")
                }

                get("favourites") {
                    val params = call.parameters
                    val page = params["page"]?.toInt() ?: 1

                    val favourites = authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }

                    if (favourites == null || favourites.postIds.isEmpty()) {
                        return@get call.respondData(
                            PostsDTO(
                                emptyList(),
                                Pagination(1, 1, 0, 0)
                            )
                        )
                    }

                    // Get all favorite posts, then filter and sort in memory
                    val allFavePosts = favourites.postIds
                        .mapNotNull { service.getPost(it) }
                        .filter { it.deletedAt == null }

                    // Apply sorting based on parameters
                    val (sortColumn, sortDir) = com.gmtkgamejam.db.QueryBuilder.buildPostSort(params)
                    val sortedPosts = when (sortColumn.name) {
                        "created_at" -> if (sortDir == SortOrder.DESC) allFavePosts.sortedByDescending { it.createdAt } else allFavePosts.sortedBy { it.createdAt }
                        "updated_at" -> if (sortDir == SortOrder.DESC) allFavePosts.sortedByDescending { it.updatedAt } else allFavePosts.sortedBy { it.updatedAt }
                        "query_count" -> if (sortDir == SortOrder.DESC) allFavePosts.sortedByDescending { it.queryCount } else allFavePosts.sortedBy { it.queryCount }
                        "full_page_view_count" -> if (sortDir == SortOrder.DESC) allFavePosts.sortedByDescending { it.fullPageViewCount } else allFavePosts.sortedBy { it.fullPageViewCount }
                        else -> allFavePosts
                    }

                    // Apply pagination
                    val pageSize = PostRepository.PAGE_SIZE
                    val paginatedPosts = sortedPosts
                        .drop(pageSize * (page - 1))
                        .take(pageSize)

                    paginatedPosts.forEach { post -> post.isFavourite = true }

                    val totalCount = sortedPosts.size
                    val pagination = Pagination(
                        page,
                        ceil(totalCount / PostRepository.PAGE_SIZE.toDouble()).toInt(),
                        totalCount,
                        totalCount,
                    )

                    call.respondData(PostsDTO(paginatedPosts, pagination))
                }

                route("/mine") {
                    get {
                        val jamId = call.parameters["jamId"]
                        if (jamId == null) {
                            return@get call.respondJSON("Missing required query parameter: jamId", status = HttpStatusCode.BadRequest)
                        }
                        authService.getTokenSet(call)
                            ?.let { service.getPostByAuthorId(it.discordId, jamId) }
                            ?.let { return@get call.respondData(it) }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }

                    put {
                        val jamId = call.parameters["jamId"]
                        if (jamId == null) {
                            return@put call.respondJSON("Missing required query parameter: jamId", status = HttpStatusCode.BadRequest)
                        }
                        val data = call.receive<PostItemUpdateDto>()

                        val validationErrors = PostDtoValidator.validateUpdate(data)
                        if (validationErrors.isNotEmpty()) {
                            logger.info("Rejected post update payload for jam {} due to validation errors: {}", jamId, validationErrors.keys)
                            return@put call.respondJSON(
                                text = "Invalid update payload",
                                status = HttpStatusCode.BadRequest,
                                code = "validation_error",
                                details = validationErrors,
                            )
                        }

                        authService.getTokenSet(call)
                            ?.let {
                                val remoteHost = requestRemoteHost(call)
                                val limiterKey = mutationRateLimitKey(it.discordId, remoteHost)
                                if (!mutationRateLimiter.isAllowed(limiterKey)) {
                                    logger.warn("Rate limit exceeded for post update by user {} from {}", it.discordId, remoteHost)
                                    return@put call.respondJSON(
                                        text = "Rate limit exceeded",
                                        status = HttpStatusCode.TooManyRequests,
                                        code = "rate_limit_exceeded",
                                    )
                                }

                                service.getPostByAuthorId(it.discordId, jamId)
                            }
                            ?.let { post ->
                                val updated = service.applyUpdate(post, data)
                                logger.info("Updating post {} for user {} in jam {}", updated.id, updated.authorId, jamId)
                                service.updatePost(updated)
                                launch { analyticsService.trackPostMutation(jamId, "updated") }
                                return@put call.respondData(updated)
                            }

                        // TODO: Replace BadRequest with contextual response
                        call.respondJSON("Could not update Post", status = HttpStatusCode.BadRequest)
                    }

                    delete {
                        val jamId = call.parameters["jamId"]
                        if (jamId == null) {
                            return@delete call.respondJSON("Missing required query parameter: jamId", status = HttpStatusCode.BadRequest)
                        }
                        authService.getTokenSet(call)
                            ?.let {
                                val remoteHost = requestRemoteHost(call)
                                val limiterKey = mutationRateLimitKey(it.discordId, remoteHost)
                                if (!mutationRateLimiter.isAllowed(limiterKey)) {
                                    logger.warn("Rate limit exceeded for post delete by user {} from {}", it.discordId, remoteHost)
                                    return@delete call.respondJSON(
                                        text = "Rate limit exceeded",
                                        status = HttpStatusCode.TooManyRequests,
                                        code = "rate_limit_exceeded",
                                    )
                                }

                                service.getPostByAuthorId(it.discordId, jamId)
                            }
                            ?.let {
                                logger.info("Soft deleting post {} for user {} in jam {}", it.id, it.authorId, jamId)
                                service.deletePost(it)
                                launch { analyticsService.trackPostMutation(jamId, "deleted") }
                                return@delete call.respondData(mapOf("message" to "Post deleted"), HttpStatusCode.OK)
                            }

                        // TODO: Replace BadRequest with contextual response
                        call.respondJSON("Could not delete Post", status = HttpStatusCode.BadRequest)
                    }
                }

                route("/report")
                {
                    post {
                        val data = call.receive<PostItemReportDto>()

                        val tokenSet = authService.getTokenSet(call)
                            ?: return@post call.respondJSON("Unauthorized", HttpStatusCode.Unauthorized, "unauthorized")
                        val remoteHost = requestRemoteHost(call)
                        val limiterKey = mutationRateLimitKey(tokenSet.discordId, remoteHost)
                        if (!mutationRateLimiter.isAllowed(limiterKey)) {
                            logger.warn("Rate limit exceeded for report endpoint by user {} from {}", tokenSet.discordId, remoteHost)
                            return@post call.respondJSON(
                                text = "Rate limit exceeded",
                                status = HttpStatusCode.TooManyRequests,
                                code = "rate_limit_exceeded",
                            )
                        }

                        service.getPost(data.id)?.let {
                            it.reportCount++
                            logger.info("Incrementing report count for post {} by reporter {}", it.id, tokenSet.discordId)
                            service.updatePost(it)
                            return@post call.respondData(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }

                route("/report-unable-to-contact")
                {
                    post {
                        val data = call.receive<PostItemUnableToContactReportDto>()

                        val tokenSet = authService.getTokenSet(call)
                            ?: return@post call.respondJSON("Unauthorized", HttpStatusCode.Unauthorized, "unauthorized")
                        val remoteHost = requestRemoteHost(call)
                        val limiterKey = mutationRateLimitKey(tokenSet.discordId, remoteHost)
                        if (!mutationRateLimiter.isAllowed(limiterKey)) {
                            logger.warn("Rate limit exceeded for unable-to-contact report by user {} from {}", tokenSet.discordId, remoteHost)
                            return@post call.respondJSON(
                                text = "Rate limit exceeded",
                                status = HttpStatusCode.TooManyRequests,
                                code = "rate_limit_exceeded",
                            )
                        }

                        service.getPost(data.id)?.let {
                            it.unableToContactCount++
                            logger.info("Incrementing unable-to-contact count for post {} by reporter {}", it.id, tokenSet.discordId)
                            service.updatePost(it)
                            return@post call.respondData(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }
}


fun isSafePortfolioUrl(url: String): Boolean {
    if (url.length > 512 || url.any { it.isWhitespace() }) {
        return false
    }

    val parsed = try {
        URI(url)
    } catch (_: Exception) {
        return false
    }

    val scheme = parsed.scheme?.lowercase()
    if (scheme !in setOf("http", "https")) {
        return false
    }

    if (parsed.host.isNullOrBlank() || parsed.userInfo != null) {
        return false
    }

    // Intentionally strict for now: only protocol + host + optional path.
    return parsed.query == null && parsed.fragment == null
}
