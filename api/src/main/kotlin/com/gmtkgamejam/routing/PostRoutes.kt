package com.gmtkgamejam.routing

import com.auth0.jwt.JWT
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.SearchItem
import com.gmtkgamejam.models.posts.dtos.*
import com.gmtkgamejam.repositories.PostRepository
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.search.SearchParams
import com.gmtkgamejam.services.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.launch
import org.koin.ktor.ext.inject
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.ceil
import kotlin.math.min

fun Application.configurePostRouting() {

    val analyticsService: AnalyticsService by inject()
    val authService: AuthService by inject()
    val postService: PostService by inject()
    val searchService: SearchService by inject()
    val favouritesService: FavouritesService by inject()

    routing {
        route("/posts") {
            get {
                val searchParams = SearchParams(call.parameters)
                val postIds = searchService.search(searchParams.query(), searchParams.sort(), searchParams.page)
                val posts = postService.getPostsByOrderedIds(postIds)
                val totalPosts = searchService.count(searchParams.query())

                // Set isFavourite on posts for this user if they're logged in
                call.request.header("Authorization")?.substring(7)
                    ?.let { JWT.decode(it) }?.getClaim("id")?.asString()
                    ?.let { authService.getTokenSet(it) }
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList ->
                        posts.map { it.isFavourite = favouritesList.postIds.contains(it.id) }
                    }

                val pagination = mapOf(
                    "current" to searchParams.page,
                    "total" to ceil(totalPosts / PostRepository.PAGE_SIZE.toDouble()).toInt()
                )

                call.respond(
                    PostsDTO(
                        posts,
                        pagination
                    )
                )

                launch {
                    analyticsService.trackQuery(searchParams.trackableId())
                    posts.forEach { analyticsService.trackQueryView(it) }
                }
            }

            get("{id}") {
                val post: PostItem? = call.parameters["id"]?.let { postService.getPost(it) }

                // Simple filter for full page post views
                val jamId = call.parameters["jamId"]
                val postBelongsToCurrentJam = jamId == null || post?.jamId == jamId

                if (post?.deletedAt != null || !postBelongsToCurrentJam) {
                    call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                }

                // Set isFavourite on posts for this user if they're logged in
                call.request.header("Authorization")?.substring(7)
                    ?.let { JWT.decode(it) }?.getClaim("id")?.asString()
                    ?.let { authService.getTokenSet(it) }
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList ->
                        post?.isFavourite = favouritesList.postIds.contains(post?.id)
                    }

                post
                    ?.also { launch { analyticsService.trackFullPageView(it) } }
                    ?.let { return@get call.respond(it) }

                call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
            }

            authenticate("auth-jwt") {

                post {
                    val data = call.receive<PostItemCreateDto>()

                    authService.getTokenSet(call)
                        ?.let {
                            if (postService.getPostByAuthorId(it.discordId) != null) {
                                return@post call.respondJSON(
                                    "Cannot have duplicate posts",
                                    status = HttpStatusCode.BadRequest
                                )
                            }
                            it
                        }
                        ?.let {
                            data.authorId = it.discordId  // TODO: What about author name?
                            data.timezoneOffsets = data.timezoneOffsets.filter { tz -> tz >= -12 && tz <= 12 }.toSet()
                        }
                        ?.let { PostItem.fromCreateDto(data) }
                        ?.let { postService.createPost(it) }
                        ?.let { return@post call.respond(it) }

                    call.respondJSON("Post could not be created", status = HttpStatusCode.NotFound)
                }

                get("favourites") {
                    val searchParams = SearchParams(call.parameters)
                    val favourites = authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }

                    // Exit early if the user don't have any favourites set
                    if (favourites!!.postIds.isEmpty()) {
                        return@get call.respond(emptyList<PostItem>())
                    }

                    // Search _all_ IDs we can (pageSize: -1) to ensure we capture all favourites in response
                    val postIds = searchService.search(searchParams.query(), searchParams.sort(), searchParams.page)
                        .filter { favourites.postIds.contains(it) }
                        .toList()

                    val posts = postService.getPostsByOrderedIds(postIds)
                    posts.map { post -> post.isFavourite = true }

                    val pagination = mapOf(
                        "current" to searchParams.page,
                        "total" to ceil(favourites.postIds.size / PostRepository.PAGE_SIZE.toDouble()).toInt()
                    )

                    call.respond(
                        PostsDTO(
                            posts,
                            pagination
                        )
                    )
                }

                route("/mine") {
                    get {
                        authService.getTokenSet(call)
                            ?.let { postService.getPostByAuthorId(it.discordId) }
                            ?.let { return@get call.respond(it) }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }

                    put {
                        val data = call.receive<PostItemUpdateDto>()

                        authService.getTokenSet(call)
                            ?.let { postService.getPostByAuthorId(it.discordId) }
                            ?.let { post ->
                                // Ugly-but-functional way to update all of the fields in the DTO
                                data.author?.also { post.author = it }
                                data.itchAccountIds?.also { post.itchAccountIds = it }
                                data.description?.also { post.description = it }
                                data.size?.also { post.size = min(it, 40) }
                                data.skillsPossessed?.also { post.skillsPossessed = it }
                                data.skillsSought?.also { post.skillsSought = it }
                                data.preferredTools?.also { post.preferredTools = it }
                                data.languages?.also { post.languages = it }
                                data.languages?.also { post.languages = it }
                                data.availability?.also { post.availability = it }
                                data.timezoneOffsets?.also {
                                    post.timezoneOffsets = it.filter { tz -> tz >= -12 && tz <= 12 }.toSet()
                                }

                                post.updatedAt =
                                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

                                postService.updatePost(post)
                                searchService.update(SearchItem(post))
                                return@put call.respond(post)
                            }

                        // TODO: Replace BadRequest with contextual response
                        call.respondJSON("Could not update Post", status = HttpStatusCode.BadRequest)
                    }

                    delete {
                        authService.getTokenSet(call)
                            ?.let { postService.getPostByAuthorId(it.discordId) }
                            ?.also { postService.deletePost(it) }
                            ?.also { searchService.delete(it.id) }
                            ?.let { return@delete call.respondJSON("Post deleted", status = HttpStatusCode.OK) }

                        // TODO: Replace BadRequest with contextual response
                        call.respondJSON("Could not delete Post", status = HttpStatusCode.BadRequest)
                    }
                }

                route("/report")
                {
                    post {
                        val data = call.receive<PostItemReportDto>()

                        postService.getPost(data.id)?.let {
                            it.reportCount++
                            postService.updatePost(it)
                            return@post call.respond(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }

                route("/report-unable-to-contact")
                {
                    post {
                        val data = call.receive<PostItemUnableToContactReportDto>()

                        postService.getPost(data.id)?.let {
                            it.unableToContactCount++
                            postService.updatePost(it)
                            return@post call.respond(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }
}
