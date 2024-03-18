package com.gmtkgamejam.routing

import com.gmtkgamejam.services.JamService
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureJamRouting() {
    val jamService = JamService()

    routing {
        route("/jams") {
            get {
                call.respond(jamService.getJams())
            }
        }
    }
}