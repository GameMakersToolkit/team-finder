package com.gmtkgamejam.services

import com.gmtkgamejam.models.auth.AuthTokenSet
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

interface AuthService {
    fun storeTokenSet(tokenSet: AuthTokenSet)
    fun getTokenSet(id: String): AuthTokenSet?
    fun getTokenSet(call: ApplicationCall): AuthTokenSet?
    fun updateTokenSet(tokenSet: AuthTokenSet)
}

@Single(createdAtStart = true)
class AuthServiceImpl(client: MongoClient) : AuthService, KoinComponent {
    private val col: MongoCollection<AuthTokenSet>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("auth")
    }

    override fun storeTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::discordId eq tokenSet.discordId, tokenSet, UpdateOptions().upsert(true))
    }

    override fun getTokenSet(id: String): AuthTokenSet? {
        return col.findOne(AuthTokenSet::id eq id)
    }

    override fun getTokenSet(call: ApplicationCall): AuthTokenSet? {
        val principal = call.principal<JWTPrincipal>()!!
        val id = principal.payload.getClaim("id").asString()

        return getTokenSet(id)
    }

    override fun updateTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::id eq tokenSet.id, tokenSet)
    }

}
