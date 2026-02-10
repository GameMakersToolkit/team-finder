package com.gmtkgamejam.models.jams

import kotlinx.serialization.Serializable

@Serializable
// Allows partial updates; all fields nullable
// Only fields present in the request will be updated
// styles is a map, so it can be replaced entirely
// jamId is required for identifying the jam, but not updatable
//
data class JamUpdateDto(
    val status: JamStatus? = null,
    val start: String? = null,
    val end: String? = null,
    val bgImageUrl: String? = null,
    val logoLargeUrl: String? = null,
    val logoStackedUrl: String? = null,
    val faviconUrl: String? = null,
    val styles: Map<String, String>? = null,
    val adminIds: List<String>? = null,
    // val guildId: String? = null, // Updates to this require an admin
)
