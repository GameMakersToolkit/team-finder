package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.analytivs.AnalyticsCommonEvents
import com.gmtkgamejam.models.analytivs.AnalyticsMetricCounter
import com.gmtkgamejam.models.analytivs.AnalyticsViewEvent
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.Updates.combine
import com.mongodb.client.model.Updates.inc
import com.mongodb.client.model.Updates.setOnInsert
import org.bson.Document
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

interface AnalyticsRepository {
    fun trackQuery(jamId: String, queryParams: Map<String, List<String>>)
    fun trackLogin(jamId: String)
    fun trackPostMutation(jamId: String, action: String)
    fun trackHomepageView(jamId: String, viewerKey: String)
}

@Single(createdAtStart = true)
open class AnalyticsRepositoryImpl(val client: MongoClient) : AnalyticsRepository, KoinComponent {
    protected val col: MongoCollection<AnalyticsCommonEvents> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-events")

    protected val viewCol: MongoCollection<AnalyticsViewEvent> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-view-events")

    protected val metricCol: MongoCollection<AnalyticsMetricCounter> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-metric-counters")

    protected val uniqueHomepageViewCol: MongoCollection<Document> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-homepage-unique-views")

    override fun trackQuery(jamId: String, queryParams: Map<String, List<String>>) {
        val normalizedJamId = jamId.ifBlank { "unknown" }
        val key = queryParams.toString()

        val record = viewCol.findOne(AnalyticsViewEvent::query eq key) ?: AnalyticsViewEvent(key, 0)
        record.count += 1

        viewCol.updateOne(AnalyticsViewEvent::query eq key, record, UpdateOptions().upsert(true))

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

    override fun trackLogin(jamId: String) {
        val record: AnalyticsCommonEvents = col.findOne(AnalyticsCommonEvents::id eq "events") ?: AnalyticsCommonEvents("events", 0)
        record.loginCount += 1

        col.updateOne(AnalyticsCommonEvents::id eq "events", record, UpdateOptions().upsert(true))
        incrementCounter(jamId.ifBlank { "unknown" }, "login", "source=userinfo")
    }

    override fun trackPostMutation(jamId: String, action: String) {
        incrementCounter(jamId.ifBlank { "unknown" }, "post_mutation", "action=$action")
    }

    override fun trackHomepageView(jamId: String, viewerKey: String) {
        val normalizedJamId = jamId.ifBlank { "unknown" }
        incrementCounter(normalizedJamId, "homepage_view", "scope=total")

        val uniqueKey = "${normalizedJamId}|$viewerKey"
        val uniqueInsertResult = uniqueHomepageViewCol.updateOne(
            com.mongodb.client.model.Filters.eq("_id", uniqueKey),
            combine(
                setOnInsert("_id", uniqueKey),
                setOnInsert("jamId", normalizedJamId),
                setOnInsert("viewerKey", viewerKey),
            ),
            UpdateOptions().upsert(true)
        )

        if (uniqueInsertResult.upsertedId != null) {
            incrementCounter(normalizedJamId, "homepage_view", "scope=unique")
        }
    }


    private fun incrementCounter(jamId: String, metric: String, label: String) {
        val counterId = "${jamId}|${metric}|${label}"
        metricCol.updateOne(
            AnalyticsMetricCounter::id eq counterId,
            combine(
                setOnInsert(AnalyticsMetricCounter::id.name, counterId),
                setOnInsert(AnalyticsMetricCounter::jamId.name, jamId),
                setOnInsert(AnalyticsMetricCounter::metric.name, metric),
                setOnInsert(AnalyticsMetricCounter::label.name, label),
                inc(AnalyticsMetricCounter::count.name, 1),
            ),
            UpdateOptions().upsert(true)
        )
    }
}
