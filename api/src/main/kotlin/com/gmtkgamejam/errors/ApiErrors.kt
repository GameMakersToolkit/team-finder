package com.gmtkgamejam.errors

import io.ktor.http.*
import kotlinx.serialization.Serializable

@Serializable
data class ApiError(
    val code: String,
    val message: String,
    val details: Map<String, String>? = null,
)

@Serializable
data class ErrorEnvelope(
    val error: ApiError,
)

open class ApiException(
    val status: HttpStatusCode,
    val code: String,
    message: String,
    val details: Map<String, String>? = null,
) : RuntimeException(message)

class ValidationException(
    message: String,
    details: Map<String, String>? = null,
) : ApiException(HttpStatusCode.BadRequest, "validation_error", message, details)

class UnauthorizedException(
    message: String = "Unauthorized",
) : ApiException(HttpStatusCode.Unauthorized, "unauthorized", message)

class ForbiddenException(
    message: String = "Forbidden",
) : ApiException(HttpStatusCode.Forbidden, "forbidden", message)

class NotFoundException(
    message: String,
) : ApiException(HttpStatusCode.NotFound, "not_found", message)

class BannedUserException(
    discordId: String,
) : ApiException(HttpStatusCode.Forbidden, "banned_user", "User '$discordId' is banned from this action")
