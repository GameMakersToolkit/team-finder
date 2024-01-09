package com.gmtkgamejam.models.posts.dtos

import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import kotlinx.serialization.Serializable

/**
 * This model is the payload for an existing PostItem being updated on PUT /posts/mine
 */
@Serializable
data class PostItemUpdateDto (
    var author: String?,
    var description: String?,
    var size: Int?,
    var skillsPossessed: Set<Skills>?,
    var skillsSought: Set<Skills>?,
    var preferredTools: Set<Tools>?,
    var availability: Availability?,
    var timezoneOffsets: Set<Int>?,
    var languages: Set<String>?,
)

//author: "dotwo"
//authorId: "427486675409829898"
//availability: "MINIMAL"
//createdAt: "2024-01-09T20:56:06.000Z"
//deletedAt: null
//description: ""
//id: "3555550028524498482"
//languages: ["en"]
//preferredTools: []
//reportCount: 0
//size: 1
//skillsPossessed: ["ART_2D", "CODE"]
//skillsSought: ["ART_3D"]
//timezoneOffsets: [1]
//unableToContactCount: 0
//updatedAt: "2024-01-09T20:56:06.000Z"