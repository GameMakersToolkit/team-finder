package com.gmtkgamejam

import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class AuthStateTest {
    @Test
    fun `append and extract jam id from oauth state`() {
        val state = appendJamIdToOAuthState("baseState123", "example-jam")
        assertNotNull(state)

        val jamId = extractJamIdFromOAuthState(state)
        assertEquals("example-jam", jamId)
    }

    @Test
    fun `reject invalid jam ids in oauth state`() {
        val state = appendJamIdToOAuthState("baseState123", "bad/jam")
        assertNull(state)
    }

    @Test
    fun `reject malformed oauth state`() {
        assertNull(extractJamIdFromOAuthState("missing-delimiter"))
        assertNull(extractJamIdFromOAuthState("state.jamId.bad/jam"))
    }
}
