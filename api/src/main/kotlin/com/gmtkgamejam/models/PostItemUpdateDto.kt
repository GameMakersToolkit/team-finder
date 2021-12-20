package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new Post being created on POST /posts
 */
@Serializable
data class PostItemUpdateDto (
    var id: Long,
    var author: String,
    var authorId: String,
    var description: String?,
    var skillsPossessedMask: Int?,
    var skillsSoughtMask: Int?,
    var timezoneStr: String?,
    var languages: String?,
)