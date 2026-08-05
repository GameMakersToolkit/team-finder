package com.gmtkgamejam.routing

import com.gmtkgamejam.models.posts.dtos.FavouritePostDto
import com.gmtkgamejam.respondData
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.FavouritesService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureFavouritesRouting() {

    val authService: AuthService by inject()
    val favouritesService: FavouritesService by inject()

    routing {
        authenticate("auth-jwt") {
            route("/favourites") {
                post {
                    val postToFavourite = call.receive<FavouritePostDto>()

                    val tokenSet = authService.getTokenSet(call)
                        ?: return@post call.respondJSON(
                            text = "Failed to favourite post.",
                            status = HttpStatusCode.BadRequest,
                            code = "favourite_failed",
                        )

                    return@post call.respondData(favouritesService.addPostAsFavourite(tokenSet.discordId, postToFavourite))
                }
                delete {
                    val postToUnFavourite = call.receive<FavouritePostDto>()

                    authService.getTokenSet(call)
                        ?.let { favouritesService.getFavouritesByUserId(it.discordId) }
                        ?.also { it.postIds.remove(postToUnFavourite.postId) }
                        ?.let { favouritesService.saveFavourites(it) }
                        ?.let { return@delete call.respondData(it) }

                    call.respondJSON("Favourite couldn't be added", status = HttpStatusCode.BadRequest, code = "favourite_failed")
                }
            }
        }
    }
}
