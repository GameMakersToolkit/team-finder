package com.gmtkgamejam.services

import com.gmtkgamejam.Config
import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.auth.StoredAuthTokenSet
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.koin.core.annotation.Single
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

@Single(createdAtStart = true)
class AuthTokenEncryptionService(config: Config) {
    private val keyBytes: ByteArray
    private val secureRandom = SecureRandom()
    private val json = Json

    init {
        val keyBase64 = config.getString("secrets.auth.encryptionKeyBase64")
        keyBytes = Base64.getDecoder().decode(keyBase64)

        require(keyBytes.size == AES_KEY_BYTES) {
            "secrets.auth.encryptionKeyBase64 must decode to exactly $AES_KEY_BYTES bytes"
        }
    }

    fun encrypt(tokenSet: AuthTokenSet): StoredAuthTokenSet {
        val iv = ByteArray(GCM_IV_BYTES).also { secureRandom.nextBytes(it) }
        val payload = AuthTokenPayload(
            id = tokenSet.id,
            jamId = tokenSet.jamId,
            discordId = tokenSet.discordId,
            accessToken = tokenSet.accessToken,
            tokenType = tokenSet.tokenType,
            expiryEpochMs = tokenSet.expiry.time,
            refreshToken = tokenSet.refreshToken,
            createdAtEpochMs = tokenSet.createdAt.time,
        )

        val plaintext = json.encodeToString(AuthTokenPayload.serializer(), payload).toByteArray(Charsets.UTF_8)
        val ciphertext = aesEncrypt(plaintext, iv)

        return StoredAuthTokenSet(
            idHash = hashIdentifier(tokenSet.id),
            discordIdHash = hashIdentifier(tokenSet.discordId),
            createdAt = tokenSet.createdAt,
            payload = Base64.getEncoder().encodeToString(ciphertext),
            iv = Base64.getEncoder().encodeToString(iv),
        )
    }

    fun decrypt(stored: StoredAuthTokenSet): AuthTokenSet {
        val iv = Base64.getDecoder().decode(stored.iv)
        val ciphertext = Base64.getDecoder().decode(stored.payload)
        val plaintext = aesDecrypt(ciphertext, iv)
        val payload = json.decodeFromString(AuthTokenPayload.serializer(), plaintext.toString(Charsets.UTF_8))

        return AuthTokenSet(
            id = payload.id,
            jamId = payload.jamId,
            discordId = payload.discordId,
            accessToken = payload.accessToken,
            tokenType = payload.tokenType,
            expiry = Date(payload.expiryEpochMs),
            refreshToken = payload.refreshToken,
            createdAt = Date(payload.createdAtEpochMs),
        )
    }

    fun hashIdentifier(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest)
    }

    private fun aesEncrypt(plaintext: ByteArray, iv: ByteArray): ByteArray {
        val cipher = Cipher.getInstance(AES_TRANSFORMATION)
        val key = SecretKeySpec(keyBytes, "AES")
        cipher.init(Cipher.ENCRYPT_MODE, key, GCMParameterSpec(GCM_TAG_BITS, iv))
        return cipher.doFinal(plaintext)
    }

    private fun aesDecrypt(ciphertext: ByteArray, iv: ByteArray): ByteArray {
        val cipher = Cipher.getInstance(AES_TRANSFORMATION)
        val key = SecretKeySpec(keyBytes, "AES")
        cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(GCM_TAG_BITS, iv))
        return cipher.doFinal(ciphertext)
    }

    @Serializable
    private data class AuthTokenPayload(
        val id: String,
        val jamId: String,
        val discordId: String,
        val accessToken: String,
        val tokenType: String,
        val expiryEpochMs: Long,
        val refreshToken: String?,
        val createdAtEpochMs: Long,
    )

    private companion object {
        const val AES_KEY_BYTES = 32
        const val GCM_IV_BYTES = 12
        const val GCM_TAG_BITS = 128
        const val AES_TRANSFORMATION = "AES/GCM/NoPadding"
    }
}
