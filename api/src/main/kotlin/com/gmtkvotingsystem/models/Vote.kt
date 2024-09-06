package com.gmtkvotingsystem.models

import java.util.*

data class Vote(
    val _id: String,
    val themeId: String,
    val discordId: String,
    val score: Int,
) {
    constructor(themeId: String, discordId: String, score: Int) : this(UUID.randomUUID().toString(), themeId, discordId, score)
}
