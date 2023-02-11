package com.gmtkgamejam.services

import com.gmtkgamejam.models.BannedUser
import com.gmtkgamejam.repositories.AdminRepository
import org.junit.AfterClass
import org.junit.Before
import org.junit.BeforeClass
import org.junit.Test
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.module
import org.koin.test.KoinTest
import kotlin.test.assertContentEquals

class TestAdminRepository : AdminRepository {
    companion object {
        val bannedUsers = mutableListOf<BannedUser>()
    }

    override fun banUser(bannedUser: BannedUser) {
        bannedUsers.add(bannedUser)
    }

    override fun unbanUser(bannedUser: BannedUser) {
        bannedUsers.removeIf { it == bannedUser }
    }

}

class AdminServiceTest : KoinTest {
    companion object {
        private val module = module {
            single<AdminRepository> { TestAdminRepository() }
        }

        @BeforeClass
        @JvmStatic
        fun setup() {
            startKoin {
                modules(module)
            }
        }

        @AfterClass
        @JvmStatic
        fun teardown() {
            stopKoin()
        }
    }

    @Before
    fun beforeEach() = TestAdminRepository.bannedUsers.clear()

    private val service = AdminService()

    @Test
    fun `should ban a user`() = run {
        val u = BannedUser("discordId-1", "admin", "just now")
        service.banUser(u)

        assertContentEquals(
            listOf(u),
            TestAdminRepository.bannedUsers
        )
    }

    @Test
    fun `should unban a banned user`() = run {
        val u = BannedUser("discordId-1", "admin", "just now")
        service.banUser(u)
        service.unbanUser(u)

        assertContentEquals(
            listOf(),
            TestAdminRepository.bannedUsers
        )
    }
}