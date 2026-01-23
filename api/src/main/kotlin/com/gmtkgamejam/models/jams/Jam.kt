package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
data class Jam(
    val jamId: String,
    val name: String,
    val start: String,
    val end: String,
    val logoLargeUrl: String?,
    val logoStackedUrl: String?,

    /**
     * '--theme-primary': '',
     * '--theme-accent': '',
     * '--theme-background': '',
     * '--gradient-start': '',
     * '--gradient-end': '',
     * '--theme-tile-bg': '',
     */
    var styles: Map<String, String>,
)
