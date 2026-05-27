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
            try {
                var isDbAvailable = false
                withTimeout(500L) {
                    val db = client.getDatabase("team-finder")
                    val pingResult = db.runCommand(Document("ping", 1)).append("maxTimeMS", 250)
                    isDbAvailable = pingResult["ok"].toString() == "1" || pingResult["ok"].toString() == "1.0"
                }
                if (isDbAvailable) {
                    call.respond(HttpStatusCode.OK, mapOf("status" to "UP"))
                } else {
                    call.respond(HttpStatusCode.FailedDependency, mapOf("status" to "DOWN", "reason" to "unavailable"))
                }
            } catch (_: TimeoutCancellationException) {
                call.respond(HttpStatusCode.FailedDependency, mapOf("status" to "DOWN", "reason" to "timeout"))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.FailedDependency, mapOf("status" to "DOWN", "reason" to e.message))
            }
        }
    }
}
