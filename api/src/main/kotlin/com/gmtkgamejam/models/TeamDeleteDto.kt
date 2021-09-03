package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for a Team Delete action
 */
@Serializable
data class TeamDeleteDto (
    var teamId: Long,
)
