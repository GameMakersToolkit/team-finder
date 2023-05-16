package com.gmtkgamejam.models.admin.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ReportedUsersClearDto(
    var teamId: String,
)
