package com.gmtkgamejam.routing

import com.gmtkgamejam.bot.Permissions
import com.gmtkgamejam.models.bot.dtos.BotDmDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.BotService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory


fun Application.configureDiscordBotRouting() {

    val logger: Logger = LoggerFactory.getLogger(javaClass)

    val authService = AuthService()
    val botService = BotService()

    val permissions = Permissions()

    routing {
        route("/{jamId}") {
            route("/bot") {
                // TODO: /info route

                authenticate("auth-jwt") {
                    post("/dm") {
                        val data = call.receive<BotDmDto>()

                        val tokenSet = authService.getTokenSet(call) ?: return@post call.respondJSON(
                            "Your request couldn't be authorised",
                            status = HttpStatusCode.Unauthorized
                        )

                        val recipientId = data.recipientId
                        val senderId = tokenSet.discordId

                        if (!permissions.canUserSendMessageToThisUser(recipientId, senderId)) {
                            return@post call.respondJSON(
                                "You can't message a single user again so quickly",
                                status = HttpStatusCode.TooManyRequests
                            )
                        }

                        if (!permissions.canUserSendMessage(senderId)) {
                            return@post call.respondJSON(
                                "You are sending too many messages - please wait a few minutes and try again",
                                status = HttpStatusCode.TooManyRequests
                            )
                        }

                        try {
                            val jamId = call.parameters["jamId"]!!
                            botService.getBot(jamId)
                                ?.let { it.createContactUserPingMessage(recipientId, senderId) }
                                ?.let { permissions.trackSuccessfulMessage(recipientId, senderId) }
                                ?.let { return@post call.respond(it) }

                            return@post call.respondJSON(
                                "Could not send ping message",
                                HttpStatusCode.InternalServerError
                            )
                        } catch (ex: Exception) {
                            logger.error("Could not create ping message: $ex")
                            return@post call.respondJSON(
                                "This message could not be sent, please inform the Team Finder Support group in Discord",
                                status = HttpStatusCode.NotAcceptable
                            )
                        }
                    }
                }
            }
        }
    }
}
