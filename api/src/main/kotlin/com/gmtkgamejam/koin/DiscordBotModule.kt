package com.gmtkgamejam.koin

import com.gmtkgamejam.bot.ContactPermissionsCheckerBot
import org.koin.dsl.module

val DiscordBotModule = module(createdAtStart = true) {
    single {
        ContactPermissionsCheckerBot()
    }
}