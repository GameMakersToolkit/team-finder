package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new PostItem being created on POST /posts
 */
@Serializable
data class PostItemCreateDto(
    var author: String,
    var authorId: String,
    var title: String,
    var description: String,
    var skillsPossessed: List<Skills>,
    var skillsSought: List<Skills>,
    var preferredTools: List<Tools>?,
    var availability: Availability,
    var timezoneOffset: Int,
    var languages: List<String>,
)