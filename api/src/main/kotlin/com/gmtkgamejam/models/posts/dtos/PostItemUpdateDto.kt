package com.gmtkgamejam.models.posts.dtos

import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import kotlinx.serialization.Serializable

/**
 * This model is the payload for an existing PostItem being updated on PUT /posts/mine
 */
@Serializable
data class PostItemUpdateDto (
    var author: String?,
    var description: String?,
    var size: Int?,
    var skillsPossessed: Set<Skills>?,
    var skillsSought: Set<Skills>?,
    var preferredTools: Set<Tools>?,
    var availability: Availability?,
    var timezoneOffsets: Set<Int>?,
    var languages: Set<String>?,
)
