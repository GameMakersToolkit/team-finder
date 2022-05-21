package com.gmtkgamejam.routing;

import com.auth0.jwt.JWT
import com.gmtkgamejam.enumFromStringSafe
import com.gmtkgamejam.models.*
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.bson.conversions.Bson
import org.litote.kmongo.*
import kotlin.reflect.full.memberProperties

fun Application.configurePostRouting() {

    val authService = AuthService()
    val service = PostService()
    val favouritesService = FavouritesService()

    routing {
        route("/posts") {
            get {
                val params = call.parameters

                // All Posts found should be active
                val filters = mutableListOf<Bson>(PostItem::deletedAt eq null)
                val favouritesFilters = mutableListOf<Bson>()

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
                    ?.let { filters.add(or(it)) }

                params["availability"]?.split(',')
                    ?.filter ( String::isNotBlank ) // Filter out empty `&availability=`
                    ?.mapNotNull { enumFromStringSafe<Availability>(it) }
                    ?.map { PostItem::availability eq it }
                    // Availabilities are mutually exclusive, so treat it as inclusion search
                    ?.let { filters.add(or(it)) }

                // Timezones
                val timezoneRange = params["timezones"]?.split('/')
                if (timezoneRange != null && timezoneRange.size == 2) {
                    val timezoneStart: Int = timezoneRange[0].toInt()
                    val timezoneEnd: Int = timezoneRange[1].toInt()

                    if (timezoneStart < timezoneEnd) {
                        // UTC-2 -> UTC+2 should be: [-2, -1, 0, 1, 2]
                        filters.add(and(PostItem::timezoneOffset gte timezoneStart, PostItem::timezoneOffset lte timezoneEnd))
                    } else {
                        // UTC+9 -> UTC-9 should be: [9, 10, 11, 12, -12, -11, -10, -9]
                        filters.add(or(
                            and(PostItem::timezoneOffset gte timezoneStart, PostItem::timezoneOffset lte 12),
                            and(PostItem::timezoneOffset gte -12, PostItem::timezoneOffset lte timezoneEnd)
                        ))
                    }
                }

                // Favourited posts, _if_ user is logged in
                var favouritePostIds = mutableListOf<Long>()
                call.request.header("Authorization")?.substring(7)
                    ?.let { JWT.decode(it) }
                    ?.let { it.getClaim("id").asString() }
                    ?.let { authService.getTokenSet(it) }
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.also { favouritePostIds = it.postIds }
                    ?.let { favouritesList ->
                        favouritesList.postIds.map {
                            favouritesFilters.add(and(PostItem::id eq it, PostItem::deletedAt eq null))
                        }
                    }

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

                val combinedFilter = or(and(filters), or(favouritesFilters)) // One and() call combines all filters into a single bool query

                val posts = service.getPosts(combinedFilter, sort, page)
                posts.map { it.isFavourite = favouritePostIds.contains(it.id) }

                call.respond(posts)
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
                                it.title = data.title ?: it.title
                                it.description = data.description ?: it.description
                                it.skillsPossessed = data.skillsPossessed ?: it.skillsPossessed
                                it.skillsSought = data.skillsSought ?: it.skillsSought
                                it.preferredTools = data.preferredTools ?: it.preferredTools
                                it.availability = data.availability ?: it.availability
                                it.timezoneOffset = data.timezoneOffset ?: it.timezoneOffset

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
