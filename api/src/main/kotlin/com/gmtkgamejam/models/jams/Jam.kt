package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
data class Jam(
    val jamId: String,
    val name: String,
    val participants: Int,
    val start: String,
    val duration: String,
    val logoLargeUrl: String,
    val logoStackedUrl: String,
    val styles: Map<String, String>,
)