package com.gmtkgamejam.services

import com.auth0.jwt.JWT
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.auth.StoredAuthTokenSet
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.StoredAuthTokens
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import java.util.Date

interface AuthService {
    fun storeTokenSet(tokenSet: AuthTokenSet)
    fun getTokenSet(id: String): AuthTokenSet?
    fun getTokenSet(call: ApplicationCall): AuthTokenSet?
    fun updateTokenSet(tokenSet: AuthTokenSet)
    fun deleteTokenSet(id: String)
}

@Single(createdAtStart = true)
class AuthServiceImpl(
    private val dbManager: DatabaseManager,
    private val authTokenEncryptionService: AuthTokenEncryptionService,
) : AuthService, KoinComponent {

    override fun storeTokenSet(tokenSet: AuthTokenSet) {
        val encrypted = authTokenEncryptionService.encrypt(tokenSet)
        transaction(dbManager.database) {
            val existing = StoredAuthTokens.selectAll()
                .where { StoredAuthTokens.discordIdHash eq encrypted.discordIdHash }
                .singleOrNull()

            if (existing != null) {
                StoredAuthTokens.update({ StoredAuthTokens.discordIdHash eq encrypted.discordIdHash }) {
                    it[StoredAuthTokens.id] = encrypted.id
                    it[StoredAuthTokens.idHash] = encrypted.idHash
                    it[StoredAuthTokens.jamId] = encrypted.jamId
                    it[StoredAuthTokens.discordId] = encrypted.discordId
                    it[StoredAuthTokens.discordIdHash] = encrypted.discordIdHash
                    it[StoredAuthTokens.accessToken] = encrypted.accessToken
                    it[StoredAuthTokens.tokenType] = encrypted.tokenType
                    it[StoredAuthTokens.expiry] = encrypted.expiry.time
                    it[StoredAuthTokens.refreshToken] = encrypted.refreshToken
                    it[StoredAuthTokens.createdAt] = encrypted.createdAt.time
                }
            } else {
                StoredAuthTokens.insert {
                    it[StoredAuthTokens.id] = encrypted.id
                    it[StoredAuthTokens.idHash] = encrypted.idHash
                    it[StoredAuthTokens.jamId] = encrypted.jamId
                    it[StoredAuthTokens.discordId] = encrypted.discordId
                    it[StoredAuthTokens.discordIdHash] = encrypted.discordIdHash
                    it[StoredAuthTokens.accessToken] = encrypted.accessToken
                    it[StoredAuthTokens.tokenType] = encrypted.tokenType
                    it[StoredAuthTokens.expiry] = encrypted.expiry.time
                    it[StoredAuthTokens.refreshToken] = encrypted.refreshToken
                    it[StoredAuthTokens.createdAt] = encrypted.createdAt.time
                }
            }
        }
    }

    override fun getTokenSet(id: String): AuthTokenSet? {
        val idHash = authTokenEncryptionService.hashIdentifier(id)
        return transaction(dbManager.database) {
            StoredAuthTokens.selectAll()
                .where { StoredAuthTokens.idHash eq idHash }
                .singleOrNull()
                ?.let { rowToStoredAuthTokenSet(it) }
                ?.let { runCatching { authTokenEncryptionService.decrypt(it) }.getOrNull() }
        }
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
        transaction(dbManager.database) {
            StoredAuthTokens.update({ StoredAuthTokens.idHash eq encrypted.idHash }) {
                it[StoredAuthTokens.accessToken] = encrypted.accessToken
                it[StoredAuthTokens.tokenType] = encrypted.tokenType
                it[StoredAuthTokens.expiry] = encrypted.expiry.time
                it[StoredAuthTokens.refreshToken] = encrypted.refreshToken
            }
        }
    }

    override fun deleteTokenSet(id: String) {
        val idHash = authTokenEncryptionService.hashIdentifier(id)
        transaction(dbManager.database) {
            StoredAuthTokens.deleteWhere { StoredAuthTokens.idHash eq idHash }
        }
    }

    private fun rowToStoredAuthTokenSet(row: ResultRow): StoredAuthTokenSet {
        return StoredAuthTokenSet(
            id = row[StoredAuthTokens.id],
            idHash = row[StoredAuthTokens.idHash],
            jamId = row[StoredAuthTokens.jamId],
            discordId = row[StoredAuthTokens.discordId],
            discordIdHash = row[StoredAuthTokens.discordIdHash],
            accessToken = row[StoredAuthTokens.accessToken],
            tokenType = row[StoredAuthTokens.tokenType],
            expiry = Date(row[StoredAuthTokens.expiry]),
            refreshToken = row[StoredAuthTokens.refreshToken],
            createdAt = Date(row[StoredAuthTokens.createdAt])
        )
    }

}
