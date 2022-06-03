package com.gmtkgamejam.models

import com.gmtkgamejam.Config
import kotlinx.serialization.Serializable

private val guildId: String = Config.getString("jam.guildId")

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

    constructor(discordUserInfo: DiscordUserInfo, guildInfo: JamGuildUserInfo?, isInDiscordServer: Boolean, hasContactPermsSet: Boolean) : this(
        discordUserInfo.id,
        guildInfo?.nick ?: discordUserInfo.username,
        discordUserInfo.avatar,
        isInDiscordServer,
        hasContactPermsSet,
        adminIds.contains(discordUserInfo.id)
    )
}
