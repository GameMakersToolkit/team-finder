package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.models.posts.PostItem
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.bson.conversions.Bson
import org.litote.kmongo.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface PostRepository {
    fun createPost(postItem: PostItem)

    fun getPosts(
        filter: Bson,
        sort: Bson,
    ): List<PostItem>

    fun getPost(id: String): PostItem?

    fun getPostByAuthorId(
        authorId: String,
        ignoreDeletion: Boolean = false,
    ): PostItem?

    fun updatePost(postItem: PostItem)

    fun deletePost(postItem: PostItem)

    fun addQueryView(postItem: PostItem)

    fun addFullPageView(postItem: PostItem)
}

open class PostRepositoryImpl(
    val client: MongoClient,
) : PostRepository {
    private val col: MongoCollection<PostItem> =
        client
            .getDatabase("team-finder")
            .getCollectionOfName("posts")

    private val bannedUsersCol: MongoCollection<PostItem> =
        client
            .getDatabase("team-finder")
            .getCollectionOfName("banned-users")

    override fun createPost(postItem: PostItem) {
        if (bannedUsersCol.findOne(BannedUser::discordId eq postItem.authorId) != null) {
            throw Exception("User is banned, cannot perform action!")
        }

        col.insertOne(postItem)
    }

    // Un-paginated version should be used for Admin endpoints
    override fun getPosts(
        filter: Bson,
        sort: Bson,
    ): List<PostItem> = col.find(filter).sort(sort).toList()

    override fun getPost(id: String): PostItem? = col.findOne(PostItem::id eq id)

    override fun getPostByAuthorId(
        authorId: String,
        ignoreDeletion: Boolean,
    ): PostItem? {
        var filter = PostItem::authorId eq authorId
        if (!ignoreDeletion) {
            filter = and(filter, PostItem::deletedAt eq null)
        }

        return col.findOne(filter)
    }

    override fun updatePost(postItem: PostItem) {
        if (bannedUsersCol.findOne(BannedUser::discordId eq postItem.authorId) != null) {
            throw Exception("User is banned, cannot perform action!")
        }

        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    override fun deletePost(postItem: PostItem) {
        postItem.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    override fun addQueryView(postItem: PostItem) {
        postItem.queryCount += 1
        col.updateOne(PostItem::id eq postItem.id, postItem)
    }

    override fun addFullPageView(postItem: PostItem) {
        postItem.fullPageViewCount += 1
        col.updateOne(PostItem::id eq postItem.id, postItem)
    }
}
