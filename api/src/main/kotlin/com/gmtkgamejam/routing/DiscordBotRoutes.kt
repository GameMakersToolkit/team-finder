package com.gmtkgamejam.routing

import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.ktor.ext.inject


fun Application.configureDiscordBotRouting() {

    val authService = AuthService()
    val bot: DiscordBot by inject()

    routing {
        authenticate("auth-jwt") {
            route("/bot") {
                post("/dm") {
                    val params = call.parameters
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    authService.getTokenSet(id)
                        // TODO: Validate/rate limit
                        ?.let { bot.createContactUserPingMessage(params["recipientUserId"].toString(), it.discordId) }
                        ?.let { return@post call.respond(it) }

                    call.respondText("lolno")
                }
            }
        }
    }
}