package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.errors.BannedUserException
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.Posts
import com.gmtkgamejam.db.BannedUsers
import com.gmtkgamejam.db.JsonSerializationHelper
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface PostRepository {
    fun createPost(postItem: PostItem)
    fun getPosts(whereClause: (SqlExpressionBuilder.() -> Op<Boolean>)?, sortColumn: Column<*>?, sortDirection: SortOrder, page: Int): List<PostItem>
    fun getPost(id: String) : PostItem?
    fun getPostByAuthorId(authorId: String, jamId: String, ignoreDeletion: Boolean = false) : PostItem?
    fun updatePost(postItem: PostItem)
    fun deletePost(postItem: PostItem)
    fun addQueryView(postItem: PostItem)
    fun addFullPageView(postItem: PostItem)
    fun getPostCount(whereClause: (SqlExpressionBuilder.() -> Op<Boolean>)?): Int

    companion object {
        const val PAGE_SIZE = 36
    }
}

@Single(createdAtStart = true)
open class PostRepositoryImpl(private val dbManager: DatabaseManager) : PostRepository, KoinComponent {
    private val logger = LoggerFactory.getLogger(javaClass)

    override fun createPost(postItem: PostItem) {
        transaction(dbManager.database) {
            // Check if user is banned
            val isBanned = BannedUsers.selectAll()
                .where { BannedUsers.discordId eq postItem.authorId }
                .count() > 0

            if (isBanned) {
                logger.warn("Blocked createPost for banned user {}", postItem.authorId)
                throw BannedUserException(postItem.authorId)
            }

            logger.info("Inserting post {} for user {} in jam {}", postItem.id, postItem.authorId, postItem.jamId)
            Posts.insert {
                it[Posts.id] = postItem.id
                it[Posts.jamId] = postItem.jamId
                it[Posts.author] = postItem.author
                it[Posts.authorId] = postItem.authorId
                it[Posts.portfolioLinks] = JsonSerializationHelper.encodeStringSet(postItem.portfolioLinks)
                it[Posts.description] = postItem.description
                it[Posts.size] = postItem.size
                it[Posts.skillsPossessed] = JsonSerializationHelper.encodeSkillsSet(postItem.skillsPossessed)
                it[Posts.skillsSought] = JsonSerializationHelper.encodeSkillsSet(postItem.skillsSought)
                it[Posts.preferredTools] = JsonSerializationHelper.encodeToolsSet(postItem.preferredTools)
                it[Posts.availability] = postItem.availability.toString()
                it[Posts.timezoneOffsets] = JsonSerializationHelper.encodeIntSet(postItem.timezoneOffsets)
                it[Posts.languages] = JsonSerializationHelper.encodeStringSet(postItem.languages)
                it[Posts.queryCount] = postItem.queryCount
                it[Posts.fullPageViewCount] = postItem.fullPageViewCount
                it[Posts.reportCount] = postItem.reportCount
                it[Posts.unableToContactCount] = postItem.unableToContactCount
                it[Posts.createdAt] = postItem.createdAt
                it[Posts.updatedAt] = postItem.updatedAt
                it[Posts.deletedAt] = postItem.deletedAt
            }
        }
    }

    override fun getPosts(
        whereClause: (SqlExpressionBuilder.() -> Op<Boolean>)?,
        sortColumn: Column<*>?,
        sortDirection: SortOrder,
        page: Int
    ): List<PostItem> {
        return transaction(dbManager.database) {
            val pageSize = PostRepository.PAGE_SIZE
            var query = Posts.selectAll()
                .where { Posts.deletedAt.isNull() }

            if (whereClause != null) {
                query = query.andWhere(whereClause)
            }

            if (sortColumn != null) {
                query = query.orderBy(sortColumn, sortDirection)
            }

            query = query.limit(pageSize, offset = (pageSize * (page - 1)).toLong())

            query.map { rowToPostItem(it) }
        }
    }

    override fun getPost(id: String): PostItem? {
        return transaction(dbManager.database) {
            Posts.selectAll()
                .where { Posts.id eq id }
                .singleOrNull()
                ?.let { rowToPostItem(it) }
        }
    }

    override fun getPostByAuthorId(authorId: String, jamId: String, ignoreDeletion: Boolean): PostItem? {
        return transaction(dbManager.database) {
            var query = Posts.selectAll()
                .where { (Posts.authorId eq authorId) and (Posts.jamId eq jamId) }

            if (!ignoreDeletion) {
                query = query.andWhere { Posts.deletedAt.isNull() }
            }

            query.singleOrNull()
                ?.let { rowToPostItem(it) }
        }
    }

