package com.gmtkgamejam.models.analytivs

data class AnalyticsViewEvent(
    val query: String,
    var count: Int = 0
)
