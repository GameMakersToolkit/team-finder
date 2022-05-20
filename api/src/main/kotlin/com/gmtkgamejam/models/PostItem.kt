package com.gmtkgamejam.models

import kotlinx.serialization.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.ThreadLocalRandom

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
    var timezoneOffset: Int,
    var languages: List<String>,

    var reportCount: Int,

    // Managed by DB
    val createdAt: String,
    var updatedAt: String,
    var deletedAt: String?,
) {
    var isFavourite: Boolean = false
    companion object {
        fun fromCreateDto(dto: PostItemCreateDto): PostItem {
            // TODO: Standardise datetime format
            val currentDatetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            return PostItem(
                ThreadLocalRandom.current().nextLong(),
                dto.author,
                dto.authorId,
                dto.title,
                dto.description.take(2000),
                dto.skillsPossessed,
                dto.skillsSought,
                dto.preferredTools,
                dto.availability,
                dto.timezoneOffset,
                dto.languages,
                0,
                currentDatetime,
                currentDatetime,
                null,
            )
        }
    }
}
