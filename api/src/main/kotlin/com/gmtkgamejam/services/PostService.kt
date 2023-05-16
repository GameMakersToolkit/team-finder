package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.models.posts.PostItem
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.bson.conversions.Bson
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

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

    fun getPost(id: String) : PostItem? {
        return col.findOne(PostItem::id eq id)
    }

    fun getPostByAuthorId(authorId: String, ignoreDeletion: Boolean = false) : PostItem? {
        var filter = PostItem::authorId eq authorId
        if (!ignoreDeletion) {
            filter = and(filter, PostItem::deletedAt eq null)
        }

        return col.findOne(filter)
    }

    fun updatePost(postItem: PostItem) {
        if (bannedUsersCol.findOne(BannedUser::discordId eq postItem.authorId) != null) {
            throw Exception("User is banned, cannot perform action!")
        }

        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    fun deletePost(postItem: PostItem) {
        postItem.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

}

