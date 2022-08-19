package com.gmtkgamejam.services

import com.gmtkgamejam.models.AuthTokenSet
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
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

    fun storeTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::discordId eq tokenSet.discordId, tokenSet, UpdateOptions().upsert(true))
    }

    fun getTokenSet(id: String): AuthTokenSet? {
        return col.findOne(AuthTokenSet::id eq id)
    }

    fun getTokenSet(call: ApplicationCall): AuthTokenSet? {
        val principal = call.principal<JWTPrincipal>()!!
        val id = principal.payload.getClaim("id").asString()

        return getTokenSet(id)
    }

    fun updateTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::id eq tokenSet.id, tokenSet)
    }

}

