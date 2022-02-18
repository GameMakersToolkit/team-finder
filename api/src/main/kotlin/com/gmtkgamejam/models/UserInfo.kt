package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo(
    val id: String,
    val username: String,
    val avatar: String,
    val isInDiscordServer: Boolean
) {

    constructor(discordUserInfo: DiscordUserInfo, guilds: Array<DiscordGuildInfo>) : this(
        discordUserInfo.id,
        "${discordUserInfo.username}#${discordUserInfo.discriminator}",
        discordUserInfo.avatar,
        guilds.any { guild -> guild.id == "248204508960653312" } // TODO: Move guild id into config
    )
}
