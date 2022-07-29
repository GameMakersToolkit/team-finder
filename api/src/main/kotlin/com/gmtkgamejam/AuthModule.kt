package com.gmtkgamejam

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.Config
import com.gmtkgamejam.discord.discordHttpClient
import com.gmtkgamejam.services.AuthService
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.http.*

@Suppress("unused")
fun Application.authModule() {
    // Set config at first point of entry
    Config.initConfig(environment.config)

    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { Config.getString("api.host") + "/callback" }
            providerLookup = {
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
