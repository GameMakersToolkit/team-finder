package com.gmtkvotingsystem.models

import kotlinx.serialization.Serializable

@Serializable
data class ThemeVotedOnDTO(
    val _id: String,
    val discordId: String,
    val text: String,
    var score: Int,
)
