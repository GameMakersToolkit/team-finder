package com.gmtkgamejam.models

data class AuthTokenSet(
    val jwt: String,
    val accessToken: String,
    val tokenType: String,
    val expiry: Long,
    val refreshToken: String?,
)
