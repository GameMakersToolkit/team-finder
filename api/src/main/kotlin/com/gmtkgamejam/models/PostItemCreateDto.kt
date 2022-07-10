package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new PostItem being created on POST /posts
 */
@Serializable
data class PostItemCreateDto(
    var author: String,
    var authorId: String,
    var description: String,
    var size: Int,
    var skillsPossessed: Set<Skills>,
    var skillsSought: Set<Skills>,
    var preferredTools: Set<Tools>?,
    var availability: Availability,
    var timezoneOffsets: Set<Int>,
    var languages: Set<String>,
)