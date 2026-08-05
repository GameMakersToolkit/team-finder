package com.gmtkgamejam.services

import org.junit.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class InMemoryRateLimiterTest {
    @Test
    fun `allow requests within window limit`() {
        val limiter = InMemoryRateLimiter(maxRequests = 2, windowSeconds = 60)

        assertTrue(limiter.isAllowed("user:ip", now = 1000))
        assertTrue(limiter.isAllowed("user:ip", now = 1001))
        assertFalse(limiter.isAllowed("user:ip", now = 1002))
    }

    @Test
    fun `expire old requests outside window`() {
        val limiter = InMemoryRateLimiter(maxRequests = 2, windowSeconds = 60)

        assertTrue(limiter.isAllowed("user:ip", now = 1000))
        assertTrue(limiter.isAllowed("user:ip", now = 1001))
        assertTrue(limiter.isAllowed("user:ip", now = 1062))
    }
}
