package com.gmtkgamejam.routing

import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.JamService
import io.ktor.http.*
import io.ktor.server.application.*
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
        }
    }
}