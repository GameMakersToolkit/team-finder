package com.gmtkgamejam.discord

import com.gmtkgamejam.models.DiscordRefreshTokenResponse
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.http.*

const val refreshTokenEndpoint = "https://discord.com/api/oauth2/token"

suspend fun refreshTokenAsync(
    clientId: String,
    clientSecret: String,
    refreshToken: String
): DiscordRefreshTokenResponse {
    return discordHttpClient().use { client ->
        client
            .post(refreshTokenEndpoint) {
                setBody(FormDataContent(Parameters.build {
                    append("client_id", clientId)
                    append("client_secret", clientSecret)
                    append("grant_type", "refresh_token")
                    append("refresh_token", refreshToken)
                }))
            }
            .body()
    }
}
