package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.PostRepository
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.bson.conversions.Bson
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.getCollectionOfName

class PostService : KoinComponent {

    private val repository: PostRepository by inject()
    private val client: MongoClient by inject()

    private val col: MongoCollection<PostItem>
    private val bannedUsersCol: MongoCollection<BannedUser>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("posts")
        bannedUsersCol = database.getCollectionOfName("banned-users")
    }

    fun createPost(postItem: PostItem) {
        repository.createPost(postItem)
    }

    // Un-paginated version should be used for Admin endpoints
    fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem> {
        return repository.getPosts(filter, sort, page)
    }

    fun getPost(id: String) : PostItem? {
        return repository.getPost(id)
    }

    fun getPostByAuthorId(authorId: String, ignoreDeletion: Boolean = false) : PostItem? {
        return repository.getPostByAuthorId(authorId, ignoreDeletion)
    }

    fun getPostCount(filter: Bson): Int {
        return repository.getPostCount(filter)
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

