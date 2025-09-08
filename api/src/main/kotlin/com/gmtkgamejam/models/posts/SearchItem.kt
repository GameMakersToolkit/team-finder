package com.gmtkgamejam.models.posts

/**
 * Data model for an entry in the search engine
 *
 * This is a stripped-down PostItem with just the fields we use for searching
 *
 * Any index mappings (i.e. the `description_shingle` defined in OpensearchClusterConfigurer) will be applied and
 * computed by the SE at index-time
 */
data class SearchItem(
    val id: String,
    var description_shingle: String,
    var size: Int,
    var skillsPossessed: Set<Skills>?,
    var skillsSought: Set<Skills>?,
    var preferredTools: Set<Tools>?,
    var availability: Availability,
    var timezoneOffsets: Set<Int>,
    var languages: Set<String>,
) {
    constructor(postItem: PostItem): this(
        id = postItem.id,
        // TODO: what work do we want to do here that the SE won't already do?
        description_shingle = postItem.description.lowercase().replace("\n", " "),
        size = postItem.size,
        skillsPossessed = postItem.skillsPossessed,
        skillsSought = postItem.skillsSought,
        preferredTools = postItem.preferredTools,
        availability = postItem.availability,
        timezoneOffsets = postItem.timezoneOffsets,
        languages = postItem.languages,
    )
}
