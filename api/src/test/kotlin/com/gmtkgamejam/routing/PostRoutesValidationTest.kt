package com.gmtkgamejam.routing

import org.junit.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PostRoutesValidationTest {
    @Test
    fun `accept safe http and https urls`() {
        assertTrue(isSafePortfolioUrl("https://example.com"))
        assertTrue(isSafePortfolioUrl("https://example.com/portfolio/me"))
        assertTrue(isSafePortfolioUrl("http://localhost:3000/user/abc"))
    }

    @Test
    fun `reject unsupported schemes and malformed urls`() {
        assertFalse(isSafePortfolioUrl("javascript:alert(1)"))
        assertFalse(isSafePortfolioUrl("ftp://example.com/file"))
        assertFalse(isSafePortfolioUrl("not-a-url"))
    }

    @Test
    fun `reject urls with query fragments and whitespace`() {
        assertFalse(isSafePortfolioUrl("https://example.com/path?debug=true"))
        assertFalse(isSafePortfolioUrl("https://example.com/path#anchor"))
        assertFalse(isSafePortfolioUrl("https://example.com/path with space"))
    }
}
