package com.gmtkgamejam.discord

import com.gmtkgamejam.models.DiscordGuildInfo
import io.ktor.client.request.*
import io.ktor.http.*

const val guildInfo = "https://discordapp.com/api/users/@me/guilds"

suspend fun getGuildInfoAsync(accessToken: String): Array<DiscordGuildInfo> {
    return discordHttpClient().use { client ->
        client.get(guildInfo) {
            headers {
                append(HttpHeaders.Accept, "application/json")
                append(HttpHeaders.Authorization, "Bearer $accessToken")
            }
        }
    }
}