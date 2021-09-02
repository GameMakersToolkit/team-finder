package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.Team
import com.gmtkgamejam.models.TeamCreateDto
import com.gmtkgamejam.models.TeamDeleteDto
import com.gmtkgamejam.models.TeamReportDto
import com.gmtkgamejam.services.TeamService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Application.configureTeamRouting() {
    val service = TeamService()

    routing {
        route("/teams") {
            get {
                call.respond(service.getTeams())
            }
            post {
                val data = call.receive<TeamCreateDto>()
                val team = Team.fromCreateDto(data)

                service.createTeam(team)
                call.respond(team)
            }
            get("{id}") {
                val id = call.parameters["id"]!!.toLong()
                val team = service.getTeam(id)

                if (team == null) {
                    call.respondText("Team not found", status = HttpStatusCode.NotFound)
                }

                call.respond(team!!)
            }

            route("/mine") {
                get {
                    // TODO: Pull ID from auth payload when set up
                    val team = service.getTeam(1)
                    call.respond(team!!)
                }

                put {
                    val data = call.receive<TeamCreateDto>()
                    // TODO: Pull ID from auth payload when set up
                    val team = service.getTeam(1)!!

                    // FIXME: Don't just brute force update all given fields
                    team.author = data.author.ifEmpty { team.author }
                    team.authorId = data.authorId.ifEmpty { team.authorId }
                    team.description = data.description.ifEmpty { team.description }
                    team.skillsetMask = data.skillsetMask
                    team.languages = data.languages.ifEmpty { team.languages }

                    service.updateTeam(team)
                    call.respond(team)
                }

                delete {
                    // TODO: Manage user team, not just any ID
                    val data = call.receive<TeamDeleteDto>()
                    val team = service.getTeam(data.teamId)

                    if (team == null) {
                        call.respondText("Team not found", status = HttpStatusCode.NotFound)
                    }

                    service.deleteTeam(team!!)
                    call.respondText("Team deleted", status = HttpStatusCode.OK)
                }
            }

            route("/report")
            {
                post {
                    val data = call.receive<TeamReportDto>()
                    val team = service.getTeam(data.teamId)

                    if (team == null) {
                        call.respondText("Team not found", status = HttpStatusCode.NotFound)
                    }

                    team!!.reportCount++
                    service.updateTeam(team)
                    call.respond(team)
                }
            }
        }
    }
}
