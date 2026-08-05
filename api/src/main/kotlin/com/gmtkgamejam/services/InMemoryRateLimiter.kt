package com.gmtkgamejam.services

import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

class InMemoryRateLimiter(
    private val maxRequests: Int,
    private val windowSeconds: Long,
) {
    private val entries = ConcurrentHashMap<String, MutableList<Long>>()

    fun isAllowed(key: String, now: Long = Instant.now().epochSecond): Boolean {
        val cutoff = now - windowSeconds
        val list = entries.computeIfAbsent(key) { mutableListOf() }

        synchronized(list) {
            list.removeIf { it < cutoff }
            if (list.size >= maxRequests) {
                return false
            }
            list.add(now)
            return true
        }
    }
}
