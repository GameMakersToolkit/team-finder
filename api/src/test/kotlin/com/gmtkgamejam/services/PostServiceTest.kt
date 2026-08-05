package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import com.gmtkgamejam.models.posts.dtos.PostItemCreateDto
import com.gmtkgamejam.models.posts.dtos.PostItemUpdateDto
import com.gmtkgamejam.repositories.PostRepository
import io.mockk.*
import org.junit.Before
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class PostServiceTest {
    private lateinit var repository: PostRepository
    private lateinit var service: PostService

    @Before
    fun beforeEach() {
        repository = mockk(relaxed = true)
        service = PostServiceImpl(repository)
    }

    @Test
    fun `createPostFromDto normalizes author timezone and size`() {
        val dto = PostItemCreateDto(
            jamId = "example-jam",
            author = "Alice",
            authorId = "ignored",
            portfolioLinks = setOf("https://example.com/portfolio"),
            description = "Hello",
            size = 999,
            skillsPossessed = setOf(Skills.CODE),
            skillsSought = setOf(Skills.MUSIC),
            preferredTools = setOf(Tools.UNITY),
            availability = Availability.FULL_TIME,
            timezoneOffsets = setOf(-13, -5, 0, 13),
            languages = setOf("English"),
        )

        val post = service.createPostFromDto(dto, "discord-123")

        assertEquals("discord-123", post.authorId)
        assertEquals(100, post.size)
        assertEquals(setOf(-5, 0), post.timezoneOffsets)
        assertTrue(post.id.isNotBlank())
    }

    @Test
    fun `applyUpdate mutates allowed fields and caps team size`() {
        val post = PostItem(
            id = "post-1",
            jamId = "example-jam",
            author = "Alice",
            authorId = "discord-123",
            portfolioLinks = setOf("https://example.com/portfolio"),
            description = "Hello",
            size = 4,
            skillsPossessed = setOf(Skills.CODE),
            skillsSought = setOf(Skills.MUSIC),
            preferredTools = setOf(Tools.UNITY),
            availability = Availability.FULL_TIME,
            timezoneOffsets = setOf(0),
            languages = setOf("English"),
            queryCount = 0,
            fullPageViewCount = 0,
            reportCount = 0,
            unableToContactCount = 0,
            createdAt = "2026-01-01 00:00:00",
            updatedAt = "2026-01-01 00:00:00",
            deletedAt = null,
        )

        val updated = service.applyUpdate(
            post,
            PostItemUpdateDto(
                author = "Bob",
                portfolioLinks = setOf("https://example.com/new"),
                description = "Updated",
                size = 200,
                skillsPossessed = setOf(Skills.ART_2D),
                skillsSought = setOf(Skills.WRITING),
                preferredTools = setOf(Tools.GODOT),
                availability = Availability.PART_TIME,
                timezoneOffsets = setOf(-12, 3, 15),
                languages = setOf("English", "French"),
            )
        )

        assertEquals("Bob", updated.author)
        assertEquals(100, updated.size)
        assertEquals(setOf(-12, 3), updated.timezoneOffsets)
        assertEquals(setOf(Tools.GODOT), updated.preferredTools)
        assertEquals(Availability.PART_TIME, updated.availability)
    }

    @Test
    fun `createPost delegates to repository`() {
        val post = mockk<PostItem>()
        every { repository.createPost(post) } just runs

        service.createPost(post)

        verify(exactly = 1) { repository.createPost(post) }
    }
}
