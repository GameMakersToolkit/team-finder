@file:Suppress("ktlint:standard:no-wildcard-imports")

package com.gmtkvotingsystem.routing

import com.gmtkvotingsystem.Config
import com.gmtkvotingsystem.bot.DiscordBot
import com.gmtkvotingsystem.discord.getUserInfoAsync
import com.gmtkvotingsystem.discord.refreshTokenAsync
import com.gmtkvotingsystem.models.auth.UserInfo
import com.gmtkvotingsystem.respondJSON
import com.gmtkvotingsystem.services.AuthService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import java.util.*

fun Application.configureUserInfoRouting() {
    val bot: DiscordBot by inject()
    val service = AuthService()

    routing {
        authenticate("auth-jwt") {
            // These routes go through the authentication middleware defined in Auth.kt
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
                        val refreshedTokenSet =
                            refreshTokenAsync(
                                Config.getString("secrets.discord.client.id"),
                                Config.getString("secrets.discord.client.secret"),
                                it.refreshToken.toString(),
                            )

                        tokenSet.refresh(refreshedTokenSet)
                        service.updateTokenSet(tokenSet)

                        accessToken = refreshedTokenSet.access_token
                    }

                    val user = getUserInfoAsync(accessToken)

                    val displayName = bot.getDisplayNameForUser(user.id)
                    val hasPermissions = bot.doesUserHaveValidPermissions(user.id)
                    val isUserInGuild = bot.isUserInGuild(user.id)

                    val userInfo = UserInfo(user, displayName, isUserInGuild, hasPermissions)
                    return@get call.respond(userInfo)
                }

                call.respondJSON("Couldn't load token set from DB", status = HttpStatusCode.NotFound)
            }
        }
    }
}
