package com.gmtkvotingsystem.koin

import com.gmtkvotingsystem.bot.DiscordBot
import org.koin.dsl.module

val DiscordBotModule =
    module(createdAtStart = true) {
        single {
            DiscordBot()
        }
    }
