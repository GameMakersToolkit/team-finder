package com.gmtkgamejam.models.admin.dtos

import kotlinx.serialization.Serializable

@Serializable
data class BanUnbanUserDto(
    val discordId: String,
    val adminId: String,
)