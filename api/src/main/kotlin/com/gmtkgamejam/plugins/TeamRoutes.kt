package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.Team
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

fun Application.configureTeamRouting() {
    val teams = listOf(
        1 to Team(1, "Dotwo", "1", "Test Team 1", 255, "en", "2021-08-13 14:51:00", "2021-08-13 14:51:00", "2021-08-13 14:51:01",  0),
        2 to Team(2, "Slam", "2", "Test Team 2", 255, "en", "2021-08-13 14:51:01", "2021-08-13 14:51:01", "",  0),
        3 to Team(3, "Brysen", "3", "Test Team 3", 255, "en", "2021-08-13 14:51:02", "2021-08-13 14:51:02", "",  0),
        4 to Team(4, "Dotwo", "1", "Test Team 4", 255, "en", "2021-08-13 14:51:03", "2021-08-13 14:51:03", "",  0),
    )
    routing {
        route("/teams") {
            get {
                call.respond(teams)
            }
            get("{id}") {
                val id = call.parameters["id"]!!.toInt()
                call.respond(teams[id])
            }
        }
    }
}
