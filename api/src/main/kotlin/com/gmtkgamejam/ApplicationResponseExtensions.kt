package com.gmtkgamejam

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.response.*

suspend fun ApplicationCall.respondJSON(
    text: String,
    status: HttpStatusCode? = null,
) {
    if (status != null) {
        response.status(status)
    }

    respond(mapOf("message" to text))
}
