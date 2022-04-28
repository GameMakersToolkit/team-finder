package com.gmtkgamejam.plugins;

import com.gmtkgamejam.enumFromStringSafe
import com.gmtkgamejam.models.*
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.litote.kmongo.*
import kotlin.reflect.full.memberProperties

fun Application.configurePostRouting() {

    val authService = AuthService()
    val service = PostService()

    routing {
        route("/posts") {
            get {
                val params = call.parameters

                // All Posts found should be active
                // TODO: Handle deleted posts differently for admins (if at all)
                val filters = mutableListOf(PostItem::deletedAt eq null)

                params["description"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&description=`
                    // The regex is the easiest way to check if a description contains a given substring
                    ?.forEach {
                        filters.add(or(
                            PostItem::title regex it.toRegex(RegexOption.IGNORE_CASE),
                            PostItem::description regex it.toRegex(RegexOption.IGNORE_CASE)
                        ))
                    }

                params["skillsPossessed"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&skillsPossessed=`
                    ?.mapNotNull { enumFromStringSafe<Skills>(it) }
                    ?.map { PostItem::skillsPossessed contains it }
                    ?.let ( filters::addAll )

                params["skillsSought"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&skillsSought=`
                    ?.mapNotNull { enumFromStringSafe<Skills>(it) }
                    ?.map { PostItem::skillsSought contains it }
                    ?.let ( filters::addAll )

                params["tools"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&skillsSought=`
                    ?.mapNotNull { enumFromStringSafe<Tools>(it) }
                    ?.map { PostItem::preferredTools contains it }
                    ?.let ( filters::addAll )

                params["languages"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&languages=`
                    ?.map { PostItem::languages contains it }
                    ?.let ( filters::addAll )

                params["availability"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&availability=`
                    ?.mapNotNull { enumFromStringSafe<Availability>(it) }
                    ?.map { PostItem::availability eq it }
                    // Availabilities are mutually exclusive, so treat it as inclusion search
                    ?.let { filters.add(or(it)) }

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

            get("{id}") {
                val post: PostItem? = call.parameters["id"]?.toLong()?.let { service.getPost(it) }
                post?.let { return@get call.respond(it) }
                call.respondText("Post not found", status = HttpStatusCode.NotFound)
            }

            authenticate("auth-jwt") {

                post {
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    val data = call.receive<PostItemCreateDto>()
                    authService.getTokenSet(id)
                        ?.let {
                            data.authorId = it.discordId  // TODO: What about author name?
                            if (service.getPostByAuthorId(it.discordId) != null) {
                                return@post call.respondText("Cannot have duplicate posts", status = HttpStatusCode.BadRequest)
                            }
                        }
                        ?.let { PostItem.fromCreateDto(data) }
                        ?.let {  service.createPost(it) }
                        ?.let { return@post call.respond(it) }

                    call.respondText("Post could not be created", status = HttpStatusCode.NotFound)
                }

                route("/mine") {
                    get {
                        val principal = call.principal<JWTPrincipal>()!!
                        val id = principal.payload.getClaim("id").asString()

                        authService.getTokenSet(id)
                            ?.let { service.getPostByAuthorId(it.discordId) }
                            ?.let { return@get call.respond(it) }

                        call.respondText("Post not found", status = HttpStatusCode.NotFound)
                    }

                    put {
                        val principal = call.principal<JWTPrincipal>()!!
                        val id = principal.payload.getClaim("id").asString()

                        val data = call.receive<PostItemUpdateDto>()

                        authService.getTokenSet(id)
                            ?.let { service.getPostByAuthorId(it.discordId) }
                            ?.let {
                                // FIXME: Don't just brute force update all given fields
                                it.description = data.description ?: it.description
                                it.skillsPossessed = data.skillsPossessed ?: it.skillsPossessed
                                it.skillsSought = data.skillsSought ?: it.skillsSought
                                it.preferredTools = data.preferredTools ?: it.preferredTools

                                service.updatePost(it)
                                return@put call.respond(it)
                            }

                        // TODO: Replace BadRequest with contextual response
                        call.respondText("Could not update Post", status = HttpStatusCode.BadRequest)
                    }

                    delete {
                        // TODO: Should this DTO exist at all? No data being used.
                        val data = call.receive<PostItemDeleteDto>()

                        val principal = call.principal<JWTPrincipal>()!!
                        val id = principal.payload.getClaim("id").asString()

                        authService.getTokenSet(id)
                            ?.let { service.getPostByAuthorId(it.discordId) }
                            ?.let {
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
}
