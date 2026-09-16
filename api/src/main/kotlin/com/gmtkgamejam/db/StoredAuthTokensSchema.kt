package com.gmtkgamejam.db

import org.jetbrains.exposed.sql.Table

/**
 * StoredAuthTokens table - stores encrypted Discord OAuth tokens with TTL
 */
object StoredAuthTokens : Table("stored_auth_tokens") {
    val id = varchar("id", 255)
    val idHash = varchar("id_hash", 255)
    val jamId = varchar("jam_id", 255)
    val discordId = varchar("discord_id", 255)
    val discordIdHash = varchar("discord_id_hash", 255)
    val accessToken = text("access_token")
    val tokenType = varchar("token_type", 50)
    val expiry = long("expiry")
    val refreshToken = text("refresh_token").nullable()
    val createdAt = long("created_at")

    override val primaryKey = PrimaryKey(id)
}
