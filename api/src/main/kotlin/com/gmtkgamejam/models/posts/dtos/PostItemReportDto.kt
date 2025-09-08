package com.gmtkgamejam.models.posts.dtos

import kotlinx.serialization.Serializable

/**
 * This model is the payload for reporting a PostItem
 */
@Serializable
data class PostItemReportDto(
    var id: String,
)
