package com.gmtkgamejam.db

import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Transaction
import org.slf4j.LoggerFactory

object DatabaseMigrations {
    private val logger = LoggerFactory.getLogger(javaClass)

    /**
     * Initialize all database tables and indexes
     * This should be called during application startup
     */
    fun initializeTables(transaction: Transaction) {
        logger.info("Initializing database tables...")

        with(transaction) {
            SchemaUtils.create(
                Posts,
                Jams,
                Favourites,
                BannedUsers,
                AuthTokens,
                StoredAuthTokens,
                AnalyticsCommonEvents,
                AnalyticsViewEvents,
                AnalyticsMetricCounters,
                AnalyticsHomepageUniqueViews
            )
        }

        logger.info("Database tables initialized successfully")
    }
}
