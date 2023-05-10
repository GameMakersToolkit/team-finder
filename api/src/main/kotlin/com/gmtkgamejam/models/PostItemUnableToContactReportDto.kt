package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

/**
 * This model is the payload for reporting a PostItem
 * as unabled to be contacted by discord CTA
 */
@Serializable
data class PostItemUnableToContactReportDto (
    var id: String,
)
