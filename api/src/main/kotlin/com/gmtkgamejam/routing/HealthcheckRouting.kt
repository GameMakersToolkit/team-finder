package com.gmtkgamejam.routing

import com.mongodb.client.MongoClient
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withTimeout
import org.bson.Document
import org.koin.ktor.ext.inject

fun Application.configureHealthcheckRouting() {
    val client: MongoClient by inject()

    routing {
        get("/health") {
            val health = evaluateMongoHealth(client)
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
            val health = evaluateMongoHealth(client)
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

private suspend fun evaluateMongoHealth(client: MongoClient): HealthStatus {
    return try {
        var isDbAvailable = false
        withTimeout(300L) {
            val db = client.getDatabase("team-finder")
            val pingResult = db.runCommand(Document("ping", 1)).append("maxTimeMS", 200)
            isDbAvailable = pingResult["ok"].toString() == "1" || pingResult["ok"].toString() == "1.0"
        }
        if (isDbAvailable) HealthStatus(isUp = true) else HealthStatus(isUp = false, reason = "unavailable")
    } catch (_: TimeoutCancellationException) {
        HealthStatus(isUp = false, reason = "timeout")
    } catch (e: Exception) {
        HealthStatus(isUp = false, reason = e.message ?: "unknown")
    }
}
