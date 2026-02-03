package com.gmtkgamejam.routing

import com.gmtkgamejam.Config
import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.discord.getUserInfoAsync
import com.gmtkgamejam.discord.refreshTokenAsync
import com.gmtkgamejam.models.auth.UserInfo
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AnalyticsService
import com.gmtkgamejam.services.AuthService
import com.gmtkgamejam.services.JamService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.launch
import org.koin.ktor.ext.inject
import java.time.LocalDateTime
import java.util.*

typealias UserId = String

fun Application.configureUserInfoRouting() {

    val config: Config by inject()
    val analyticsService: AnalyticsService by inject()
    val jamService: JamService by inject()
    val service: AuthService by inject()
    val bot: DiscordBot by inject()

    val shortLiveCache: MutableMap<UserId, Pair<LocalDateTime, UserInfo>> = mutableMapOf()

    routing {
        authenticate("auth-jwt") { // These routes go through the authentication middleware defined in Auth.kt
            get("/hello") {
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()
                val expiresAt = principal?.expiresAt?.time?.minus(System.currentTimeMillis())

                call.respondJSON("Hello, id: $id and expires at: $expiresAt")
            }

            get("/{jamId}/userinfo") {
                val jamId = call.parameters["jamId"]!! // TODO
                val jam = jamService.getJam(jamId)!! // TODO

                val currentTime = LocalDateTime.now()
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()

                service.getTokenSet(id!!)?.let {
                    val tokenSet = it

                    // Very short TTL cache to avoid unnecessary traffic for quick turnaround behaviour
                    // We don't expect the cache to expire during regular traffic
                    if (shortLiveCache.containsKey(tokenSet.discordId)) {
                        val (cacheSetTime, userInfo) = shortLiveCache[tokenSet.discordId]!!
                        shortLiveCache.remove(tokenSet.discordId)

                        // If the cache set was less than 5 minutes ago, don't hit discord again
                        if (currentTime < cacheSetTime.plusMinutes(5L)) {
                            // Refresh cache entry
                            shortLiveCache[userInfo.id] = Pair(LocalDateTime.now(), userInfo)
                            return@get call.respond(userInfo)
                        }
                    }

                    var accessToken = tokenSet.accessToken

                    // If access token has expired, try a dirty inline refresh
                    val tokenHasExpired = tokenSet.expiry <= Date(System.currentTimeMillis())
                    if (tokenHasExpired) {
                        val refreshedTokenSet = refreshTokenAsync(
                            config.getString("secrets.discord.client.id"),
                            config.getString("secrets.discord.client.secret"),
                            it.refreshToken.toString()
                        )

                        tokenSet.refresh(refreshedTokenSet)
                        service.updateTokenSet(tokenSet)

                        accessToken = refreshedTokenSet.access_token
                    }

                    val user = getUserInfoAsync(accessToken)

                    launch {
                        analyticsService.trackLogin()
                    }

                    val displayName = bot.getDisplayNameForUser(jam.jamId, user.id)
                    val hasPermissions = bot.doesUserHaveValidPermissions(user.id)
                    val isUserInGuild = bot.isUserInGuild(jam.jamId, user.id)
                    val isAdmin = jam.adminIds.contains(user.id)

                    val userInfo = UserInfo(user, displayName, isUserInGuild, hasPermissions, isAdmin)
                    shortLiveCache[user.id] = Pair(LocalDateTime.now(), userInfo)
                    return@get call.respond(userInfo)
                }

                call.respondJSON("Couldn't load token set from DB", status = HttpStatusCode.NotFound)
            }
        }
    }
}
