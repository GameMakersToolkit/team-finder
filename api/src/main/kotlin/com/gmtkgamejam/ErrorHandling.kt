package com.gmtkgamejam

import com.gmtkgamejam.errors.ApiException
import com.gmtkgamejam.errors.ApiError
import com.gmtkgamejam.errors.ErrorEnvelope
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("ErrorHandling")

fun Application.configureErrorHandling() {
    install(StatusPages) {
        exception<ApiException> { call, ex ->
            call.respond(
                ex.status,
                ErrorEnvelope(ApiError(ex.code, ex.message ?: "Unexpected error", ex.details))
            )
        }

        exception<Throwable> { call, ex ->
            logger.error("Unhandled server exception", ex)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorEnvelope(ApiError("internal_error", "Internal server error"))
            )
        }
    }
}
