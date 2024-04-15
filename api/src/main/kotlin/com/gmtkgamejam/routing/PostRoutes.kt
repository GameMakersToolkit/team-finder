package com.gmtkgamejam.routing

import com.gmtkgamejam.getAuthTokenSet
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.SearchItem
import com.gmtkgamejam.models.posts.dtos.PostItemCreateDto
import com.gmtkgamejam.models.posts.dtos.PostItemReportDto
import com.gmtkgamejam.models.posts.dtos.PostItemUnableToContactReportDto
import com.gmtkgamejam.models.posts.dtos.PostItemUpdateDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.search.SearchParams
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import com.gmtkgamejam.services.PostService
import com.gmtkgamejam.services.SearchService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.min

fun Application.configurePostRouting() {

    val authService = AuthService()
    val favouritesService = FavouritesService()
    val postService = PostService()
    val searchService = SearchService()

    routing {
        route("/posts") {
            get {
                val searchParams = SearchParams(call.parameters)
                val postIds = searchService.search(searchParams.query(), searchParams.sort())
                val posts = postService.getPostsByOrderedIds(postIds)

                // Set isFavourite on posts for this user if they're logged in
                call.getAuthTokenSet(authService)
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList -> posts.map { it.isFavourite = favouritesList.postIds.contains(it.id) } }

                call.respond(posts)
            }

            get("{id}") {
                val post: PostItem? = call.parameters["id"]?.let { postService.getPost(it) }
                if (post?.deletedAt != null) {
                    call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                }

                // Set isFavourite on posts for this user if they're logged in
                call.getAuthTokenSet(authService)
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList -> post?.isFavourite = favouritesList.postIds.contains(post?.id) }

                post?.let { return@get call.respond(it) }
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
                        ?.also { postService.createPost(it) }
                        ?.also { searchService.index(SearchItem(it)) }
                        ?.let { return@post call.respond(it) }

                    call.respondJSON("Post could not be created", status = HttpStatusCode.NotFound)
                }

                get("favourites") {
                    val favourites = authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }

                    // Exit early if the user don't have any favourites set
                    if (favourites!!.postIds.isEmpty()) {
                        return@get call.respond(emptyList<PostItem>())
                    }

                    val searchParams = SearchParams(call.parameters)
                    val postIds = searchService.search(searchParams.query(), searchParams.sort())
                        .filter { favourites.postIds.contains(it) }
                        .toList()

                    val posts = postService.getPostsByOrderedIds(postIds)
                    posts.map { post -> post.isFavourite = true }

                    call.respond(posts)
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
                                data.description?.also { post.description = it }
                                data.size?.also { post.size = min(it, 20) }
                                data.skillsPossessed?.also { post.skillsPossessed = it }
                                data.skillsSought?.also { post.skillsSought = it }
                                data.preferredTools?.also { post.preferredTools = it }
                                data.languages?.also { post.languages = it }
                                data.languages?.also { post.languages = it }
                                data.availability?.also { post.availability = it }
                                data.timezoneOffsets?.also { post.timezoneOffsets = it.filter { tz -> tz >= -12 && tz <= 12 }.toSet() }

                                post.updatedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

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
