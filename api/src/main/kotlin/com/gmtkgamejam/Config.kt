package com.gmtkgamejam

import io.ktor.server.config.*
import org.koin.core.component.KoinComponent

//@Single
// Manually wired up in DependencyInjection.kt because it needs config passing in!
class Config(private val config: ApplicationConfig) : KoinComponent {

    /**
     * Get property string value
     */
    fun getString(key: String): String = config.property(key).getString()

    /**
     * Get property list value
     */
    // getList() doesn't parse comma-separated lists for some reason. eugh.
    fun getList(key: String): List<String> = config.property(key).getString().split(",")
}
