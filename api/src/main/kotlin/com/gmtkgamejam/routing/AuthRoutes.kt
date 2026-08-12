package com.gmtkgamejam.routing

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.gmtkgamejam.Config
import com.gmtkgamejam.extractJamIdFromOAuthState
import com.gmtkgamejam.respondData
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.discord.getUserInfoAsync
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.services.AuthService
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import java.security.SecureRandom
import java.util.*

fun Application.configureAuthRouting() {

    val config: Config by inject()
    val service: AuthService by inject()

    routing {
        authenticate("auth-oauth-discord") {
            get("/login") {
                // redirects to authorize url
            }
            get("/callback") {
                val jamId = extractJamIdFromOAuthState(call.parameters["state"])
                    ?: return@get call.respondJSON(
                        text = "Invalid OAuth callback state",
                        status = HttpStatusCode.BadRequest,
                        code = "invalid_oauth_state"
                    )
                val secret = config.getString("jwt.secret")
                val issuer = config.getString("jwt.issuer")
                val audience = config.getString("jwt.audience")

                val lifespanOfAppJwt = config.getString("jwt.sessionLifespanMs").toLongOrNull() ?: 86_400_000L

                // A securely random ID is used to ensure a JWT is unique, and that another JWT can't be brute-forced
                val randomId = getSecureId()

                val token = JWT.create()
                    .withAudience(audience)
                    .withIssuer(issuer)
                    .withClaim("id", randomId)
                    .withClaim("jamId", jamId)
                    .withExpiresAt(Date(System.currentTimeMillis() + lifespanOfAppJwt))
                    .sign(Algorithm.HMAC256(secret))

                call.principal<OAuthAccessTokenResponse.OAuth2>()?.let {
                    val user = getUserInfoAsync(it.accessToken)
                    val tokenSet = AuthTokenSet(
                        randomId,
                        jamId,
                        user.id,
                        it.accessToken,
                        it.tokenType,
                        Date(System.currentTimeMillis() + it.expiresIn),
                        it.refreshToken
                    )
                    service.storeTokenSet(tokenSet)

                    val redirectTarget = config.getString("ui.host")
                    call.respondRedirect("$redirectTarget/$jamId/login/authorized?token=$token")
                }
            }
        }

        authenticate("auth-jwt") {
            post("/logout") {
                val id = call.principal<JWTPrincipal>()?.payload?.getClaim("id")?.asString()
                    ?: return@post call.respondJSON("Invalid token", HttpStatusCode.Unauthorized, "invalid_token")

                service.deleteTokenSet(id)
                call.respondData(mapOf("message" to "Logged out"))
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
