package com.gmtkgamejam.routing

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.Config
import com.gmtkgamejam.discord.getUserInfoAsync
import com.gmtkgamejam.models.AuthTokenSet
import com.gmtkgamejam.services.AuthService
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
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
                    val tokenSet = AuthTokenSet(
                        randomId,
                        user.id,
                        it.accessToken,
                        it.tokenType,
                        Date(System.currentTimeMillis() + it.expiresIn),
                        it.refreshToken
                    )
                    service.storeTokenSet(tokenSet)

                    val redirectTarget = Config.getString("ui.host")
                    call.respondRedirect("$redirectTarget/login/authorized?token=$token")
                }
            }
        }
    }
}

fun getSecureId(): String {
    // Arbitrary array size, but inflated to give overflow in case byte->string encoding drops any characters
    val bytes = ByteArray(64)
    SecureRandom().nextBytes(bytes)

    val encoder: Base64.Encoder = Base64.getUrlEncoder().withoutPadding()
    return encoder.encodeToString(bytes)
}
