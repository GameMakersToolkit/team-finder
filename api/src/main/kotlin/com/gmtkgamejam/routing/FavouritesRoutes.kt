package com.gmtkgamejam.routing

import com.gmtkgamejam.models.FavouritesDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Application.configureFavouritesRouting() {

    val authService = AuthService()
    val favouritesService = FavouritesService()

    routing {
        authenticate("auth-jwt") {
            route("/favourites") {
                post {
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    val postToFavourite = call.receive<FavouritesDto>()

                    authService.getTokenSet(id)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                        ?.also { it.postIds.add(postToFavourite.postId) }
                        ?.let { favouritesService.saveFavourites(it) }
                        ?.let { return@post call.respond(it) }

                    call.respondJSON("Favourite couldn't be added", status = HttpStatusCode.BadRequest)
                }
                delete {
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    val postToUnFavourite = call.receive<FavouritesDto>()

                    authService.getTokenSet(id)
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
