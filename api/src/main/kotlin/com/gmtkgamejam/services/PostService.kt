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

    fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem> {
        return repository.getPosts(filter, sort, page)
    }

    fun getPost(id: String) : PostItem? {
        return repository.getPost(id)
    }

    fun getPostByAuthorId(authorId: String, ignoreDeletion: Boolean = false) : PostItem? {
        return repository.getPostByAuthorId(authorId, ignoreDeletion)
    }

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

