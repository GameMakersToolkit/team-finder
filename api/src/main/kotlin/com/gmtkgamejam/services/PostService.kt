package com.gmtkgamejam.services

import com.gmtkgamejam.models.BannedUser
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
    private val bannedUsersCol: MongoCollection<BannedUser>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("posts")
        bannedUsersCol = database.getCollectionOfName("banned-users")
    }

    fun createPost(postItem: PostItem) {
        if (bannedUsersCol.findOne(BannedUser::discordId eq postItem.authorId) != null) {
            throw Exception("User is banned, cannot perform action!")
        }

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

    fun getPostByAuthorId(authorId: String) : PostItem? {
        return col.findOne(PostItem::authorId eq authorId)
    }

    fun updatePost(postItem: PostItem) {
        if (bannedUsersCol.findOne(BannedUser::discordId eq postItem.authorId) != null) {
            throw Exception("User is banned, cannot perform action!")
        }

        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    fun deletePost(postItem: PostItem) {
        col.deleteOne(PostItem::id eq postItem.id)
    }

}

