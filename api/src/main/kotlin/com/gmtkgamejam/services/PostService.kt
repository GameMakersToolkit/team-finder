package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.repositories.PostRepository
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.bson.conversions.Bson
import org.litote.kmongo.getCollectionOfName

interface PostService {
    fun createPost(postItem: PostItem)
    fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem>
    fun getPost(id: String) : PostItem?
    fun getPostByAuthorId(authorId: String, ignoreDeletion: Boolean = false) : PostItem?
    fun getPostCount(filter: Bson): Int
    fun updatePost(postItem: PostItem)
    fun deletePost(postItem: PostItem)
    fun addQueryView(postItem: PostItem)
    fun addFullPageView(postItem: PostItem)
}

class PostServiceImpl(private val repository: PostRepository, private val client: MongoClient) : PostService {
    private val col: MongoCollection<PostItem>
    private val bannedUsersCol: MongoCollection<BannedUser>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("posts")
        bannedUsersCol = database.getCollectionOfName("banned-users")
    }

    override fun createPost(postItem: PostItem) {
        repository.createPost(postItem)
    }

    // Un-paginated version should be used for Admin endpoints
    override fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem> {
        return repository.getPosts(filter, sort, page)
    }

    override fun getPost(id: String) : PostItem? {
        return repository.getPost(id)
    }

    override fun getPostByAuthorId(authorId: String, ignoreDeletion: Boolean) : PostItem? {
        return repository.getPostByAuthorId(authorId, ignoreDeletion)
    }

    override fun getPostCount(filter: Bson): Int {
        return repository.getPostCount(filter)
    }

    override fun updatePost(postItem: PostItem) {
        repository.updatePost(postItem)
    }

    override fun deletePost(postItem: PostItem) {
        repository.deletePost(postItem)
    }

    override fun addQueryView(postItem: PostItem) {
        repository.addQueryView(postItem)
    }

    override fun addFullPageView(postItem: PostItem) {
        repository.addFullPageView(postItem)
    }
}

