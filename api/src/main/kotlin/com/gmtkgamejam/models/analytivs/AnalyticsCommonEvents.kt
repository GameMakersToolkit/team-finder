package com.gmtkgamejam.models.analytivs

// There will only be one of these in the DB
data class AnalyticsCommonEvents(
    val id: String = "events",
    var loginCount: Int,
)
