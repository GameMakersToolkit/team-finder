package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
data class AdminInfo(
    val discordId: String,
    val username: String,
)
