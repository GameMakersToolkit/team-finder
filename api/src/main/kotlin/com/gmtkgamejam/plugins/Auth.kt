package com.gmtkgamejam.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.models.AuthTokenSet
import com.gmtkgamejam.services.AuthService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.features.json.*
import io.ktor.client.features.json.serializer.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import java.util.*

fun Application.configureAuthRouting() {

    val service = AuthService()

    routing {
        authenticate("auth-oauth-discord") {
            get("/login") {
                // redirects to authorize url
            }
            get("/callback") {
                val secret = environment.config.property("jwt.secret").getString()
                val issuer = environment.config.property("jwt.issuer").getString()
                val audience = environment.config.property("jwt.audience").getString()

                val lifespanOfAppJwt = 86400000 // A user is logged into the Team Finder for 24 hours

                val token = JWT.create()
                    .withAudience(audience)
                    .withIssuer(issuer)
                    .withClaim("id", "some-id")
                    .withExpiresAt(Date(System.currentTimeMillis() + lifespanOfAppJwt))
                    .sign(Algorithm.HMAC256(secret))

                call.principal<OAuthAccessTokenResponse.OAuth2>()?.let {
                    val tokenSet = AuthTokenSet(token, it.accessToken, it.tokenType, System.currentTimeMillis() + it.expiresIn, it.refreshToken)
                    service.storeTokens(tokenSet)

                    val redirectTarget = environment.config.property("ui.host").getString()
                    call.respondRedirect("$redirectTarget/login/authorized?token=$token")
                }
            }
        }
    }
}

fun Application.authModule() {
    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { environment.config.property("api.host").getString() + "/callback" }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "discord",
                    authorizeUrl = "https://discord.com/api/oauth2/authorize",
                    accessTokenUrl = "https://discord.com/api/oauth2/token",
                    requestMethod = HttpMethod.Post,
                    clientId = environment.config.property("secrets.discord.client.id").getString(),
                    clientSecret = environment.config.property("secrets.discord.client.secret").getString(),
                    defaultScopes = listOf("identify", "guilds")
                )
            }
            client = httpClient
        }
        jwt("auth-jwt") {
            val secret = environment.config.property("jwt.secret").getString()
            val issuer = environment.config.property("jwt.issuer").getString()
            val audience = environment.config.property("jwt.audience").getString()

            verifier(JWT
                .require(Algorithm.HMAC256(secret))
                .withAudience(audience)
                .withIssuer(issuer)
                .build())
            validate {
                if (it.payload.getClaim("id").asString() != "") {
                    JWTPrincipal(it.payload)
                } else null
            }
        }
    }
}

val httpClient = HttpClient(CIO) {
    install(JsonFeature) {
        serializer = KotlinxSerializer()
    }
}
