package com.gmtkgamejam

import com.gmtkgamejam.routing.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import org.koin.ktor.ext.inject
import kotlinx.serialization.json.Json
import java.net.URI

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused")
fun Application.appModule() {
    configureHealthcheckRouting()
    configureRequestHandling()
    configureErrorHandling()
    configureUserInfoRouting()
    configureAuthRouting()
    configureAdminRouting()
    configureJamRouting()
    configurePostRouting()
    configureFavouritesRouting()
    configureDiscordBotRouting()
}

fun Application.configureRequestHandling() {
    val config: Config by inject()

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }

    install(CORS) {
        val configuredOrigins = config.getList("cors.allowedOrigins")
            .map(String::trim)
            .filter(String::isNotBlank)

        configuredOrigins.forEach { origin ->
            val uri = URI(origin)
            val scheme = uri.scheme?.lowercase() ?: return@forEach
            val host = uri.authority ?: return@forEach

            allowHost(host, schemes = listOf(scheme))
        }

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
