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
    var skillsPossessed: List<Skills>,
    var skillsSought: List<Skills>,
    var preferredTools: List<Tools>?,
    var availability: Availability,
    var timezoneStr: String,
    var languages: List<String>, // TODO: Sanitise/validate?
)