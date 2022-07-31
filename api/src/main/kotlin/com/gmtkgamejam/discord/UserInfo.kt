package com.gmtkgamejam.discord

import com.gmtkgamejam.models.DiscordUserInfo
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.*

const val userInfo = "https://discordapp.com/api/users/@me"

suspend fun getUserInfoAsync(accessToken: String): DiscordUserInfo {
    return discordHttpClient().use { client ->
        client
            .get(userInfo) {
                headers {
                    append(HttpHeaders.Accept, "application/json")
                    append(HttpHeaders.Authorization, "Bearer $accessToken")
                }
            }
            .body()
    }
}
