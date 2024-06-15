package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.PostRepository
import org.bson.conversions.Bson
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class PostService : KoinComponent {
    private val repository: PostRepository by inject()

    fun createPost(postItem: PostItem) {
        repository.createPost(postItem)
    }

    fun getPosts(
        filter: Bson,
        sort: Bson,
    ): List<PostItem> = repository.getPosts(filter, sort)

    fun getPost(id: String): PostItem? = repository.getPost(id)

    fun getPostByAuthorId(
        authorId: String,
        ignoreDeletion: Boolean = false,
    ): PostItem? = repository.getPostByAuthorId(authorId, ignoreDeletion)

    fun updatePost(postItem: PostItem) {
        repository.updatePost(postItem)
    }

    fun deletePost(postItem: PostItem) {
        repository.deletePost(postItem)
    }

    fun addQueryView(postItem: PostItem) {
        repository.addQueryView(postItem)
    }

    fun addFullPageView(postItem: PostItem) {
        repository.addFullPageView(postItem)
    }
}
