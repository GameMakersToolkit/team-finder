package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.posts.FavouritesList
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne


interface FavouritesRepository {
    fun getFavouritesByUserId(discordId: String): FavouritesList?
    fun saveFavourites(favouritesToSave: FavouritesList)
}

@Single(createdAtStart = true)
open class FavouritesRepositoryImpl(val client: MongoClient) : FavouritesRepository, KoinComponent {
    protected val col: MongoCollection<FavouritesList> = client
        .getDatabase("team-finder")
        .getCollectionOfName("favourites")

    override fun getFavouritesByUserId(discordId: String): FavouritesList? {
        return col.findOne(FavouritesList::discordId eq discordId)
    }

    override fun saveFavourites(favouritesToSave: FavouritesList) {
        col.updateOne(AuthTokenSet::discordId eq favouritesToSave.discordId, favouritesToSave, UpdateOptions().upsert(true))
    }
}
