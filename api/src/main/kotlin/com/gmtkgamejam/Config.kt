package com.gmtkgamejam

import io.ktor.config.*

// Use object to make Config a singleton reference
// I truly hate that Ktor makes me do this
// TODO: Refactor other non-standard usages of config into this (e.g. DatabaseModule)
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