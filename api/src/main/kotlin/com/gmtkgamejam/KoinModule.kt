package com.gmtkgamejam

import io.ktor.server.application.*
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.ksp.generated.module
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.DatabaseMigrations


fun Application.koinModule() {
    startKoin {
        modules(
            module(createdAtStart = true) { single { Config(environment.config) } },
            module {
                single<DatabaseManager> {
                    val config: Config by inject()
                    val url = config.getString("secrets.database.url")
                    val dbManager = DatabaseManager(url)

                    // Initialize database tables on startup
                    dbManager.transaction {
                        DatabaseMigrations.initializeTables(this)
                    }

                    dbManager
                }
            },
            DiModule().module
        )
    }
}
