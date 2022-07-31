package com.gmtkgamejam.routing

import com.gmtkgamejam.Config
import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.discord.getGuildInfoAsync
import com.gmtkgamejam.discord.getUserInfoAsync
import com.gmtkgamejam.discord.refreshTokenAsync
import com.gmtkgamejam.models.UserInfo
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AuthService
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.*

fun Application.configureUserInfoRouting() {

    val logger: Logger = LoggerFactory.getLogger(javaClass)

    val bot: DiscordBot by inject()
    val service = AuthService()

    routing {
        authenticate("auth-jwt") { // These routes go through the authentication middleware defined in Auth.kt
            get("/hello") {
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()
                val expiresAt = principal?.expiresAt?.time?.minus(System.currentTimeMillis())

                call.respondJSON("Hello, id: $id and expires at: $expiresAt")
            }

            get("/userinfo") {
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()

                service.getTokenSet(id!!)?.let {
                    val tokenSet = it
                    var accessToken = tokenSet.accessToken

                    // If access token has expired, try a dirty inline refresh
                    val tokenHasExpired = tokenSet.expiry <= Date(System.currentTimeMillis())
                    if (tokenHasExpired) {
                        val refreshedTokenSet = refreshTokenAsync(
                            Config.getString("secrets.discord.client.id"),
                            Config.getString("secrets.discord.client.secret"),
                            it.refreshToken.toString()
                        )

                        tokenSet.refresh(refreshedTokenSet)
                        service.updateTokenSet(tokenSet)

                        accessToken = refreshedTokenSet.access_token
                    }

                    // TODO: Risk of rate limiting from Discord
                    val user = getUserInfoAsync(accessToken)
                    val hasPermissions = bot.doesUserHaveValidPermissions(user.id)

                    try {
                        // If the user doesn't belong to the jam guild, this call will return a 404
                        val guildInfo = getGuildInfoAsync(accessToken)

                        val userinfo = UserInfo(user, guildInfo, true, hasPermissions)
                        return@get call.respond(userinfo)
                    } catch (e: Exception) {
                        logger.warn("Exception thrown - user likely not in guild: $e")

                        val userinfo = UserInfo(user, null, false, hasPermissions)
                        return@get call.respond(userinfo)
                    }
                }

                call.respondJSON("Couldn't load token set from DB", status = HttpStatusCode.NotFound)
            }
        }
    }
}
