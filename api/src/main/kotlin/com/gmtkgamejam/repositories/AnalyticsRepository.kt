package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.analytivs.AnalyticsCommonEvents
import com.gmtkgamejam.models.analytivs.AnalyticsMetricCounter
import com.gmtkgamejam.models.analytivs.AnalyticsViewEvent
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.AnalyticsCommonEvents as AnalyticsCommonEventsTable
import com.gmtkgamejam.db.AnalyticsViewEvents
import com.gmtkgamejam.db.AnalyticsMetricCounters
import com.gmtkgamejam.db.AnalyticsHomepageUniqueViews
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface AnalyticsRepository {
    fun trackQuery(jamId: String, queryParams: Map<String, List<String>>)
    fun trackLogin(jamId: String)
    fun trackPostMutation(jamId: String, action: String)
    fun trackHomepageView(jamId: String, viewerKey: String)
}

@Single(createdAtStart = true)
open class AnalyticsRepositoryImpl(private val dbManager: DatabaseManager) : AnalyticsRepository, KoinComponent {

    override fun trackQuery(jamId: String, queryParams: Map<String, List<String>>) {
        transaction(dbManager.database) {
            val normalizedJamId = jamId.ifBlank { "unknown" }
            val key = queryParams.toString()

            // Upsert analytics view event
            val existing = AnalyticsViewEvents.selectAll()
                .where { AnalyticsViewEvents.query eq key }
                .singleOrNull()

            if (existing != null) {
                val currentCount = existing[AnalyticsViewEvents.count]
                AnalyticsViewEvents.update({ AnalyticsViewEvents.query eq key }) {
                    it[AnalyticsViewEvents.count] = currentCount + 1
                }
            } else {
                AnalyticsViewEvents.insert {
                    it[AnalyticsViewEvents.query] = key
                    it[AnalyticsViewEvents.count] = 1
                }
            }

            // Track search terms
            queryParams["description"]
                ?.flatMap { it.split(',') }
                ?.map { it.trim().lowercase() }
                ?.filter { it.isNotBlank() }
                ?.forEach { incrementCounter(normalizedJamId, "search_term", "term=$it") }

            val filterKeys = setOf(
                "skillsPossessed",
                "skillsSought",
                "tools",
                "languages",
                "availability",
                "timezoneStart",
                "timezoneEnd",
            )

            queryParams
                .filter { (key, _) -> key in filterKeys }
                .forEach { (key, values) ->
                    values
                        .flatMap { it.split(',') }
                        .map { it.trim() }
                        .filter { it.isNotBlank() }
                        .forEach { value -> incrementCounter(normalizedJamId, "search_filter", "filter=$key,value=$value") }
                }

            if (queryParams.none { (key, values) -> key in filterKeys || (key == "description" && values.any { it.isNotBlank() }) }) {
                incrementCounter(normalizedJamId, "search_filter", "filter=none,value=none")
            }
        }
    }

    override fun trackLogin(jamId: String) {
        transaction(dbManager.database) {
            val normalizedJamId = jamId.ifBlank { "unknown" }

            // Upsert analytics common events
            val existing = AnalyticsCommonEventsTable.selectAll()
                .where { AnalyticsCommonEventsTable.id eq "events" }
                .singleOrNull()

            if (existing != null) {
                val currentCount = existing[AnalyticsCommonEventsTable.loginCount]
                AnalyticsCommonEventsTable.update({ AnalyticsCommonEventsTable.id eq "events" }) {
                    it[AnalyticsCommonEventsTable.loginCount] = currentCount + 1
                }
            } else {
                AnalyticsCommonEventsTable.insert {
                    it[AnalyticsCommonEventsTable.id] = "events"
                    it[AnalyticsCommonEventsTable.loginCount] = 1
                }
            }

            incrementCounter(normalizedJamId, "login", "source=userinfo")
        }
    }

    override fun trackPostMutation(jamId: String, action: String) {
        incrementCounter(jamId.ifBlank { "unknown" }, "post_mutation", "action=$action")
    }

    override fun trackHomepageView(jamId: String, viewerKey: String) {
        transaction(dbManager.database) {
            val normalizedJamId = jamId.ifBlank { "unknown" }
            incrementCounter(normalizedJamId, "homepage_view", "scope=total")

            val uniqueKey = "${normalizedJamId}|$viewerKey"
            val existing = AnalyticsHomepageUniqueViews.selectAll()
                .where { AnalyticsHomepageUniqueViews.id eq uniqueKey }
                .singleOrNull()

            if (existing == null) {
                AnalyticsHomepageUniqueViews.insert {
                    it[AnalyticsHomepageUniqueViews.id] = uniqueKey
                    it[AnalyticsHomepageUniqueViews.jamId] = normalizedJamId
                    it[AnalyticsHomepageUniqueViews.viewerKey] = viewerKey
                }
                incrementCounter(normalizedJamId, "homepage_view", "scope=unique")
            }
        }
    }

    private fun incrementCounter(jamId: String, metric: String, label: String) {
        transaction(dbManager.database) {
            val counterId = "${jamId}|${metric}|${label}"
            val existing = AnalyticsMetricCounters.selectAll()
                .where { AnalyticsMetricCounters.id eq counterId }
                .singleOrNull()

            if (existing != null) {
                val currentCount = existing[AnalyticsMetricCounters.count]
                AnalyticsMetricCounters.update({ AnalyticsMetricCounters.id eq counterId }) {
                    it[AnalyticsMetricCounters.count] = currentCount + 1
                }
            } else {
                AnalyticsMetricCounters.insert {
                    it[AnalyticsMetricCounters.id] = counterId
                    it[AnalyticsMetricCounters.jamId] = jamId
                    it[AnalyticsMetricCounters.metric] = metric
                    it[AnalyticsMetricCounters.label] = label
                    it[AnalyticsMetricCounters.count] = 1
                }
            }
        }
    }
}
