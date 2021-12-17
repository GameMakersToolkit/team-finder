package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.*
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Application.configurePostRouting() {

    val service = PostService()

    routing {
        route("/posts") {
            get {
                call.respond(service.getPosts())
            }

            post {
                val data = call.receive<PostItemCreateDto>()
                val postItem = PostItem.fromCreateDto(data)

                service.createPost(postItem)
                call.respond(postItem)
            }

            get("{id}") {
                val Post = call.parameters["id"]?.toLong()?.let { service.getPost(it) }
                Post?.let { return@get call.respond(it) }
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
