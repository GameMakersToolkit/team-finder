package com.gmtkgamejam.plugins

import com.gmtkgamejam.models.DiscordGuildInfo
import com.gmtkgamejam.models.DiscordUserInfo
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.features.json.*
import io.ktor.client.features.json.serializer.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

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

            get("/userinfo") {
                val userInfo = "https://discordapp.com/api/users/@me"
                val guildInfo = "https://discordapp.com/api/users/@me/guilds"

                // TODO: This is definitely not how this works
                val jwt = call.request.header("Authorization")!!.substring(7)
                service.getOAuthPrincipal(jwt)?.let {

                    // TODO: If tokens are expired
                    val accessToken = it.accessToken

                    // TODO: Remove duplicate clients
                    // HttpClient duplicated to avoid [kotlinx.coroutines.JobCancellationException: Parent job is Completed]
                    // caused by reusing a HttpClient that has finished Job execution

                    val client1 = HttpClient(CIO) {
                        install(JsonFeature) {
                            serializer = KotlinxSerializer()
                        }
                    }

                    val user: DiscordUserInfo = client1.get(userInfo) {
                        headers {
                            append(HttpHeaders.Accept, "application/json")
                            append(HttpHeaders.Authorization, "Bearer $accessToken")
                        }
                    }
                    client1.close()

                    val client2 = HttpClient(CIO) {
                        install(JsonFeature) {
                            serializer = KotlinxSerializer()
                        }
                    }
                    val guilds: Array<DiscordGuildInfo> = client2.get(guildInfo) {
                        headers {
                            append(HttpHeaders.Accept, "application/json")
                            append(HttpHeaders.Authorization, "Bearer $accessToken")
                        }
                    }
                    client2.close()

                    user.is_in_guild = guilds.any { guild -> guild.id == "248204508960653312" }

                    return@get call.respond(user)
                }

                call.respondText("Couldn't load token set from DB", status = HttpStatusCode.NotFound)
            }
        }
    }
}
