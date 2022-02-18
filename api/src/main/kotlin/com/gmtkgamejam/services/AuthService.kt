package com.gmtkgamejam.services

import com.gmtkgamejam.models.AuthTokenSet
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

class AuthService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<AuthTokenSet>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("auth")
    }

    fun storeTokens(tokenSet: AuthTokenSet) {
        col.insertOne(tokenSet)
    }

    fun getOAuthPrincipal(jwt: String): AuthTokenSet? {
        return col.findOne(AuthTokenSet::jwt eq jwt)
    }

    fun updateTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::jwt eq tokenSet.jwt, tokenSet)
    }

}

