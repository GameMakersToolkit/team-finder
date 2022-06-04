package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class FavouritesList(
    val discordId: String,
    val postIds: MutableList<String> = mutableListOf(),
)
