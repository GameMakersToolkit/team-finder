package com.gmtkgamejam.discord

import com.gmtkgamejam.Config
import com.gmtkgamejam.models.JamGuildUserInfo
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.*

private val guildId: String = Config.getString("jam.guildId")

var guildInfo = "https://discordapp.com/api/users/@me/guilds/$guildId/member"

suspend fun getGuildInfoAsync(accessToken: String): JamGuildUserInfo {
    return discordHttpClient().use { client ->
        client
            .get(guildInfo) {
                headers {
                    append(HttpHeaders.Accept, "application/json")
                    append(HttpHeaders.Authorization, "Bearer $accessToken")
                }
            }
            .body()
    }
}