    override fun getPostCount(whereClause: (SqlExpressionBuilder.() -> Op<Boolean>)?): Int {
        return transaction(dbManager.database) {
            var query = Posts.selectAll()
                .where { Posts.deletedAt.isNull() }

            if (whereClause != null) {
                query = query.andWhere(whereClause)
            }

            query.count().toInt()
        }
    }

    override fun updatePost(postItem: PostItem) {
        transaction(dbManager.database) {
            // Check if user is banned
            val isBanned = BannedUsers.selectAll()
                .where { BannedUsers.discordId eq postItem.authorId }
                .count() > 0

            if (isBanned) {
                logger.warn("Blocked updatePost for banned user {}", postItem.authorId)
                throw BannedUserException(postItem.authorId)
            }

            logger.info("Updating post {} for user {}", postItem.id, postItem.authorId)
            Posts.update({ Posts.id eq postItem.id }) {
                it[Posts.author] = postItem.author
                it[Posts.portfolioLinks] = JsonSerializationHelper.encodeStringSet(postItem.portfolioLinks)
                it[Posts.description] = postItem.description
                it[Posts.size] = postItem.size
                it[Posts.skillsPossessed] = JsonSerializationHelper.encodeSkillsSet(postItem.skillsPossessed)
                it[Posts.skillsSought] = JsonSerializationHelper.encodeSkillsSet(postItem.skillsSought)
                it[Posts.preferredTools] = JsonSerializationHelper.encodeToolsSet(postItem.preferredTools)
                it[Posts.availability] = postItem.availability.toString()
                it[Posts.timezoneOffsets] = JsonSerializationHelper.encodeIntSet(postItem.timezoneOffsets)
                it[Posts.languages] = JsonSerializationHelper.encodeStringSet(postItem.languages)
                it[Posts.reportCount] = postItem.reportCount
                it[Posts.unableToContactCount] = postItem.unableToContactCount
                it[Posts.updatedAt] = postItem.updatedAt
            }
        }
    }

    override fun deletePost(postItem: PostItem) {
        postItem.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        logger.info("Soft deleting post {} for user {}", postItem.id, postItem.authorId)

        transaction(dbManager.database) {
            Posts.update({ Posts.id eq postItem.id }) {
                it[Posts.deletedAt] = postItem.deletedAt
            }
        }
    }

    override fun addQueryView(postItem: PostItem) {
        transaction(dbManager.database) {
            Posts.update({ Posts.id eq postItem.id }) {
                it[Posts.queryCount] = Posts.queryCount + 1
            }
        }
    }

    override fun addFullPageView(postItem: PostItem) {
        transaction(dbManager.database) {
            Posts.update({ Posts.id eq postItem.id }) {
                it[Posts.fullPageViewCount] = Posts.fullPageViewCount + 1
            }
        }
    }

    private fun rowToPostItem(row: ResultRow): PostItem {
        return PostItem(
            id = row[Posts.id],
            jamId = row[Posts.jamId],
            author = row[Posts.author],
            authorId = row[Posts.authorId],
            portfolioLinks = JsonSerializationHelper.decodeStringSet(row[Posts.portfolioLinks]),
            description = row[Posts.description],
            size = row[Posts.size],
            skillsPossessed = JsonSerializationHelper.decodeSkillsSet(row[Posts.skillsPossessed]),
            skillsSought = JsonSerializationHelper.decodeSkillsSet(row[Posts.skillsSought]),
            preferredTools = JsonSerializationHelper.decodeToolsSet(row[Posts.preferredTools]),
            availability = com.gmtkgamejam.models.posts.Availability.valueOf(row[Posts.availability]),
            timezoneOffsets = JsonSerializationHelper.decodeIntSet(row[Posts.timezoneOffsets]),
            languages = JsonSerializationHelper.decodeStringSet(row[Posts.languages]),
            queryCount = row[Posts.queryCount],
            fullPageViewCount = row[Posts.fullPageViewCount],
            reportCount = row[Posts.reportCount],
            unableToContactCount = row[Posts.unableToContactCount],
            createdAt = row[Posts.createdAt],
            updatedAt = row[Posts.updatedAt],
            deletedAt = row[Posts.deletedAt]
        )
    }
}
