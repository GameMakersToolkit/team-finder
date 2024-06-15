package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.FavouritesList
import com.gmtkgamejam.models.posts.dtos.FavouritePostDto
import com.gmtkgamejam.repositories.FavouritesRepository
import com.gmtkgamejam.repositories.FavouritesRepositoryImpl
import com.mongodb.ConnectionString
import com.mongodb.client.MongoClient
import de.flapdoodle.embed.mongo.distribution.Version
import de.flapdoodle.embed.mongo.transitions.Mongod
import org.junit.AfterClass
import org.junit.Before
import org.junit.BeforeClass
import org.junit.Test
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.module
import org.koin.test.KoinTest
import org.koin.test.inject
import org.litote.kmongo.KMongo
import org.litote.kmongo.deleteMany
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals

class TestFavouritesRepository(
    client: MongoClient,
) : FavouritesRepositoryImpl(client) {
    fun removeAll() {
        col.deleteMany("{}")
    }

    fun getAllFavourites(): Iterable<FavouritesList?> = col.find()
}

class FavouritesServiceTest : KoinTest {
    companion object {
        private val module =
            module {
                single {
                    val running = Mongod.instance().start(Version.Main.V6_0)
                    val serverAddress = running.current().serverAddress
                    val connectionString = ConnectionString("mongodb://${serverAddress.host}:${serverAddress.port}")
                    return@single KMongo.createClient(connectionString)
                }
                single<FavouritesRepository> { TestFavouritesRepository(get()) }
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

    private val service = FavouritesService()
    private val repository: FavouritesRepository by inject()

    @Before
    fun beforeEach() {
        (repository as TestFavouritesRepository).removeAll()
    }

    @Test
    fun `should save favourites`() {
        val f = service.saveFavourites(FavouritesList("discordId-2", mutableListOf("4", "5")))
        assertEquals(f, service.getFavouritesByUserId("discordId-2"))
    }

    @Test
    fun `should add post to favourite list`() {
        service.saveFavourites(FavouritesList("discordId-1", mutableListOf("2")))
        service.saveFavourites(FavouritesList("discordId-2", mutableListOf()))

        service.addPostAsFavourite("discordId-1", FavouritePostDto("1"))
        service.addPostAsFavourite("discordId-2", FavouritePostDto("1"))
        service.addPostAsFavourite("discordId-3", FavouritePostDto("1"))

        assertContentEquals(
            listOf(
                FavouritesList("discordId-1", mutableListOf("2", "1")),
                FavouritesList("discordId-2", mutableListOf("1")),
                FavouritesList("discordId-3", mutableListOf("1")),
            ),
            (repository as TestFavouritesRepository).getAllFavourites(),
        )
    }
}
