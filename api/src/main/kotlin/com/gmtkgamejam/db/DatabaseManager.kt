package com.gmtkgamejam.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

class DatabaseManager(connectionString: String) {
    private val logger = LoggerFactory.getLogger(javaClass)

    private val dataSource: HikariDataSource
    val database: Database

    init {
        logger.info("Initializing PostgreSQL connection pool...")

        val config = HikariConfig().apply {
            jdbcUrl = connectionString
            maximumPoolSize = 10
            minimumIdle = 2
            connectionTimeout = 30000
            idleTimeout = 600000
            maxLifetime = 1800000
        }

        dataSource = HikariDataSource(config)
        database = Database.connect(dataSource)

        logger.info("PostgreSQL connection pool initialized")
    }

    /**
     * Execute a database transaction
     */
    fun <T> transaction(block: org.jetbrains.exposed.sql.Transaction.() -> T): T {
        return transaction(database, block)
    }

    /**
     * Close the connection pool
     */
    fun close() {
        logger.info("Closing database connection pool...")
        dataSource.close()
    }
}
