package com.gmtkvotingsystem.routing

import com.gmtkvotingsystem.getAuthFromCall
import com.gmtkvotingsystem.models.ThemeDTO
import com.gmtkvotingsystem.services.AuthService
import com.gmtkvotingsystem.services.ThemeService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.math.min

fun Application.configureThemeRouting() {
    val authService = AuthService()
    val themeService = ThemeService()

    routing {
        authenticate("auth-jwt") {
            get("/themes") {
                val auth = getAuthFromCall(authService, call) ?: return@get call.respond(HttpStatusCode.BadRequest)

                call.respond(themeService.getForUser(auth.discordId))
            }

            post("/themes") {
                val auth = getAuthFromCall(authService, call) ?: return@post call.respond(HttpStatusCode.BadRequest)
                val data = call.receive<ThemeDTO>()
                val themes = data.themes.subList(0, min(data.themes.count(), 3)) // Ensure people can only submit a max of three

                themeService.setForUser(auth.discordId, themes)

                call.respond(themeService.getForUser(auth.discordId))
            }
        }
    }
}
