package com.gmtkgamejam.routing

import com.gmtkgamejam.Config
import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.models.BotDmDto
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.koin.ktor.ext.inject
import java.time.LocalDateTime


fun Application.configureDiscordBotRouting() {

    val authService = AuthService()
    val bot: DiscordBot by inject()

    val userIdMessageTimes: MutableMap<String, LocalDateTime> = mutableMapOf()
    val userIdPerUserMessageTimes: MutableMap<Pair<String, String>, LocalDateTime> = mutableMapOf()

    // User A needs to wait X seconds between messaging User B and User C
    val userRateLimitTimeOutInSeconds = Config.getString("bot.userRateLimit").toLong()

    // User A can't ping User B more than once per X seconds
     val perUserTimeoutInSeconds = Config.getString("bot.perRecipientRateLimit").toLong()

    fun isUserWithinRateLimit(userId: String): Boolean {
        val currentDateTime = LocalDateTime.now()
        val previousMessageDateTime = userIdMessageTimes[userId] ?: LocalDateTime.MIN

        return !previousMessageDateTime.plusSeconds(userRateLimitTimeOutInSeconds).isAfter(currentDateTime)
    }

    fun isUserWithinPerUserTimeout(senderId: String, recipientId: String): Boolean {
        val currentDateTime = LocalDateTime.now()

        val specificRecipientKey = Pair(senderId, recipientId)
        val previousMessageDateTime = userIdPerUserMessageTimes[specificRecipientKey] ?: LocalDateTime.MIN

        return !previousMessageDateTime.plusSeconds(perUserTimeoutInSeconds).isAfter(currentDateTime)
    }

    routing {
        authenticate("auth-jwt") {
            route("/bot") {
                post("/dm") {
                    val data = call.receive<BotDmDto>()
                    val principal = call.principal<JWTPrincipal>()!!
                    val id = principal.payload.getClaim("id").asString()

                    val tokenSet = authService.getTokenSet(id) ?: return@post call.respondText("lolno - auth")

                    val senderId = tokenSet.discordId
                    val recipientId = data.recipientId
                    if (!isUserWithinRateLimit(senderId)){
                        return@post call.respondText("lolno - user rate limit")
                    }

                    if (!isUserWithinPerUserTimeout(senderId, recipientId)) {
                        return@post call.respondText("lolno - recipient rate limit")
                    }

                    bot.createContactUserPingMessage(recipientId, senderId)
                    userIdMessageTimes[senderId] = LocalDateTime.now()
                    userIdPerUserMessageTimes[Pair(senderId, recipientId)] = LocalDateTime.now()
                    return@post call.respond(it)
                }
            }
        }
    }
}