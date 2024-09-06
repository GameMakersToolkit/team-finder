package com.gmtkvotingsystem.models

import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class Theme(
    val _id: String,
    val discordId: String,
    val text: String,
) {
    constructor(discordId: String, text: String) : this(UUID.randomUUID().toString(), discordId, text)
}
