package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new Post being created on POST /posts
 */
@Serializable
data class PostItemUpdateDto (
    var description: String?,
    var skillsPossessed: List<Skills>?,
    var skillsSought: List<Skills>?,
    var preferredTools: List<Tools>?,
    var availability: Availability?,
    var timezoneStr: String?,
    var languages: String?,
)