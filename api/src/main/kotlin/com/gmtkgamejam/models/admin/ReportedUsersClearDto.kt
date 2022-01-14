package com.gmtkgamejam.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class ReportedUsersClearDto(
    var teamId: String,
)
