package com.gmtkgamejam.models.auth

import java.util.*

data class StoredAuthTokenSet(
    val idHash: String,
    val discordIdHash: String,
    val createdAt: Date,
    val payload: String,
    val iv: String,
)
