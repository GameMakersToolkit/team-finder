package com.gmtkgamejam

import io.ktor.server.application.*
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.ksp.generated.module
import org.litote.kmongo.KMongo


fun Application.koinModule() {
    startKoin {
        modules(
            module(createdAtStart = true) { single { Config(environment.config) } },
            DiModule().module,
            module(createdAtStart = true) {
                single {
                    val config: Config by inject()
                    val url = config.getString("secrets.database.url")
                    KMongo.createClient(url)
                }
            }
        )
    }
}
