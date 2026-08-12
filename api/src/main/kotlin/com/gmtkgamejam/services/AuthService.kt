package com.gmtkgamejam.services

import com.auth0.jwt.JWT
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.auth.StoredAuthTokenSet
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.Indexes
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
import org.bson.Document
import java.util.Date
import java.util.concurrent.TimeUnit

interface AuthService {
    fun storeTokenSet(tokenSet: AuthTokenSet)
    fun getTokenSet(id: String): AuthTokenSet?
    fun getTokenSet(call: ApplicationCall): AuthTokenSet?
    fun updateTokenSet(tokenSet: AuthTokenSet)
    fun deleteTokenSet(id: String)
}

@Single(createdAtStart = true)
class AuthServiceImpl(
    client: MongoClient,
    private val authTokenEncryptionService: AuthTokenEncryptionService,
) : AuthService, KoinComponent {
    private val col: MongoCollection<StoredAuthTokenSet>
    private val rawCollection: MongoCollection<Document>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("auth")
        rawCollection = database.getCollection("auth")

        // Ensure lookups and expiry are consistent even if seed scripts were skipped.
        runCatching { col.dropIndex("expiry_1") }
        col.createIndex(Indexes.ascending(StoredAuthTokenSet::idHash.name), IndexOptions().unique(true))
        col.createIndex(Indexes.ascending(StoredAuthTokenSet::discordIdHash.name), IndexOptions().unique(true))
        col.createIndex(
            Indexes.ascending(StoredAuthTokenSet::createdAt.name),
            IndexOptions().expireAfter(7L, TimeUnit.DAYS)
        )

        migrateLegacyAuthDocuments()
    }

    override fun storeTokenSet(tokenSet: AuthTokenSet) {
        val encrypted = authTokenEncryptionService.encrypt(tokenSet)
        col.updateOne(
            StoredAuthTokenSet::discordIdHash eq encrypted.discordIdHash,
            encrypted,
            UpdateOptions().upsert(true)
        )
    }

    override fun getTokenSet(id: String): AuthTokenSet? {
        val idHash = authTokenEncryptionService.hashIdentifier(id)
        return col.findOne(StoredAuthTokenSet::idHash eq idHash)
            ?.let { runCatching { authTokenEncryptionService.decrypt(it) }.getOrNull() }
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
        val encrypted = authTokenEncryptionService.encrypt(tokenSet)
        col.updateOne(StoredAuthTokenSet::idHash eq encrypted.idHash, encrypted)
    }

    override fun deleteTokenSet(id: String) {
        val idHash = authTokenEncryptionService.hashIdentifier(id)
        col.deleteOne(StoredAuthTokenSet::idHash eq idHash)
    }

    private fun migrateLegacyAuthDocuments() {
        val legacyFilter = Document("accessToken", Document("\$exists", true))
        rawCollection.find(legacyFilter).forEach { doc ->
            val legacyTokenSet = legacyDocumentToTokenSet(doc) ?: return@forEach
            storeTokenSet(legacyTokenSet)
            doc["_id"]?.let { rawCollection.deleteOne(Document("_id", it)) }
        }
    }

    private fun legacyDocumentToTokenSet(doc: Document): AuthTokenSet? {
        val id = doc.getString("id") ?: return null
        val jamId = doc.getString("jamId") ?: return null
        val discordId = doc.getString("discordId") ?: return null
        val accessToken = doc.getString("accessToken") ?: return null
        val tokenType = doc.getString("tokenType") ?: return null
        val expiry = doc.getDate("expiry") ?: return null
        val refreshToken = doc.getString("refreshToken")

        return AuthTokenSet(
            id = id,
            jamId = jamId,
            discordId = discordId,
            accessToken = accessToken,
            tokenType = tokenType,
            expiry = expiry,
            refreshToken = refreshToken,
            createdAt = doc.getDate("createdAt") ?: Date(),
        )
    }

}
