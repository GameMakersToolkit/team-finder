package com.gmtkgamejam.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
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

const val secret = "secret"
const val issuer = "http://0.0.0.0:8080/"
const val audience = "http://0.0.0.0:8080/hello"

fun Application.configureAuthRouting() {
    routing {
        authenticate("auth-oauth-discord") {
            get("/login") {
                // redirects to authorize url
            }
            get("/callback") {
                val token = JWT.create()
                    .withAudience(audience)
                    .withIssuer(issuer)
                    .withClaim("id", "some-id")
                    .withExpiresAt(Date(System.currentTimeMillis() + 60000))
                    .sign(Algorithm.HMAC256(secret))

                val principal: OAuthAccessTokenResponse.OAuth2? = call.principal()
                println(principal)
                call.respondRedirect("/hello?token=$token")
            }
        }
    }
}

fun Application.module() {
    install(Authentication) {
        oauth("auth-oauth-discord") {
            urlProvider = { "http://localhost:8080/callback" }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "discord",
                    authorizeUrl = "https://discord.com/api/oauth2/authorize",
                    accessTokenUrl = "https://discord.com/api/oauth2/token",
                    requestMethod = HttpMethod.Post,
                    clientId = System.getenv("DISCORD_CLIENT_ID"),
                    clientSecret = System.getenv("DISCORD_CLIENT_SECRET"),
                    defaultScopes = listOf("identify")
                )
            }
            client = httpClient
        }
        jwt("auth-jwt") {
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