package com.gmtkgamejam.routing

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.respondJSON
import com.gmtkgamejam.search.OpensearchClusterConfigurer
import com.gmtkgamejam.services.PostService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.litote.kmongo.eq

// TODO: Auth control
fun Application.configureInfraRouting() {

    val postService = PostService()

    routing {
        route("/infra") {
            route("/se") {
                get("/reset") {
                    val posts = postService.getPosts(PostItem::deletedAt eq null)
                    OpensearchClusterConfigurer().initCluster(posts)
                    call.respondJSON("Search engine reset complete", HttpStatusCode.OK)
                }
            }
        }
    }
}