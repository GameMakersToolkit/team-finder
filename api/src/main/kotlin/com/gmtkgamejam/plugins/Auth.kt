package com.gmtkgamejam.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.Config
import com.gmtkgamejam.discord.discordHttpClient
import com.gmtkgamejam.discord.getUserInfoAsync
import com.gmtkgamejam.models.AuthTokenSet
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import java.security.SecureRandom
import java.util.*

fun Application.configureAuthRouting() {

    val service = AuthService()

    routing {
        authenticate("auth-oauth-discord") {
            get("/login") {
                // redirects to authorize url
            }
            get("/callback") {
                val secret = Config.getString("jwt.secret")
                val issuer = Config.getString("jwt.issuer")
                val audience = Config.getString("jwt.audience")

                val lifespanOfAppJwt = 86400000 // A user is logged into the Team Finder for 24 hours

                // A securely random ID is used to ensure a JWT is unique, and that another JWT can't be brute-forced
                val randomId = getSecureId()

                val token = JWT.create()
                    .withAudience(audience)
                    .withIssuer(issuer)
                    .withClaim("id", randomId)
                    .withExpiresAt(Date(System.currentTimeMillis() + lifespanOfAppJwt))
                    .sign(Algorithm.HMAC256(secret))

                call.principal<OAuthAccessTokenResponse.OAuth2>()?.let {
                    val user = getUserInfoAsync(it.accessToken)
                    val tokenSet = AuthTokenSet(randomId, user.id, it.accessToken, it.tokenType, Date(System.currentTimeMillis() + it.expiresIn), it.refreshToken)
                    service.storeTokenSet(tokenSet)

                    val redirectTarget = Config.getString("ui.host")
                    call.respondRedirect("$redirectTarget/login/authorized?token=$token")
                }
            }
        }
    }
}

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
                    defaultScopes = listOf("identify", "guilds")
                )
            }
            client = discordHttpClient()
        }
        jwt("auth-jwt") {
            verifier(buildJWTVerifier(environment))
            validate {
                val id = it.payload.getClaim("id").asString()
                val tokenSet = AuthService().getTokenSet(id)

                // We deliberately aren't checking `expiry` here (which is for the accessToken only),
                // just the that record exists; the collection's TTL will clear out expired auth sessions
                return@validate if (tokenSet != null) JWTPrincipal(it.payload) else null
            }
        }
        jwt("auth-jwt-admin") {
            verifier(buildJWTVerifier(environment))
            validate {
                val id = it.payload.getClaim("id").asString()
                val tokenSet = AuthService().getTokenSet(id)
                val adminDiscordIds = Config.getList("jam.adminIds")

                return@validate if (tokenSet != null && adminDiscordIds.contains(tokenSet.discordId)) JWTPrincipal(it.payload) else null
            }
        }
    }
}

fun buildJWTVerifier(environment: ApplicationEnvironment): JWTVerifier {
    val secret = Config.getString("jwt.secret")
    val issuer = Config.getString("jwt.issuer")
    val audience = Config.getString("jwt.audience")

    return JWT
        .require(Algorithm.HMAC256(secret))
        .withAudience(audience)
        .withIssuer(issuer)
        .build()!!
}

fun getSecureId() : String {
    // Arbitrary array size, but inflated to give overflow in case byte->string encoding drops any characters
    val bytes = ByteArray(64)
    SecureRandom().nextBytes(bytes)

    val encoder: Base64.Encoder = Base64.getUrlEncoder().withoutPadding()
    return encoder.encodeToString(bytes)
}
