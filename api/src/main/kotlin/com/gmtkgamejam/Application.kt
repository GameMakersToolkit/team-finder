package com.gmtkgamejam

import com.gmtkgamejam.koin.DatabaseModule
import com.gmtkgamejam.plugins.configureAuthRouting
import com.gmtkgamejam.plugins.configureRouting
import com.gmtkgamejam.plugins.configureTeamRouting
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.serialization.*
import kotlinx.serialization.json.Json
import org.koin.core.context.startKoin

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
        // FIXME: Only suppress CORS until we can easily sort it
        install(CORS)
        {
            method(HttpMethod.Options)
            header(HttpHeaders.XForwardedProto)
            anyHost()
        }
    }

    startKoin {
        modules(DatabaseModule)
    }

    configureRouting()
    configureAuthRouting()
    configureTeamRouting()
}
