package com.gmtkgamejam

import com.gmtkgamejam.errors.ApiError
import com.gmtkgamejam.errors.ErrorEnvelope
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*

suspend fun ApplicationCall.respondData(
    data: Any,
    status: HttpStatusCode = HttpStatusCode.OK,
) {
    response.status(status)
    respond(mapOf("data" to data))
}

suspend fun ApplicationCall.respondJSON(
    text: String,
    status: HttpStatusCode = HttpStatusCode.BadRequest,
    code: String = "request_error",
    details: Map<String, String>? = null,
) {
    response.status(status)
    respond(ErrorEnvelope(ApiError(code, text, details)))
}
