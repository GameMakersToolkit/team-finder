package com.gmtkvotingsystem.models

import kotlinx.serialization.Serializable

@Serializable
data class VotesDTO(
    val votes: List<VoteDTO>,
)
