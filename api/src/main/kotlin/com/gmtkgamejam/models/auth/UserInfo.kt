package com.gmtkgamejam.models.auth

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val id: String,
    val username: String,
    val avatar: String,
    val isInDiscordServer: Boolean,
    val hasContactPermsSet: Boolean,
    val isAdmin: Boolean
) {
    constructor(
        discordUserInfo: DiscordUserInfo,
        displayName: String,
        isInDiscordServer: Boolean,
        hasContactPermsSet: Boolean,
        isAdmin: Boolean
    ) : this(
        discordUserInfo.id,
        displayName,
        discordUserInfo.avatar ?: "no-avatar",
        isInDiscordServer,
        hasContactPermsSet,
        isAdmin
    )
}
