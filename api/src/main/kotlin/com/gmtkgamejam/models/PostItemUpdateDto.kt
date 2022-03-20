package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for an existing PostItem being updated on PUT /posts/mine
 */
@Serializable
data class PostItemUpdateDto (
    var title: String?,
    var description: String?,
    var skillsPossessed: List<Skills>?,
    var skillsSought: List<Skills>?,
    var preferredTools: List<Tools>?,
    var availability: Availability?,
    var timezoneStr: String?,
    var languages: String?,
)