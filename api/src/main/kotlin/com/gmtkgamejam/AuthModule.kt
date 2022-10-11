package com.gmtkgamejam

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.discord.discordHttpClient
import com.gmtkgamejam.services.AuthService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import java.net.URLEncoder

@Suppress("unused")
fun Application.authModule() {
    // Set config at first point of entry
    Config.initConfig(environment.config)

    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { Config.getString("api.host") + "/callback" }
            providerLookup = {
                val queryParams = this.request.queryParameters

                // If the auth fails and redirects back to the API, we need to exit out back to the UI
                // Otherwise we'll infinitely loop against Discord
                val authAlreadyFailed = queryParams.contains("error")
                if (authAlreadyFailed) {
                    val uiHost = Config.getString("ui.host")
                    val error = queryParams["error"]
                    val description = URLEncoder.encode(queryParams["error_description"], "UTF-8")

                    // Grim-but-functional way to kick the user back to the UI instead of getting stuck in a loop
                    OAuthServerSettings.OAuth2ServerSettings(
                        name = "authorisation-failure",
                        authorizeUrl = "$uiHost/?error=$error&error_description=$description",
                        accessTokenUrl = "",
                        clientId = "",
                        clientSecret = "",
                    )
                } else {
                    OAuthServerSettings.OAuth2ServerSettings(
                        name = "discord",
                        authorizeUrl = "https://discord.com/api/oauth2/authorize",
                        accessTokenUrl = "https://discord.com/api/oauth2/token",
                        requestMethod = HttpMethod.Post,
                        clientId = Config.getString("secrets.discord.client.id"),
                        clientSecret = Config.getString("secrets.discord.client.secret"),
                        defaultScopes = listOf("identify", "guilds.members.read")
                    )
                }
            }
            client = discordHttpClient()
        }
        jwt("auth-jwt") {
            verifier(buildJWTVerifier())
            validate {
                val id = it.payload.getClaim("id").asString()
                val tokenSet = AuthService().getTokenSet(id)

                // We deliberately aren't checking `expiry` here (which is for the accessToken only),
                // just the that record exists; the collection's TTL will clear out expired auth sessions
                return@validate if (tokenSet != null) JWTPrincipal(it.payload) else null
            }
        }
        jwt("auth-jwt-admin") {
            verifier(buildJWTVerifier())
            validate {
                val id = it.payload.getClaim("id").asString()
                val tokenSet = AuthService().getTokenSet(id)
                val adminDiscordIds = Config.getList("jam.adminIds")

                return@validate if (tokenSet != null && adminDiscordIds.contains(tokenSet.discordId)) JWTPrincipal(it.payload) else null
            }
        }
    }
}

fun buildJWTVerifier(): JWTVerifier {
    val secret = Config.getString("jwt.secret")
    val issuer = Config.getString("jwt.issuer")
    val audience = Config.getString("jwt.audience")

    return JWT
        .require(Algorithm.HMAC256(secret))
        .withAudience(audience)
        .withIssuer(issuer)
        .build()!!
}
