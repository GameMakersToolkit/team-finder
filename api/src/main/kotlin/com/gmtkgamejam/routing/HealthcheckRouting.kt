package com.gmtkgamejam.routing

import com.gmtkgamejam.db.DatabaseManager
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withTimeout
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.ktor.ext.inject

fun Application.configureHealthcheckRouting() {
    val dbManager: DatabaseManager by inject()

    routing {
        get("/health") {
            val health = evaluatePostgresHealth(dbManager)
            val statusCode = if (health.isUp) HttpStatusCode.OK else HttpStatusCode.ServiceUnavailable
            call.respond(
                statusCode,
                mapOf(
                    "status" to if (health.isUp) "UP" else "DOWN",
                    "database" to if (health.isUp) "UP" else "DOWN",
                    "reason" to health.reason,
                )
            )
        }

        // DigitalOcean can target this route for startup and liveness probes.
        get("/health/ready") {
            val health = evaluatePostgresHealth(dbManager)
            if (health.isUp) {
                call.respond(HttpStatusCode.OK, mapOf("status" to "ready"))
            } else {
                call.respond(HttpStatusCode.ServiceUnavailable, mapOf("status" to "not_ready", "reason" to health.reason))
            }
        }

        get("/health/live") {
            call.respond(HttpStatusCode.OK, mapOf("status" to "alive"))
        }
    }
}

private data class HealthStatus(val isUp: Boolean, val reason: String? = null)

private suspend fun evaluatePostgresHealth(dbManager: DatabaseManager): HealthStatus {
    return try {
        var isDbAvailable = false
        withTimeout(300L) {
            // Try a simple query to check database connectivity
            transaction(dbManager.database) {
                // Create a simple test table access - just select from it
                val result = org.jetbrains.exposed.sql.select { org.jetbrains.exposed.sql.castTo<Int>(org.jetbrains.exposed.sql.literalString("1"), org.jetbrains.exposed.sql.IntegerColumnType()) }.limit(1).toList()
                isDbAvailable = true
            }
        }
        if (isDbAvailable) HealthStatus(isUp = true) else HealthStatus(isUp = false, reason = "unavailable")
    } catch (_: TimeoutCancellationException) {
        HealthStatus(isUp = false, reason = "timeout")
    } catch (e: Exception) {
        HealthStatus(isUp = false, reason = e.message ?: "unknown")
    }
}
