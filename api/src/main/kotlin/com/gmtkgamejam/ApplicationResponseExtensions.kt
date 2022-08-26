package com.gmtkgamejam

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*

suspend fun ApplicationCall.respondJSON(
    text: String,
    status: HttpStatusCode? = null,
) {
    if (status != null) {
        response.status(status)
    }

    respond(mapOf("message" to text))
}
