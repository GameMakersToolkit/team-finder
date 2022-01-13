package com.gmtkgamejam.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class DeleteTeamDto(
    var teamId: String,
)
