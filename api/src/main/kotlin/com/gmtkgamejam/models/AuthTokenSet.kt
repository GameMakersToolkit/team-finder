package com.gmtkgamejam.models

import java.util.*

data class AuthTokenSet(
    val id: String,
    val discordId: String,
    var accessToken: String,
    val tokenType: String,
    var expiry: Date,
    var refreshToken: String?,
) {
    fun refresh(refreshedTokenSet: DiscordRefreshTokenResponse) {
        this.accessToken = refreshedTokenSet.access_token
        this.expiry = Date(System.currentTimeMillis() + refreshedTokenSet.expires_in)
        this.refreshToken = refreshedTokenSet.refresh_token
    }
}
