package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.dtos.PostItemCreateDto
import com.gmtkgamejam.models.posts.dtos.PostItemUpdateDto
import com.gmtkgamejam.repositories.PostRepository
import org.bson.conversions.Bson
import org.koin.core.annotation.Single
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.min

interface PostService {
    fun createPost(postItem: PostItem)
    fun getPosts(filter: Bson, sort: Bson, page: Int): List<PostItem>
    fun getPost(id: String) : PostItem?
    fun getPostByAuthorId(authorId: String, jamId: String, ignoreDeletion: Boolean = false) : PostItem?
    fun getPostCount(filter: Bson): Int
    fun updatePost(postItem: PostItem)
    fun deletePost(postItem: PostItem)
    fun addQueryView(postItem: PostItem)
    fun addFullPageView(postItem: PostItem)
    fun createPostFromDto(dto: PostItemCreateDto, authorId: String): PostItem
    fun applyUpdate(post: PostItem, dto: PostItemUpdateDto): PostItem
}

@Single(createdAtStart = true)
class PostServiceImpl(private val repository: PostRepository) : PostService {

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

    override fun getPostByAuthorId(authorId: String, jamId: String, ignoreDeletion: Boolean) : PostItem? {
        return repository.getPostByAuthorId(authorId, jamId, ignoreDeletion)
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

    override fun createPostFromDto(dto: PostItemCreateDto, authorId: String): PostItem {
        dto.authorId = authorId
        dto.timezoneOffsets = dto.timezoneOffsets.filter { tz -> tz >= -12 && tz <= 12 }.toSet()
        dto.size = min(dto.size, 100)
        return PostItem.fromCreateDto(dto)
    }

    override fun applyUpdate(post: PostItem, dto: PostItemUpdateDto): PostItem {
        dto.author?.also { post.author = it }
        dto.portfolioLinks?.also { post.portfolioLinks = it }
        dto.description?.also { post.description = it }
        dto.size?.also { post.size = min(it, 100) }
        dto.skillsPossessed?.also { post.skillsPossessed = it }
        dto.skillsSought?.also { post.skillsSought = it }
        dto.preferredTools?.also { post.preferredTools = it }
        dto.languages?.also { post.languages = it }
        dto.availability?.also { post.availability = it }
        dto.timezoneOffsets?.also { post.timezoneOffsets = it.filter { tz -> tz >= -12 && tz <= 12 }.toSet() }

        post.updatedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        return post
    }
}
