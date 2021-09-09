package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class DiscordGuildInfo(
    val id: String,
    val name: String,
    val icon: String?,
    val owner: Boolean,
    val permissions: Long,
    val features: Array<String>,
    val permissions_new: String
)
