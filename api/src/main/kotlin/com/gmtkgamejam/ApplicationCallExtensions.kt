package com.gmtkgamejam

import com.auth0.jwt.JWT
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.services.AuthService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

fun ApplicationCall.getAuthTokenSet(authService: AuthService): AuthTokenSet? {
    return this.request.header("Authorization")
        ?.substringAfter("Bearer ")
        ?.let { JWT.decode(it) }?.getClaim("id")?.asString()
        ?.let { authService.getTokenSet(it) }
}

suspend fun ApplicationCall.respondJSON(text: String, status: HttpStatusCode? = null) {
    status?.let { response.status(it) }
    respond(mapOf("message" to text))
}
