package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.posts.FavouritesList
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.Favourites
import com.gmtkgamejam.db.JsonSerializationHelper
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent


interface FavouritesRepository {
    fun getFavouritesByUserId(discordId: String): FavouritesList?
    fun saveFavourites(favouritesToSave: FavouritesList)
}

@Single(createdAtStart = true)
open class FavouritesRepositoryImpl(private val dbManager: DatabaseManager) : FavouritesRepository, KoinComponent {

    override fun getFavouritesByUserId(discordId: String): FavouritesList? {
        return transaction(dbManager.database) {
            Favourites.selectAll()
                .where { Favourites.discordId eq discordId }
                .singleOrNull()
                ?.let { rowToFavouritesList(it) }
        }
    }

    override fun saveFavourites(favouritesToSave: FavouritesList) {
        transaction(dbManager.database) {
            val existing = Favourites.selectAll()
                .where { Favourites.discordId eq favouritesToSave.discordId }
                .singleOrNull()

            if (existing != null) {
                Favourites.update({ Favourites.discordId eq favouritesToSave.discordId }) {
                    it[Favourites.postIds] = JsonSerializationHelper.encodeToJson(favouritesToSave.postIds)
                }
            } else {
                Favourites.insert {
                    it[Favourites.discordId] = favouritesToSave.discordId
                    it[Favourites.postIds] = JsonSerializationHelper.encodeToJson(favouritesToSave.postIds)
                }
            }
        }
    }

    private fun rowToFavouritesList(row: ResultRow): FavouritesList {
        return FavouritesList(
            discordId = row[Favourites.discordId],
            postIds = (JsonSerializationHelper.decodeFromJson<List<String>>(row[Favourites.postIds]) ?: emptyList()).toMutableList()
        )
    }
}
