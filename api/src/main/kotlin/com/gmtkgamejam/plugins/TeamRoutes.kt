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
                val team = call.parameters["id"]?.toLong()?.let { service.getTeam(it) }
                team?.let { call.respond(it) }
                call.respondText("Team not found", status = HttpStatusCode.NotFound)
            }

            route("/mine") {
                get {
                    // TODO: Pull ID from auth payload when set up
                    service.getTeam(1)?.let { call.respond(it) }
                    call.respondText("Team not found", status = HttpStatusCode.NotFound)
                }

                put {
                    val data = call.receive<TeamCreateDto>()
                    // TODO: Pull ID from auth payload when set up
                    service.getTeam(1)?.let {
                        // FIXME: Don't just brute force update all given fields
                        it.author = data.author.ifEmpty { it.author }
                        it.authorId = data.authorId.ifEmpty { it.authorId }
                        it.description = data.description.ifEmpty { it.description }
                        it.skillsetMask = data.skillsetMask
                        it.languages = data.languages.ifEmpty { it.languages }

                        service.updateTeam(it)
                        call.respond(it)
                    }

                    // TODO: Replace BadRequest with contextual response
                    call.respondText("Could not update team", status = HttpStatusCode.BadRequest)
                }

                delete {
                    // TODO: Manage user team, not just any ID
                    val data = call.receive<TeamDeleteDto>()

                    service.getTeam(data.teamId)?.let {
                        service.deleteTeam(it)
                        call.respondText("Team deleted", status = HttpStatusCode.OK)
                    }

                    // TODO: Replace BadRequest with contextual response
                    call.respondText("Could not delete team", status = HttpStatusCode.BadRequest)
                }
            }

            route("/report")
            {
                post {
                    val data = call.receive<TeamReportDto>()

                    service.getTeam(data.teamId)?.let {
                        it.reportCount++
                        service.updateTeam(it)
                        call.respond(it)
                    }

                    call.respondText("Team not found", status = HttpStatusCode.NotFound)
                }
            }
        }
    }
}
