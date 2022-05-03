package com.gmtkgamejam.models.admin

import kotlinx.serialization.Serializable

@Serializable
data class DeletePostDto(
    var postId: String,
)
