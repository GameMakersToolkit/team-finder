package com.gmtkgamejam.models

import com.gmtkgamejam.Config
import kotlinx.serialization.Serializable

private val adminIds: List<String> = Config.getList("jam.adminIds")

@Serializable
data class UserInfo(
    val id: String,
    val username: String,
    val avatar: String,
    val isInDiscordServer: Boolean,
    val hasContactPermsSet: Boolean,
    val isAdmin: Boolean
) {

    constructor(discordUserInfo: DiscordUserInfo, displayName: String, isInDiscordServer: Boolean, hasContactPermsSet: Boolean) : this(
        discordUserInfo.id,
        displayName,
        discordUserInfo.avatar,
        isInDiscordServer,
        hasContactPermsSet,
        adminIds.contains(discordUserInfo.id)
    )
}
