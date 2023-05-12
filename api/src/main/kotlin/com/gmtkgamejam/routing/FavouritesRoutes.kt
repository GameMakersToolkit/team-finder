package com.gmtkgamejam.routing

import com.gmtkgamejam.models.posts.dtos.FavouritePostDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureFavouritesRouting() {

    val authService = AuthService()
    val favouritesService = FavouritesService()

    routing {
        authenticate("auth-jwt") {
            route("/favourites") {
                post {
                    val postToFavourite = call.receive<FavouritePostDto>()

                    val tokenSet = authService.getTokenSet(call)
                        ?: return@post call.respond(
                            status = HttpStatusCode.BadRequest,
                            mapOf("message" to "Failed to favourite post.")
                        )

                    return@post call.respond(favouritesService.addPostAsFavourite(tokenSet.discordId, postToFavourite))
                }
                delete {
                    val postToUnFavourite = call.receive<FavouritePostDto>()

                    authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                        ?.also { it.postIds.remove(postToUnFavourite.id) }
                        ?.let { favouritesService.saveFavourites(it) }
                        ?.let { return@delete call.respond(it) }

                    call.respondJSON("Favourite couldn't be added", status = HttpStatusCode.BadRequest)
                }
            }
        }
    }
}
