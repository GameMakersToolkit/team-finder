package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for reporting a PostItem
 */
@Serializable
data class PostItemReportDto (
    var id: Long,
)
