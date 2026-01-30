package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
data class Jam(
    val jamId: String,
    val name: String,
    var start: String,
    var end: String,
    var styles: Map<String, String>,
) {
    lateinit var bgImageUrl: String
    lateinit var logoLargeUrl: String
    lateinit var logoStackedUrl: String
}
