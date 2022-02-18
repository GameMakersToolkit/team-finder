package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class DiscordRefreshTokenResponse(
    val access_token: String,
    val token_type: String,
    val expires_in: Long,
    val refresh_token: String,
    val scope: String,
)