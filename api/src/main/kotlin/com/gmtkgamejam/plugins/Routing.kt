package com.gmtkgamejam.plugins

import com.gmtkgamejam.models.DiscordGuildInfo
import com.gmtkgamejam.models.DiscordRefreshTokenResponse
import com.gmtkgamejam.models.DiscordUserInfo
import com.gmtkgamejam.models.UserInfo
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.features.json.*
import io.ktor.client.features.json.serializer.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import java.util.*

fun Application.configureRouting() {

    val service = AuthService()

    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        authenticate("auth-jwt") { // These routes go through the authentication middleware defined in Auth.kt
            get("/hello") {
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()
                val expiresAt = principal?.expiresAt?.time?.minus(System.currentTimeMillis())

                call.respondText("Hello, id: $id and expires at: $expiresAt")
            }

            // TODO: Move this into a better named file?
            get("/userinfo") {
                val userInfo = "https://discordapp.com/api/users/@me"
                val guildInfo = "https://discordapp.com/api/users/@me/guilds"
                val refreshTokenEndpoint = "https://discord.com/api/oauth2/token"

                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()

                service.getOAuthPrincipal(id!!)?.let {
                    val tokenSet = it

                    val client = HttpClient(CIO) {
                        install(JsonFeature) {
                            serializer = KotlinxSerializer()
                        }
                    }

                    // If access token has expired, try a dirty inline refresh
                    var accessToken = tokenSet.accessToken
                    val tokenHasExpired = tokenSet.expiry <= Date(System.currentTimeMillis())
                    if (tokenHasExpired) {
                        val refreshedTokenSet = client.post<DiscordRefreshTokenResponse>(refreshTokenEndpoint) {
                            body = FormDataContent(Parameters.build {
                                append("client_id", environment.config.property("secrets.discord.client.id").getString())
                                append("client_secret", environment.config.property("secrets.discord.client.secret").getString())
                                append("grant_type", "refresh_token")
                                append("refresh_token", it.refreshToken.toString())
                            })
                        }

                        tokenSet.refresh(refreshedTokenSet)
                        service.updateTokenSet(tokenSet)

                        accessToken = refreshedTokenSet.access_token
                    }


                    val userRequest: Deferred<DiscordUserInfo> = async {
                        client.get(userInfo) {
                            headers {
                                append(HttpHeaders.Accept, "application/json")
                                append(HttpHeaders.Authorization, "Bearer $accessToken")
                            }
                        }
                    }

                    val guildsRequest: Deferred<Array<DiscordGuildInfo>> = async {
                        client.get(guildInfo) {
                            headers {
                                append(HttpHeaders.Accept, "application/json")
                                append(HttpHeaders.Authorization, "Bearer $accessToken")
                            }
                        }
                    }

                    val user = userRequest.await()
                    val guilds = guildsRequest.await()

                    client.close()

                    val userinfo = UserInfo(user, guilds)
                    return@get call.respond(userinfo)
                }

                call.respondText("Couldn't load token set from DB", status = HttpStatusCode.NotFound)
            }
        }
    }
}
