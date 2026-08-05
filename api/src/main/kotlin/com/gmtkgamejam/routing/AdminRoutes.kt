package com.gmtkgamejam.routing

import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.models.admin.dtos.BanUnbanUserDto
import com.gmtkgamejam.models.admin.dtos.DeletePostDto
import com.gmtkgamejam.models.admin.dtos.ReportedUsersClearDto
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.respondData
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.services.AdminService
import com.gmtkgamejam.services.PostService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import org.litote.kmongo.and
import org.litote.kmongo.descending
import org.litote.kmongo.eq
import org.litote.kmongo.gt

fun Application.configureAdminRouting() {

    val bot: DiscordBot by inject()
    val service: PostService by inject()
    val adminService: AdminService by inject()

    routing {
        authenticate("auth-jwt-admin") {
            route("/{jamId}/admin") {
                route("/bot") {
                    get {
                        call.respondData(mapOf("message" to "build.general"), status = HttpStatusCode.OK)
                    }
                    post {
                        val jamId = call.parameters["jamId"]
                            ?: return@post call.respondJSON("Missing jamId", HttpStatusCode.BadRequest, "missing_jam_id")
                        bot.sendStatusMessageToPingChannel(jamId)
                        return@post call.respondData(mapOf("message" to "Status message sent"))
                    }
                }

                route("/reports") {
                    get {
                        val jamId = call.parameters["jamId"]
                            ?: return@get call.respondJSON("Missing jamId", HttpStatusCode.BadRequest, "missing_jam_id")
                        val filters = mutableListOf(PostItem::jamId eq jamId, PostItem::deletedAt eq null, PostItem::reportCount gt 0)
                        call.respondData(service.getPosts(and(filters), descending(PostItem::reportCount), 1))
                    }
                    post("/clear") {
                        val data = call.receive<ReportedUsersClearDto>()
                        service.getPost(data.teamId)?.let {
                            it.reportCount = 0
                            service.updatePost(it)
                            return@post call.respondData(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
                route("/post") {
                    delete {
                        val data = call.receive<DeletePostDto>()
                        service.getPost(data.postId)?.let {
                            service.deletePost(it)
                            return@delete call.respondData(it)
                        }

                        call.respondJSON("Post not found", status = HttpStatusCode.NotFound)
                    }
                }
                route("/user") {
                    post("/ban") {
                        val data = call.receive<BanUnbanUserDto>()
                        val userToBan = BannedUser(data)
                        adminService.banUser(userToBan).let {
                            return@post call.respondData(mapOf("message" to "User banned"))
                        }
                    }
                    post("/unban") {
                        val data = call.receive<BanUnbanUserDto>()
                        val userToBan = BannedUser(data)
                        adminService.unbanUser(userToBan).let {
                            return@post call.respondData(mapOf("message" to "User unbanned"))
                        }
                    }
                }
            }
        }
    }
}
