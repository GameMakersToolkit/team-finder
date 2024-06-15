package com.gmtkgamejam.discord

import com.gmtkgamejam.models.auth.DiscordUserInfo
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

const val userInfo = "https://discordapp.com/api/users/@me"

suspend fun getUserInfoAsync(accessToken: String): DiscordUserInfo =
    discordHttpClient().use { client ->
        client
            .get(userInfo) {
                headers {
                    append(HttpHeaders.Accept, "application/json")
                    append(HttpHeaders.Authorization, "Bearer $accessToken")
                }
            }.body()
    }
