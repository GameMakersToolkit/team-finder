package com.gmtkgamejam.services

import com.gmtkgamejam.models.AuthTokenSet
import com.gmtkgamejam.models.FavouritesList
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

class FavouritesService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<FavouritesList>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("favourites")
    }

    fun getFavouritesByUserId(discordId: String): FavouritesList {
        return col.findOne(FavouritesList::discordId eq discordId) ?: FavouritesList(discordId)
    }

    fun saveFavourites(favourites: FavouritesList) {
        col.updateOne(AuthTokenSet::discordId eq favourites.discordId, favourites, UpdateOptions().upsert(true))
    }

}

