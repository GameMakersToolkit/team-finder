package com.gmtkgamejam.routing

import com.gmtkgamejam.Config
import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.models.bot.dtos.BotDmDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.toJsonElement
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDateTime


fun Application.configureDiscordBotRouting() {

    val logger: Logger = LoggerFactory.getLogger(javaClass)

    val authService = AuthService()
    val bot: DiscordBot by inject()

    val userIdMessageTimes: MutableMap<String, LocalDateTime> = mutableMapOf()

    // Sender/Recipient Pair is stored as a String to allow for easier handling of JSON in monitoring
    val userIdPerUserMessageTimes: MutableMap<String, LocalDateTime> = mutableMapOf()

    // User A needs to wait X seconds between messaging User B and User C
    val userRateLimitTimeOutInSeconds = Config.getString("bot.userRateLimit").toLong()

    // User A can't ping User B more than once per X seconds
    val perUserTimeoutInSeconds = Config.getString("bot.perRecipientRateLimit").toLong()

    fun canUserSendMessage(userId: String): Boolean {
        val currentDateTime = LocalDateTime.now()
        val previousMessageDateTime = userIdMessageTimes[userId] ?: LocalDateTime.MIN

        return currentDateTime.isAfter(previousMessageDateTime.plusSeconds(userRateLimitTimeOutInSeconds))
    }

    fun canUserSendMessageToThisUser(senderId: String, recipientId: String): Boolean {
        val currentDateTime = LocalDateTime.now()

        val specificRecipientKey = Pair(senderId, recipientId).toString()
        val previousMessageDateTime = userIdPerUserMessageTimes[specificRecipientKey] ?: LocalDateTime.MIN

        return currentDateTime.isAfter(previousMessageDateTime.plusSeconds(perUserTimeoutInSeconds))
    }

    routing {
        authenticate("auth-jwt") {
            route("/bot") {
                post("/dm") {
                    val data = call.receive<BotDmDto>()

                    val tokenSet = authService.getTokenSet(call) ?: return@post call.respondJSON(
                        "Your request couldn't be authorised",
                        status = HttpStatusCode.Unauthorized
                    )

                    val senderId = tokenSet.discordId
                    val recipientId = data.recipientId

                    if (!canUserSendMessageToThisUser(senderId, recipientId)) {
                        return@post call.respondJSON(
                            "You can't message a single user again so quickly",
                            status = HttpStatusCode.TooManyRequests
                        )
                    }

                    if (!canUserSendMessage(senderId)) {
                        return@post call.respondJSON(
                            "You are sending too many messages - please wait a few minutes and try again",
                            status = HttpStatusCode.TooManyRequests
                        )
                    }

                    try {
                        val sendTime = LocalDateTime.now()

                        bot.createContactUserPingMessage(recipientId, senderId)
                        userIdMessageTimes[senderId] = sendTime
                        userIdPerUserMessageTimes[Pair(senderId, recipientId).toString()] = sendTime
                        logger.error("Sender [$senderId] has pinged Recipient [$recipientId] at [$sendTime]")
                        return@post call.respondJSON(
                            "Sender [$senderId] has pinged Recipient [$recipientId] at [$sendTime]",
                            status = HttpStatusCode.OK
                        )
                    } catch (ex: Exception) {
                        logger.error("Could not create ping message: $ex")
                        return@post call.respondJSON(
                            "This message could not be sent, please inform the Team Finder Support group in Discord",
                            status = HttpStatusCode.NotAcceptable
                        )
                    }
                }

                authenticate("auth-jwt-admin") {
                    get("/_monitoring") {
                        val data = mapOf(
                            "userTimeout" to userRateLimitTimeOutInSeconds,
                            "perRecipientTimeout" to perUserTimeoutInSeconds,
                            "userIdMessageTimes" to userIdMessageTimes,
                            "userIdPerUserMessageTimes" to userIdPerUserMessageTimes,
                        )

                        // .toJsonElement required as Ktor can't serialise collections of different element types
                        return@get call.respond(data.toJsonElement())
                    }
                }
            }
        }
    }
}
