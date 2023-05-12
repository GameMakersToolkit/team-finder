package com.gmtkgamejam.models.admin.dtos

import kotlinx.serialization.Serializable

@Serializable
data class DeletePostDto(
    var postId: String,
)
