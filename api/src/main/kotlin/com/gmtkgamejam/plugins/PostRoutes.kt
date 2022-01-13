package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.*
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.litote.kmongo.*
import kotlin.reflect.full.memberProperties

fun Application.configurePostRouting() {

    val service = PostService()

    routing {
        route("/posts") {
            get {
                val params = call.parameters

                // All Posts found should be active
                // TODO: Handle deleted posts differently for admins (if at all)
                val filters = mutableListOf(PostItem::deletedAt eq null)

                params["description"]?.split(',')
                    // The regex is the easiest way to check if a description contains a given substring
                    ?.map { PostItem::description regex it.toRegex(RegexOption.IGNORE_CASE) }
                    ?.let ( filters::addAll )

                params["skillsPossessed"]?.split(',')
                    ?.map ( Skills::fromString )
                    ?.map { PostItem::skillsPossessed contains it }
                    ?.let ( filters::addAll )

                params["skillsSought"]?.split(',')
                    ?.map ( Skills::fromString )
                    ?.map { PostItem::skillsSought contains it }
                    ?.let ( filters::addAll )

                params["languages"]?.split(',')
                    ?.map { PostItem::languages contains it }
                    ?.let ( filters::addAll )

                // Sorting
                // TODO: Error handling
                val sortByFieldName = params["sortBy"] ?: "id"
                val sortByField = PostItem::class.memberProperties.first { prop -> prop.name == sortByFieldName }
                val sort = when(params["sortDir"].toString()) {
                    "asc" ->    ascending(sortByField)
                    "desc" ->   descending(sortByField)
                    else ->     ascending(sortByField)
                }

                // Pagination
                val page = params["page"]?.toInt() ?: 1

                val combinedFilter = and(filters) // One and() call combines all filters into a single bool query
                call.respond(service.getPosts(combinedFilter, sort, page))
            }

            post {
                val data = call.receive<PostItemCreateDto>()
                val postItem = PostItem.fromCreateDto(data)

                service.createPost(postItem)
                call.respond(postItem)
            }

            get("{id}") {
                val post: PostItem? = call.parameters["id"]?.toLong()?.let { service.getPost(it) }
                post?.let { return@get call.respond(it) }
                call.respondText("Post not found", status = HttpStatusCode.NotFound)
            }

            route("/mine") {
                get {
                    // TODO: Pull ID from auth payload when set up
                    service.getPost(1)?.let { return@get call.respond(it) }
                    call.respondText("Post not found", status = HttpStatusCode.NotFound)
                }

                put {
                    val data = call.receive<PostItemUpdateDto>()
                    // TODO: Pull ID from auth payload when set up
                    service.getPost(data.id)?.let {
                        // FIXME: Don't just brute force update all given fields
                        it.author = data.author.ifEmpty { it.author }
                        it.authorId = data.authorId.ifEmpty { it.authorId }
                        it.description = data.description ?: it.description
                        it.skillsPossessed = if (data.skillsPossessedMask != null) Skills.fromBitwiseId(data.skillsPossessedMask!!) else it.skillsPossessed
                        it.skillsSought = if (data.skillsSoughtMask != null) Skills.fromBitwiseId(data.skillsSoughtMask!!) else it.skillsSought
                        it.languages = if (data.languages != null) data.languages!!.split(",") else it.languages

                        service.updatePost(it)
                        return@put call.respond(it)
                    }

                    // TODO: Replace BadRequest with contextual response
                    call.respondText("Could not update Post", status = HttpStatusCode.BadRequest)
                }

                delete {
                    // TODO: Manage user Post, not just any ID
                    val data = call.receive<PostItemDeleteDto>()

                    service.getPost(data.id)?.let {
                        service.deletePost(it)
                        return@delete call.respondText("Post deleted", status = HttpStatusCode.OK)
                    }

                    // TODO: Replace BadRequest with contextual response
                    call.respondText("Could not delete Post", status = HttpStatusCode.BadRequest)
                }
            }

            route("/report")
            {
                post {
                    val data = call.receive<PostItemReportDto>()

                    service.getPost(data.id)?.let {
                        it.reportCount++
                        service.updatePost(it)
                        return@post call.respond(it)
                    }

                    call.respondText("Post not found", status = HttpStatusCode.NotFound)
                }
            }
        }
    }
}
