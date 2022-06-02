package com.gmtkgamejam.routing

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

    fun getFilterFromParameters(params: Parameters): List<Bson> {
        val filters = mutableListOf<Bson>(PostItem::deletedAt eq null)

        params["description"]?.split(',')
            ?.filter(String::isNotBlank) // Filter out empty `&description=`
            // The regex is the easiest way to check if a description contains a given substring
            ?.forEach {
                filters.add(
                    or(
                        PostItem::title regex it.toRegex(RegexOption.IGNORE_CASE),
                        PostItem::description regex it.toRegex(RegexOption.IGNORE_CASE)
                    )
                )
            }

        params["skillsPossessed"]?.split(',')
            ?.filter(String::isNotBlank) // Filter out empty `&skillsPossessed=`
            ?.mapNotNull { enumFromStringSafe<Skills>(it) }
            ?.map { PostItem::skillsPossessed contains it }
            ?.let(filters::addAll)

        params["skillsSought"]?.split(',')
            ?.filter(String::isNotBlank) // Filter out empty `&skillsSought=`
            ?.mapNotNull { enumFromStringSafe<Skills>(it) }
            ?.map { PostItem::skillsSought contains it }
            ?.let(filters::addAll)

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

        val timezoneRange = params["timezones"]?.split('/')
        if (timezoneRange != null && timezoneRange.size == 2) {
            val timezoneStart: Int = timezoneRange[0].toInt()
            val timezoneEnd: Int = timezoneRange[1].toInt()

                    val timezones: MutableList<Int> = mutableListOf<Int>()
                    if (timezoneStart < timezoneEnd) {
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

    routing {
        route("/posts") {
            get {
                val params = call.parameters

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

                val posts = service.getPosts(and(getFilterFromParameters(params)), sort, page)

                // Set isFavourite on posts for this user if they're logged in
                call.request.header("Authorization")?.substring(7)
                    ?.let { JWT.decode(it) }
                    ?.let { it.getClaim("id").asString() }
                    ?.let { authService.getTokenSet(it) }
                    ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                    ?.let { favouritesList ->
                        posts.map { it.isFavourite = favouritesList.postIds.contains(it.id) }
                    }

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

                get("favourites") {
                    val params = call.parameters
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    val favourites = authService.getTokenSet(id)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }

                    // Sorting
                    // TODO: Error handling
                    val sortByFieldName = params["sortBy"] ?: "id"
                    val sortByField = PostItem::class.memberProperties.first { prop -> prop.name == sortByFieldName }
                    val sort = when (params["sortDir"].toString()) {
                        "asc" -> ascending(sortByField)
                        "desc" -> descending(sortByField)
                        else -> ascending(sortByField)
                    }

                    // Pagination
                    val page = params["page"]?.toInt() ?: 1

                    val favouritesFilters = mutableListOf<Bson>()
                    favourites?.postIds?.forEach {
                        favouritesFilters.add(and(PostItem::id eq it, PostItem::deletedAt eq null))
                    }

                    val posts = service.getPosts(and(and(favouritesFilters), and(getFilterFromParameters(params))), sort, page)
                    call.respond(posts)
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
                                it.timezoneOffsets = data.timezoneOffsets ?: it.timezoneOffsets

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
