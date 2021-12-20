package com.gmtkgamejam.models

import kotlinx.serialization.Serializable

@Serializable
data class PostItem (
    val id: Long,

    var author: String,
    var authorId: String,
    var description: String,

    var skillsPossessed: List<Skills>?,
    var skillsSought: List<Skills>?,

    // var preferredTools: List<Tools>?,
    var timezoneStr: String,
    var languages: List<String>,

    var reportCount: Int,

    // Managed by DB
    val createdAt: String,
    var updatedAt: String,
    var deletedAt: String?,
) {

    companion object {
        fun fromCreateDto(dto: PostItemCreateDto): PostItem {
            return PostItem(
                99999,
                dto.author,
                dto.authorId,
                dto.description,
                Skills.fromBitwiseId(dto.skillsPossessedMask),
                Skills.fromBitwiseId(dto.skillsSoughtMask),
                dto.timezoneStr,
                dto.languages,
                0,
                "CREATED",
                "UPDATED",
                "DELETED",
            )
        }
    }
}
