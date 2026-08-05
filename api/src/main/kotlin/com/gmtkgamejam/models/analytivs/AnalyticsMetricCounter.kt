package com.gmtkgamejam.models.analytivs

data class AnalyticsMetricCounter(
    val id: String,
    val jamId: String,
    val metric: String,
    val label: String = "",
    var count: Long = 0,
)
