package com.gmtkgamejam.plugins

import io.ktor.routing.*
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.response.*

fun Application.configureRouting() {
    // Starting point for a Ktor app:
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        authenticate("auth-jwt") {
            get("/hello") {
                val principal = call.principal<JWTPrincipal>()
                val id = principal?.payload?.getClaim("id")?.asString()
                val expiresAt = principal?.expiresAt?.time?.minus(System.currentTimeMillis())

                call.respondText("Hello, id: $id and expires at: $expiresAt")
            }
        }
    }
}
