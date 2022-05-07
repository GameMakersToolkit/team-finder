package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class BanUnbanUserDto(
    val discordId: String,
    val adminId: String,
)