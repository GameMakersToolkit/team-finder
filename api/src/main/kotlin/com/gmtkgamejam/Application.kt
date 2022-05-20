package com.gmtkgamejam

import com.gmtkgamejam.koin.DatabaseModule
import com.gmtkgamejam.koin.DiscordBotModule
import com.gmtkgamejam.routing.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.serialization.*
import kotlinx.serialization.json.Json
import org.koin.core.context.startKoin
import org.koin.environmentProperties

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused")
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
        install(CORS)
        {
            anyHost()

            method(HttpMethod.Options)
            method(HttpMethod.Head)
            method(HttpMethod.Get)
            method(HttpMethod.Post)
            method(HttpMethod.Put)
            method(HttpMethod.Patch)
            method(HttpMethod.Delete)

            header(HttpHeaders.XForwardedProto)
            header(HttpHeaders.ContentType)
            header(HttpHeaders.Authorization)
            allowCredentials = true
        }
    }

    startKoin {
        environmentProperties()
        modules(DatabaseModule, DiscordBotModule)
    }

    configureUserInfoRouting()
    configureAuthRouting()
    configureAdminRouting()
    configurePostRouting()
    configureFavouritesRouting()
}
