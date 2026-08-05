package com.gmtkgamejam.validation

import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import com.gmtkgamejam.models.posts.dtos.PostItemCreateDto
import com.gmtkgamejam.models.posts.dtos.PostItemUpdateDto
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class PostDtoValidatorTest {
    private fun validCreateDto() = PostItemCreateDto(
        jamId = "example-jam",
        author = "Alice",
        authorId = "ignored",
        portfolioLinks = setOf("https://example.com/portfolio"),
        description = "Looking for teammates",
        size = 4,
        skillsPossessed = setOf(Skills.CODE),
        skillsSought = setOf(Skills.MUSIC),
        preferredTools = setOf(Tools.UNITY),
        availability = Availability.FULL_TIME,
        timezoneOffsets = setOf(0, 1),
        languages = setOf("English"),
    )

    @Test
    fun `accept valid create payload`() {
        assertTrue(PostDtoValidator.validateCreate(validCreateDto()).isEmpty())
    }

    @Test
    fun `reject invalid create payload fields`() {
        val dto = validCreateDto().copy(
            jamId = "bad/jam",
            author = "",
            portfolioLinks = setOf("javascript:alert(1)"),
            description = "",
            size = 101,
            timezoneOffsets = setOf(15),
            languages = emptySet(),
        )

        val errors = PostDtoValidator.validateCreate(dto)
        assertEquals(setOf("jamId", "author", "portfolioLinks", "description", "size", "timezoneOffsets", "languages"), errors.keys)
    }

    @Test
    fun `reject invalid update payload fields`() {
        val dto = PostItemUpdateDto(
            author = "",
            portfolioLinks = setOf("https://example.com/path?bad=true"),
            description = "",
            size = 0,
            skillsPossessed = null,
            skillsSought = null,
            preferredTools = null,
            availability = null,
            timezoneOffsets = setOf(-13),
            languages = setOf(""),
        )

        val errors = PostDtoValidator.validateUpdate(dto)
        assertEquals(setOf("author", "portfolioLinks", "description", "size", "timezoneOffsets", "languages"), errors.keys)
    }
}
