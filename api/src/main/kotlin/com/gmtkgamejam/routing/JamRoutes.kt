package com.gmtkgamejam.routing

import com.gmtkgamejam.models.jams.JamUpdateDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.JamService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureJamRouting() {
    val jamService: JamService by inject()

    routing {
        route("/jams") {
            get {
                return@get call.respond(jamService.getJams())
            }
        }

        route("/jams/{jamId}") {
            get {
                val jamId = call.parameters["jamId"]
                val jams = jamService.getJams()
                val jam = jams.find { jam -> jam.jamId == jamId }
                    ?: return@get call.respondJSON("No jam matched ID of $jamId", HttpStatusCode.NotFound)

                return@get call.respond(jam)
            }

            authenticate("auth-jwt-admin") {
                put {
                    val jamId = call.parameters["jamId"] ?: return@put call.respondJSON("Missing jamId", HttpStatusCode.BadRequest)
                    val jam = jamService.getJam(jamId)
                    if (jam == null) {
                        return@put call.respondJSON("No jam matched ID of $jamId", HttpStatusCode.NotFound)
                    }

                    val update = call.receive<JamUpdateDto>()

                    // TODO: Rest of jam fields
                    if (update.styles != null) {
                        jam.styles = update.styles.ifEmpty { jam.styles }
                    }

                    val updatedJam = jamService.updateJam(jam)
                    return@put call.respond(updatedJam)
                }
            }
        }
    }
}
