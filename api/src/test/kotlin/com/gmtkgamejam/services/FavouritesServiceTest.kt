package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.dtos.FavouritePostDto
import com.gmtkgamejam.models.posts.FavouritesList
import com.gmtkgamejam.repositories.FavouritesRepository
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.runs
import io.mockk.slot
import io.mockk.verify
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.koin.test.KoinTest
import kotlin.test.assertEquals

class FavouritesServiceTest : KoinTest {
    private lateinit var repository: FavouritesRepository
    private lateinit var service: FavouritesService

    @Before
    fun beforeEach() {
        repository = mockk()
        service = FavouritesServiceImpl(repository)
    }

    @Test
    fun `should add to existing list`() {
        val discordId = "existing-user"
        every { repository.getFavouritesByUserId(discordId) } returns FavouritesList(discordId, mutableListOf("post1"))
        every { repository.saveFavourites(any()) } just runs

        val result = service.addPostAsFavourite(discordId, FavouritePostDto("post2"))
        assertEquals(2, result.postIds.size)
        assertTrue(result.postIds.contains("post2"))

        verify(exactly = 1) { repository.saveFavourites(capture(slot())) }
        val captured = slot<FavouritesList>()
        verify { repository.saveFavourites(capture(captured)) }
        assertTrue(captured.captured.postIds.contains("post1"))
        assertTrue(captured.captured.postIds.contains("post2"))
    }

    @Test
    fun `should create new list if added for new user`() {
        val discordId = "new-user"

        every { repository.getFavouritesByUserId(discordId) } returns null
        every { repository.saveFavourites(any()) } just runs

        val result = service.addPostAsFavourite(discordId, FavouritePostDto("post1"))
        assertEquals(discordId, result.discordId)
        assertEquals(1, result.postIds.size)
        assertTrue(result.postIds.contains("post1"))

        verify(exactly = 1) { repository.getFavouritesByUserId(discordId) }
        val captured = slot<FavouritesList>()
        verify(exactly = 1) { repository.saveFavourites(capture(captured)) }
        assertEquals(discordId, captured.captured.discordId)
        assertTrue(captured.captured.postIds.contains("post1"))
    }
}