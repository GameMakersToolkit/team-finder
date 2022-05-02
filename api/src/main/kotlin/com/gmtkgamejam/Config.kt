package com.gmtkgamejam

import io.ktor.config.*

// Use object to make Config a singleton reference
// I truly hate that Ktor makes me do this
object Config {
    private lateinit var config: ApplicationConfig

    fun initConfig(_config: ApplicationConfig) {
        config = _config
    }

    /**
     * Get property string value
     */
    fun getString(key: String): String = config.property(key).getString()

    /**
     * Get property list value
     */
    fun getList(key: String): List<String> = config.property(key).getList()
}