package com.gmtkgamejam.validation

import com.gmtkgamejam.models.posts.dtos.PostItemCreateDto
import com.gmtkgamejam.models.posts.dtos.PostItemUpdateDto
import com.gmtkgamejam.routing.isSafePortfolioUrl

private val JAM_ID_REGEX = Regex("^[a-zA-Z0-9-]{1,64}$")
private const val MAX_DESCRIPTION_LENGTH = 2000
private const val MAX_AUTHOR_LENGTH = 64
private const val MAX_LANGUAGE_LENGTH = 32
private const val MIN_TEAM_SIZE = 1
private const val MAX_TEAM_SIZE = 100

object PostDtoValidator {
    fun validateCreate(dto: PostItemCreateDto): Map<String, String> {
        val errors = mutableMapOf<String, String>()

        if (!JAM_ID_REGEX.matches(dto.jamId)) {
            errors["jamId"] = "jamId must be 1-64 chars and only contain letters, numbers, and hyphens"
        }

        if (dto.author.isBlank() || dto.author.length > MAX_AUTHOR_LENGTH) {
            errors["author"] = "author must be between 1 and $MAX_AUTHOR_LENGTH characters"
        }

        if (dto.description.isBlank() || dto.description.length > MAX_DESCRIPTION_LENGTH) {
            errors["description"] = "description must be between 1 and $MAX_DESCRIPTION_LENGTH characters"
        }

        if (dto.size !in MIN_TEAM_SIZE..MAX_TEAM_SIZE) {
            errors["size"] = "size must be between $MIN_TEAM_SIZE and $MAX_TEAM_SIZE"
        }

        if (dto.timezoneOffsets.any { it < -12 || it > 12 }) {
            errors["timezoneOffsets"] = "timezone offsets must be between -12 and 12"
        }

        if (dto.languages.isEmpty() || dto.languages.any { it.isBlank() || it.length > MAX_LANGUAGE_LENGTH }) {
            errors["languages"] = "languages must be non-empty and each language must be <= $MAX_LANGUAGE_LENGTH chars"
        }

        if (dto.portfolioLinks.any { !isSafePortfolioUrl(it) }) {
            errors["portfolioLinks"] = "portfolio links must be valid http/https URLs without query or fragment"
        }

        return errors
    }

    fun validateUpdate(dto: PostItemUpdateDto): Map<String, String> {
        val errors = mutableMapOf<String, String>()

        dto.author?.also {
            if (it.isBlank() || it.length > MAX_AUTHOR_LENGTH) {
                errors["author"] = "author must be between 1 and $MAX_AUTHOR_LENGTH characters"
            }
        }

        dto.description?.also {
            if (it.isBlank() || it.length > MAX_DESCRIPTION_LENGTH) {
                errors["description"] = "description must be between 1 and $MAX_DESCRIPTION_LENGTH characters"
            }
        }

        dto.size?.also {
            if (it !in MIN_TEAM_SIZE..MAX_TEAM_SIZE) {
                errors["size"] = "size must be between $MIN_TEAM_SIZE and $MAX_TEAM_SIZE"
            }
        }

        dto.timezoneOffsets?.also {
            if (it.any { tz -> tz < -12 || tz > 12 }) {
                errors["timezoneOffsets"] = "timezone offsets must be between -12 and 12"
            }
        }

        dto.languages?.also {
            if (it.isEmpty() || it.any { lang -> lang.isBlank() || lang.length > MAX_LANGUAGE_LENGTH }) {
                errors["languages"] = "languages must be non-empty and each language must be <= $MAX_LANGUAGE_LENGTH chars"
            }
        }

        dto.portfolioLinks?.also {
            if (it.any { link -> !isSafePortfolioUrl(link) }) {
                errors["portfolioLinks"] = "portfolio links must be valid http/https URLs without query or fragment"
            }
        }

        return errors
    }
}
