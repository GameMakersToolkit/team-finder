package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class JamGuildUserInfo(
   val avatar: String?,
   val communication_disabled_until: String?,
   val flags: Int,
   val is_pending: Boolean,
   val joined_at: String,
   val nick: String?,
   val pending: Boolean?,
   val premium_since: String?,
   val roles: List<String>,
   val user: DiscordUserInfo?,
   val mute: Boolean,
   val deaf: Boolean,
)