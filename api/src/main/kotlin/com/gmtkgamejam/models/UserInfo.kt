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
    val isAdmin: Boolean
) {

    constructor(discordUserInfo: DiscordUserInfo, guilds: Array<DiscordGuildInfo>) : this(
        discordUserInfo.id,
        "${discordUserInfo.username}#${discordUserInfo.discriminator}",
        discordUserInfo.avatar,
        guilds.any { guild -> guild.id == guildId },
        adminIds.contains(discordUserInfo.id)
    )
}
