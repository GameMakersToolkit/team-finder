package com.gmtkgamejam.models

import kotlinx.serialization.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.ThreadLocalRandom
import kotlin.math.abs

@Serializable
data class PostItem (
    val id: String,

    var author: String,
    var authorId: String,

    var description: String,
    var size: Int,

    var skillsPossessed: Set<Skills>?,
    var skillsSought: Set<Skills>?,

    var preferredTools: Set<Tools>?,
    var availability: Availability,
    var timezoneOffsets: Set<Int>,
    var languages: Set<String>,

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
                abs(ThreadLocalRandom.current().nextLong()).toString(), // We need to handle as string, otherwise we lose precision in JS
                dto.author,
                dto.authorId,
                dto.description.take(2000),
                dto.size,
                dto.skillsPossessed,
                dto.skillsSought,
                dto.preferredTools,
                dto.availability,
                dto.timezoneOffsets,
                dto.languages,
                0,
                currentDatetime,
                currentDatetime,
                null,
            )
        }
    }
}
