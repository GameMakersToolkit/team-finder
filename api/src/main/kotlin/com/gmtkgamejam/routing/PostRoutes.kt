package com.gmtkgamejam.routing

import com.gmtkgamejam.enumFromStringSafe
import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
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
import org.bson.conversions.Bson
import org.koin.ktor.ext.inject
import org.litote.kmongo.*
import org.slf4j.LoggerFactory
import java.net.URI
import java.time.LocalDateTime
import kotlin.math.ceil
import kotlin.reflect.full.memberProperties
import kotlin.text.Regex.Companion.escape

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
                val filter = and(getFilterFromParameters(params))
                val jamId = params["jamId"] ?: "unknown"

                val posts = service.getPosts(
                    filter,
                    getSortFromParameters(params),
                    page
                )
                val filteredCount = service.getPostCount(filter)
                val totalCount = service.getPostCount(
                    and(
                        listOfNotNull(
                            PostItem::deletedAt eq null,
                            params["jamId"]?.let { PostItem::jamId eq it },
                        )
                    )
                )
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

                    val favouritesFilters = mutableListOf<Bson>()
                    favourites.postIds.forEach {
                        favouritesFilters.add(and(PostItem::id eq it, PostItem::deletedAt eq null))
                    }

                    val posts = service.getPosts(
                        and(
                            or(favouritesFilters),
                            and(getFilterFromParameters(params))
                        ),
                        getSortFromParameters(params),
                        page
                    )
                    posts.map { post -> post.isFavourite = true }

                    val filteredCount = service.getPostCount(
                        and(
                            or(favouritesFilters),
                            and(getFilterFromParameters(params))
                        )
                    )
                    val totalCount = service.getPostCount(and(or(favouritesFilters)))


                    val pagination = Pagination(
                        page,
                        ceil(filteredCount / PostRepository.PAGE_SIZE.toDouble()).toInt(),
                        filteredCount,
                        totalCount,
                    )

                    call.respondData(PostsDTO(posts, pagination))
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

fun getFilterFromParameters(params: Parameters): List<Bson> {
    val filters = mutableListOf(PostItem::deletedAt eq null)

    params["jamId"]?.also { filters.add(PostItem::jamId eq it) }

    params["description"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&description=`
        ?.map { it -> it.trim() }
        // The regex is the easiest way to check if a description contains a given substring
        ?.forEach { filters.add(PostItem::description regex escape(it).toRegex(RegexOption.IGNORE_CASE)) }

    val skillsPossessedSearchMode = params["skillsPossessedSearchMode"] ?: "and"
    params["skillsPossessed"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&skillsPossessed=`
        ?.mapNotNull { enumFromStringSafe<Skills>(it) }
        ?.map { PostItem::skillsPossessed contains it }
        ?.let { if (skillsPossessedSearchMode == "and") and(it) else or(it) }
        ?.let(filters::add)

    val skillsSoughtSearchMode = params["skillsSoughtSearchMode"] ?: "and"
    params["skillsSought"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&skillsSought=`
        ?.mapNotNull { enumFromStringSafe<Skills>(it) }
        ?.map { PostItem::skillsSought contains it }
        ?.let { if (skillsSoughtSearchMode == "and") and(it) else or(it) }
        ?.let(filters::add)

    params["tools"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&skillsSought=`
        ?.mapNotNull { enumFromStringSafe<Tools>(it) }
        ?.map { PostItem::preferredTools contains it }
        ?.let(filters::addAll)

    params["languages"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&languages=`
        ?.map { PostItem::languages contains it }
        ?.let { filters.add(or(it)) }

    params["availability"]?.split(',')
        ?.filter(String::isNotBlank) // Filter out empty `&availability=`
        ?.mapNotNull { enumFromStringSafe<Availability>(it) }
        ?.map { PostItem::availability eq it }
        // Availabilities are mutually exclusive, so treat it as inclusion search
        ?.let { filters.add(or(it)) }

    // If no timezones sent, lack of filters will search all timezones
    if (params["timezoneStart"] != null && params["timezoneEnd"] != null) {
        val timezoneStart = params["timezoneStart"]?.toIntOrNull()
        val timezoneEnd = params["timezoneEnd"]?.toIntOrNull()

        if (timezoneStart == null || timezoneEnd == null) {
            return filters
        }

        val timezones: MutableList<Int> = mutableListOf()
        if (timezoneStart == timezoneEnd) {
            timezones.add(timezoneStart)
        } else if (timezoneStart < timezoneEnd) {
            // UTC-2 -> UTC+2 should be: [-2, -1, 0, 1, 2]
            timezones.addAll((timezoneStart..timezoneEnd))
        } else {
            // UTC+9 -> UTC-9 should be: [9, 10, 11, 12, -12, -11, -10, -9]
            timezones.addAll((timezoneStart..12))
            timezones.addAll((-12..timezoneEnd))
        }

        // Add all timezone searches as eq checks
        // It's brute force, but easier to confirm
        timezones
            .map { PostItem::timezoneOffsets contains it }
            .let { filters.add(or(it)) }
    }

    return filters
}

fun getSortFromParameters(params: Parameters): Bson {
    val sortByFieldName = params["sortBy"] ?: "createdAt"
    val sortByField = PostItem::class.memberProperties.first { prop -> prop.name == sortByFieldName }
    return when (params["sortDir"].toString()) {
        "asc" -> ascending(sortByField)
        "desc" -> descending(sortByField)
        else -> descending(sortByField)
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
