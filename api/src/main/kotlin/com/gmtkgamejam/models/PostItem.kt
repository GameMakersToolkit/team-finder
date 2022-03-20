package com.gmtkgamejam.models

import kotlinx.serialization.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Serializable
data class PostItem (
    val id: Long,

    var author: String,
    var authorId: String,

    var title: String,
    var description: String,

    var skillsPossessed: List<Skills>?,
    var skillsSought: List<Skills>?,

    var preferredTools: List<Tools>?,
    var availability: Availability,
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
            // TODO: Standardise datetime format
            val currentDatetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            return PostItem(
                99999,
                dto.author,
                dto.authorId,
                dto.title,
                dto.description,
                dto.skillsPossessed,
                dto.skillsSought,
                dto.preferredTools,
                dto.availability,
                dto.timezoneStr,
                dto.languages,
                0,
                currentDatetime,
                currentDatetime,
                null,
            )
        }
    }
}
