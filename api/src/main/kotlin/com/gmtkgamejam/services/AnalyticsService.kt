package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.AnalyticsRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class AnalyticsService : KoinComponent {
    private val postService = PostService()
    private val repository: AnalyticsRepository by inject()

    fun trackQueryView(post: PostItem) {
        postService.addQueryView(post)
    }

    fun trackFullPageView(post: PostItem) {
        postService.addFullPageView(post)
    }

    fun trackQuery(queryParams: Map<String, Any>) {
        repository.trackQuery(queryParams)
    }

    fun trackLogin() {
        repository.trackLogin()
    }
}

