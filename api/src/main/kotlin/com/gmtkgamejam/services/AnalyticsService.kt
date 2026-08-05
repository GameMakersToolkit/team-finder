package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.AnalyticsRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface AnalyticsService {
    fun trackQueryView(post: PostItem)
    fun trackFullPageView(post: PostItem)
    fun trackQuery(jamId: String, queryParams: Map<String, List<String>>)
    fun trackLogin(jamId: String)
    fun trackHomepageView(jamId: String, viewerKey: String)
    fun trackPostMutation(jamId: String, action: String)
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

    override fun trackQuery(jamId: String, queryParams: Map<String, List<String>>) {
        repository.trackQuery(jamId, queryParams)
    }

    override fun trackLogin(jamId: String) {
        repository.trackLogin(jamId)
    }

    override fun trackHomepageView(jamId: String, viewerKey: String) {
        repository.trackHomepageView(jamId, viewerKey)
    }

    override fun trackPostMutation(jamId: String, action: String) {
        repository.trackPostMutation(jamId, action)
    }
}
