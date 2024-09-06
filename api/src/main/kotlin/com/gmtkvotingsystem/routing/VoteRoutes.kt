package com.gmtkvotingsystem.routing

import com.gmtkvotingsystem.getAuthFromCall
import com.gmtkvotingsystem.models.VotesDTO
import com.gmtkvotingsystem.services.AuthService
import com.gmtkvotingsystem.services.ThemeService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureVoteRouting() {
    val authService = AuthService()
    val themeService = ThemeService()

    routing {
        authenticate("auth-jwt") {
            get("/votes") {
                val auth = getAuthFromCall(authService, call) ?: return@get call.respond(HttpStatusCode.BadRequest)

                call.respond(mapOf("votes" to themeService.getAsVotesForUser(auth.discordId)))
            }

            post("/votes") {
                val auth = getAuthFromCall(authService, call) ?: return@post call.respond(HttpStatusCode.BadRequest)
                val data = call.receive<VotesDTO>()

                if (data.votes.any { it.score < -2 || it.score > 2 }) {
                    return@post call.respond(HttpStatusCode.BadRequest)
                }

                themeService.setAsVotesForUser(auth.discordId, data)

                call.respond(themeService.getForUser(auth.discordId))
            }
        }
    }
}
