package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.Team
import com.gmtkgamejam.models.TeamCreateDto
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Application.configureTeamRouting() {
    val teams = mutableListOf(
        Team(1, "Dotwo", "1", "Test Team 1", 255, "en", "2021-08-13 14:51:00", "2021-08-13 14:51:00", "2021-08-13 14:51:01",  0),
        Team(2, "Slam", "2", "Test Team 2", 255, "en", "2021-08-13 14:51:01", "2021-08-13 14:51:01", "",  0),
        Team(3, "Brysen", "3", "Test Team 3", 255, "en", "2021-08-13 14:51:02", "2021-08-13 14:51:02", "",  0),
        Team(4, "Dotwo", "1", "Test Team 4", 255, "en", "2021-08-13 14:51:03", "2021-08-13 14:51:03", "",  0),
    )
    routing {
        route("/teams") {
            get {
                call.respond(teams)
            }
            post {
                val data = call.receive<TeamCreateDto>()
                val team: Team = Team.fromCreateDto(data)
                teams.add(team)
                call.respond(teams)
            }
            get("{id}") {
                val id = call.parameters["id"]!!.toInt()
                call.respond(teams[id - 1])
            }

            route("/mine") {
                get {
                    call.respond(teams[0])
                }

                put {
                    val data = call.receive<TeamCreateDto>()
                    val team = teams[0]
                    // FIXME: Don't just brute force update all given fields
                    team.author = data.author.ifEmpty { team.author }
                    team.authorId = data.authorId.ifEmpty { team.authorId }
                    team.description = data.description.ifEmpty { team.description }
                    team.skillsetMask = data.skillsetMask
                    team.languages = data.languages.ifEmpty { team.languages }

                    teams[0] = team
                    call.respond(teams[0])
                }

                delete {
                    teams.removeAt(0)
                    call.respondText("Team deleted", status = HttpStatusCode.OK)
                }
            }

            route("/report")
            {
                post {
                    teams[0].reportCount++
                    call.respondText("Report received", status = HttpStatusCode.OK)
                }
            }
        }
    }
}
