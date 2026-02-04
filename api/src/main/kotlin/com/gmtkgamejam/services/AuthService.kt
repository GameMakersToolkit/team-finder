package com.gmtkgamejam.services

import com.auth0.jwt.JWT
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
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
        val principal: JWTPrincipal? = call.principal<JWTPrincipal>()

        if (principal != null) {
            val id = principal.payload.getClaim("id").asString()
            return getTokenSet(id)
        }

        // Fallback attempt if the current request isn't in an `authenticate("auth-jwt")` route
        val id = call.request.header("Authorization")?.substring(7)
                ?.let { JWT.decode(it) }
                ?.getClaim("id")
                ?.asString()

        return id?.let { getTokenSet(it) }
    }

    override fun updateTokenSet(tokenSet: AuthTokenSet) {
        col.updateOne(AuthTokenSet::id eq tokenSet.id, tokenSet)
    }

}
