package com.gmtkgamejam.models

data class AuthTokenSet(
    val id: String,
    var accessToken: String,
    val tokenType: String,
    var expiry: Long,
    var refreshToken: String?,
) {
    fun refresh(refreshedTokenSet: DiscordRefreshTokenResponse) {
        this.accessToken = refreshedTokenSet.access_token
        this.expiry = System.currentTimeMillis() + refreshedTokenSet.expires_in
        this.refreshToken = refreshedTokenSet.refresh_token
    }
}
