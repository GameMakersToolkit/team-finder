package com.gmtkgamejam.koin

import com.gmtkgamejam.bot.DiscordBot
import org.koin.dsl.module

val DiscordBotModule = module(createdAtStart = true) {
    single {
        DiscordBot(get())
    }
}