package com.gmtkgamejam.plugins;

import com.gmtkgamejam.models.PostItem
import com.gmtkgamejam.models.admin.DeletePostDto
import com.gmtkgamejam.models.admin.ReportedUsersClearDto
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.bson.conversions.Bson
import org.litote.kmongo.and
import org.litote.kmongo.descending
import org.litote.kmongo.eq
import org.litote.kmongo.gt
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun Application.configureAdminRouting() {

    val service = PostService()

    routing {
        // TODO: Implement Admin account authentication
        authenticate("auth-jwt-admin") {
            route("/admin") {
                route("/reports") {
                    get {
                        val filters = mutableListOf(PostItem::deletedAt eq null, PostItem::reportCount gt 0)
                        call.respond(service.getPosts(and(filters), descending(PostItem::reportCount)))
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
                route("/post") {
                    delete {
                        val data = call.receive<DeletePostDto>()
                        service.getPost(data.postId.toLong())?.let {
                            it.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            service.updatePost(it)
                            return@delete call.respond(it)
                        }

                        call.respondText("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }
}
