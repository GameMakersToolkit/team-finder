package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a new Team being created on POST /teams
 */
@Serializable
data class PostItemCreateDto (
    var author: String,
    var authorId: String,
    var description: String,
    var skillsPossessedMask: Int,
    var skillsSoughtMask: Int,
    var timezoneStr: String,
    var languages: List<String>, // TODO: Sanitise/validate?
)