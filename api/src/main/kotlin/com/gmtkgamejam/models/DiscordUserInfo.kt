package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class DiscordUserInfo(
    val id: String,
    val username: String,
    val avatar: String,
    val discriminator: String,
    val public_flags: Long,
)
