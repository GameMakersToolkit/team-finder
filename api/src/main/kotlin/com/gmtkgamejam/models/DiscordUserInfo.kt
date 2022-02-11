package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class DiscordUserInfo(
    val id: String,
    val username: String,
    val avatar: String,
    val discriminator: String,
    val public_flags: Long,
    val flags: Long,
    val banner: String?,
    val banner_color: String?,
    val accent_color: String?,
    val locale: String,
    val mfa_enabled: Boolean,
)
