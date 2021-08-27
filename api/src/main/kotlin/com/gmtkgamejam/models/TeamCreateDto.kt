package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new Team being created on POST /teams
 */
@Serializable
data class TeamCreateDto (
    var author: String,
    var authorId: String,
    var description: String,
    var skillsetMask: Int,
    var languages: String,
)