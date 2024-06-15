package com.gmtkgamejam

import com.gmtkgamejam.koin.DatabaseModule
import com.gmtkgamejam.koin.DiscordBotModule
import com.gmtkgamejam.routing.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.serialization.json.Json
import org.koin.core.context.startKoin
import org.koin.environmentProperties

fun main(args: Array<String>): Unit =
    io.ktor.server.netty.EngineMain
        .main(args)

@Suppress("unused")
fun Application.module() {
    startKoin {
        environmentProperties()
        modules(DatabaseModule, DiscordBotModule)
    }

    configureRequestHandling()
    configureUserInfoRouting()
    configureAuthRouting()
    configureAdminRouting()
    configurePostRouting()
    configureFavouritesRouting()
    configureDiscordBotRouting()
}

fun Application.configureRequestHandling() {
    install(ContentNegotiation) {
        json(
            Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            },
        )
    }

    install(CORS) {
        anyHost()

        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Head)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Delete)

        allowHeader(HttpHeaders.XForwardedProto)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowCredentials = true
    }
}
