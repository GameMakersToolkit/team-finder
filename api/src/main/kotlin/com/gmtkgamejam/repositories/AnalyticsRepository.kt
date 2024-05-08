package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.analytivs.AnalyticsCommonEvents
import com.gmtkgamejam.models.analytivs.AnalyticsViewEvent
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

interface AnalyticsRepository {
    fun trackQuery(queryParams: Map<String, Any>)
    fun trackLogin()
}

open class AnalyticsRepositoryImpl(val client: MongoClient) : AnalyticsRepository {
    protected val col: MongoCollection<AnalyticsCommonEvents> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-events")

    protected val viewCol: MongoCollection<AnalyticsViewEvent> = client
        .getDatabase("team-finder")
        .getCollectionOfName("analytics-view-events")

    override fun trackQuery(queryParams: Map<String, Any>) {
        val key = queryParams.toString()

        val record = viewCol.findOne(AnalyticsViewEvent::query eq key) ?: AnalyticsViewEvent(key, 0)
        record.count += 1

        viewCol.updateOne(AnalyticsViewEvent::query eq key, record, UpdateOptions().upsert(true))
    }

    override fun trackLogin() {
        val record: AnalyticsCommonEvents = col.findOne(AnalyticsCommonEvents::id eq "events") ?: AnalyticsCommonEvents("events", 0)
        record.loginCount += 1

        col.updateOne(AnalyticsCommonEvents::id eq "events", record, UpdateOptions().upsert(true))
    }
}