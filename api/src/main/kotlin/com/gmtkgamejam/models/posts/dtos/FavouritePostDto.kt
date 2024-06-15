package com.gmtkgamejam.models.posts.dtos

import kotlinx.serialization.Serializable

/**
 * This model is the payload for adding/removing a new Favourite item
 *
 * This is only triggered for one post at a time
 */
@Serializable
data class FavouritePostDto(
    var postId: String,
)
