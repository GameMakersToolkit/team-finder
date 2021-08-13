package com.gmtkgamejam

import com.gmtkgamejam.plugins.*
import io.ktor.application.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    configureRouting()
    configureAuthRouting()
}
