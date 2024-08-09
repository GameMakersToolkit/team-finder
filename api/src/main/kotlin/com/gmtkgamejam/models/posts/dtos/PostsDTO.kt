package com.gmtkgamejam.models.posts.dtos

import com.gmtkgamejam.models.posts.PostItem
import kotlinx.serialization.Serializable

@Serializable
data class PostsDTO(
    val posts: List<PostItem>,
    val pagination: Map<String, Int>
)