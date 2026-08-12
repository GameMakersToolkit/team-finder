package com.gmtkgamejam.services

import com.gmtkgamejam.Config
import com.gmtkgamejam.models.auth.AuthTokenSet
import io.ktor.server.config.MapApplicationConfig
import org.junit.Test
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class AuthTokenEncryptionServiceTest {

    @Test
    fun `encrypts and decrypts auth token sets`() {
        val service = AuthTokenEncryptionService(testConfig())
        val tokenSet = AuthTokenSet(
            id = "session-id",
            jamId = "jam-1",
            discordId = "12345",
            accessToken = "access-token-value",
            tokenType = "Bearer",
            expiry = Date(1_725_000_000_000),
            refreshToken = "refresh-token-value",
            createdAt = Date(1_724_000_000_000),
        )

        val encrypted = service.encrypt(tokenSet)
        assertNotEquals(tokenSet.accessToken, encrypted.payload)
        assertTrue(encrypted.payload.isNotBlank())
        assertTrue(encrypted.iv.isNotBlank())

        val decrypted = service.decrypt(encrypted)
        assertEquals(tokenSet, decrypted)
    }

    @Test
    fun `hashes are deterministic and non-plaintext`() {
        val service = AuthTokenEncryptionService(testConfig())
        val firstHash = service.hashIdentifier("discord-user-id")
        val secondHash = service.hashIdentifier("discord-user-id")

        assertEquals(firstHash, secondHash)
        assertNotEquals("discord-user-id", firstHash)
    }

    private fun testConfig(): Config {
        val keyBytes = ByteArray(32) { index -> (index + 1).toByte() }
        val keyBase64 = Base64.getEncoder().encodeToString(keyBytes)

        return Config(
            MapApplicationConfig(
                "secrets.auth.encryptionKeyBase64" to keyBase64
            )
        )
    }
}
