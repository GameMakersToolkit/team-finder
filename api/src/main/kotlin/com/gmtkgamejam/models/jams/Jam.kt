package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
data class Jam(
    val jamId: String,
    val name: String,
    var status: JamStatus,
    var start: String,
    var end: String,
    var styles: Map<String, String>,
    val adminIds: List<String>,
    val guildId: String,
    val channelId: String,
) {
    lateinit var adminInfo: Map<String, AdminInfo>
    lateinit var bgImageUrl: String
    lateinit var logoLargeUrl: String
    lateinit var logoStackedUrl: String
    lateinit var faviconUrl: String
}
