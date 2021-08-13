package com.gmtkgamejam

import com.gmtkgamejam.plugins.configureAuthRouting
import com.gmtkgamejam.plugins.configureRouting
import com.gmtkgamejam.plugins.configureTeamRouting
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.serialization.*
import kotlinx.serialization.json.Json

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }

    configureRouting()
    configureAuthRouting()
    configureTeamRouting()
}
