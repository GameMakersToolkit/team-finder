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

    fun getPosts(filter: Bson): List<PostItem> {
        return col.find(filter).toList()
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

