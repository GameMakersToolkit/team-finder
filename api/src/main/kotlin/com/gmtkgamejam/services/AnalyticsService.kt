package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.AnalyticsRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface AnalyticsService {
    fun trackQueryView(post: PostItem)
    fun trackFullPageView(post: PostItem)
    fun trackQuery(queryParams: Map<String, Any>)
    fun trackLogin()
}

@Single(createdAtStart = true)
class AnalyticsServiceImpl(private val repository: AnalyticsRepository, private val postService: PostService) : AnalyticsService,
    KoinComponent {
    override fun trackQueryView(post: PostItem) {
        postService.addQueryView(post)
    }

    override fun trackFullPageView(post: PostItem) {
        postService.addFullPageView(post)
    }

    override fun trackQuery(queryParams: Map<String, Any>) {
        repository.trackQuery(queryParams)
    }

    override fun trackLogin() {
        repository.trackLogin()
    }
}
