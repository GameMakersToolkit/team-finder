package com.gmtkgamejam.models.posts.dtos

import kotlinx.serialization.Serializable

/**
 * This model is the payload for deleting a PostItem
 */
@Serializable
data class PostItemDeleteDto (
    var id: Long,
)
