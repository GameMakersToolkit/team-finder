package com.gmtkgamejam.services

import com.gmtkgamejam.models.PostItem
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.bson.conversions.Bson
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

class PostService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<PostItem>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("posts")
    }
    fun createPost(postItem: PostItem) {
        col.insertOne(postItem)
    }

    // Un-paginated version should be used for Admin endpoints
    fun getPosts(filter: Bson, sort: Bson): List<PostItem> {
        return col.find(filter).sort(sort).toList()
    }

    fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem> {
        // TODO: Set to high value (config?) when running with more Posts in DB
        val pageSize = 20
        return col.find(filter).sort(sort).skip((page - 1) * pageSize).limit(pageSize).toList()
    }

    fun getPost(id: Long) : PostItem? {
        return col.findOne(PostItem::id eq id)
    }

    fun updatePost(postItem: PostItem) {
        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    fun deletePost(postItem: PostItem) {
        col.deleteOne(PostItem::id eq postItem.id)
    }

}

