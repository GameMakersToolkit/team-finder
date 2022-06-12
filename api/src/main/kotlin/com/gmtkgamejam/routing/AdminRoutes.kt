package com.gmtkgamejam.routing;

import com.gmtkgamejam.models.BanUnbanUserDto
import com.gmtkgamejam.models.BannedUser
import com.gmtkgamejam.models.PostItem
import com.gmtkgamejam.models.admin.DeletePostDto
import com.gmtkgamejam.models.admin.ReportedUsersClearDto
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AdminService
import com.gmtkgamejam.services.PostService
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.litote.kmongo.and
import org.litote.kmongo.descending
import org.litote.kmongo.eq
import org.litote.kmongo.gt
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun Application.configureAdminRouting() {

    val service = PostService()
    val adminService = AdminService()

    routing {
        authenticate("auth-jwt-admin") {
            route("/admin") {
                route("/reports") {
                    get {
                        val filters = mutableListOf(PostItem::deletedAt eq null, PostItem::reportCount gt 0)
                        call.respond(service.getPosts(and(filters), descending(PostItem::reportCount)))
                    }
                    post("/clear") {
                        val data = call.receive<ReportedUsersClearDto>()
                        service.getPost(data.teamId)?.let {
                            it.reportCount = 0
                            service.updatePost(it)
                            return@post call.respond(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
                route("/post") {
                    delete {
                        val data = call.receive<DeletePostDto>()
                        service.getPost(data.postId)?.let {
                            service.deletePost(it)
                            return@delete call.respond(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
                route("/user") {
                    post("/ban") {
                        val data = call.receive<BanUnbanUserDto>()
                        val userToBan = BannedUser(data)
                        adminService.banUser(userToBan).let {
                            return@post call.respond("User banned")
                        }
                    }
                    post("/unban") {
                        val data = call.receive<BanUnbanUserDto>()
                        val userToBan = BannedUser(data)
                        adminService.unbanUser(userToBan).let {
                            return@post call.respond("User unbanned")
                        }
                    }
                }
            }
        }
    }
}
