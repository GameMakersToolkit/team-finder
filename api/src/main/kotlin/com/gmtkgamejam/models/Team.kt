package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class Team (
    val id: Long,

    var author: String,
    var authorId: String,
    var description: String,
    var skillsetMask: Int,

    var languages: String,

    // Managed by DB
    val createdAt: String,
    var updatedAt: String,
    var deletedAt: String?,

    var reportCount: Int
) {
    companion object {
        fun fromCreateDto(dto: TeamCreateDto): Team {
            return Team(
                99999,
                dto.author,
                dto.authorId,
                dto.description,
                dto.skillsetMask,
                dto.languages,
                "CREATED",
                "UPDATED",
                "DELETED",
                0
            )
        }
    }
}