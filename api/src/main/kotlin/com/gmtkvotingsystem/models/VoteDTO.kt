package com.gmtkvotingsystem.models

import kotlinx.serialization.Serializable

@Serializable
data class VoteDTO(
    val id: String,
    val score: Int,
)
