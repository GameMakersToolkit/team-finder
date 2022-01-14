package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.PostItem
import com.gmtkgamejam.models.admin.DeleteTeamDto
import com.gmtkgamejam.models.admin.ReportedUsersClearDto
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.litote.kmongo.gt
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun Application.configureAdminRouting() {

    val service = PostService()

    routing {
        route("/admin") {
            route("/reports") {
                get {
                    call.respond(service.getPosts(PostItem::reportCount gt 0))
                }
                post("/clear") {
                    val data = call.receive<ReportedUsersClearDto>()
                    service.getPost(data.teamId.toLong())?.let {
                        it.reportCount = 0
                        service.updatePost(it)
                        return@post call.respond(it)
                    }

                    call.respondText("Post not found", status = HttpStatusCode.NotFound)
                }
            }
            route("/teams") {
                delete {
                    val data = call.receive<DeleteTeamDto>()
                    service.getPost(data.teamId.toLong())?.let {
                        it.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                        service.updatePost(it)
                        return@delete call.respond(it)
                    }

                    call.respondText("Team not found", status = HttpStatusCode.NotFound)
                }
            }
        }
    }
}
