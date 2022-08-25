package com.gmtkgamejam.routing

import com.gmtkgamejam.models.FavouritesDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.http.*
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
                    val postToFavourite = call.receive<FavouritesDto>()

                    authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                        ?.also { it.postIds.add(postToFavourite.postId) }
                        ?.let { favouritesService.saveFavourites(it) }
                        ?.let { return@post call.respond(it) }

                    call.respondJSON("Favourite couldn't be added", status = HttpStatusCode.BadRequest)
                }
                delete {
                    val postToUnFavourite = call.receive<FavouritesDto>()

                    authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                        ?.also { it.postIds.remove(postToUnFavourite.postId) }
                        ?.let { favouritesService.saveFavourites(it) }
                        ?.let { return@delete call.respond(it) }

                    call.respondJSON("Favourite couldn't be added", status = HttpStatusCode.BadRequest)
                }
            }
        }
    }
}
