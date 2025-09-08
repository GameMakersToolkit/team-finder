package com.gmtkgamejam.services

import com.fasterxml.jackson.databind.node.ObjectNode
import com.gmtkgamejam.models.posts.SearchItem
import com.gmtkgamejam.repositories.PostRepository.Companion.PAGE_SIZE
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.SortOptions
import org.opensearch.client.opensearch._types.query_dsl.Query
import org.opensearch.client.opensearch.core.*

/**
 * Singleton access point to the Opensearch cluster
 */
@Single(createdAtStart = true)
class SearchService : KoinComponent {

    private val client: OpenSearchClient by inject()

    /**
     * Perform a search request against OpenSearch and return the document IDs in the result
     */
    fun search(query: Query, sortOptions: List<SortOptions>, pageNumber: Int): List<String> {
        val searchRequest = SearchRequest.Builder()
            .index("posts")
            .query(query)
            .from((pageNumber - 1) * PAGE_SIZE)
            .size(PAGE_SIZE)
            .sort(sortOptions)
            .build()

        return client.search(searchRequest, ObjectNode::class.java).hits().hits()
            .mapNotNull { it.source()?.get("id")?.asText() }
            .toList()
    }

    /**
     * Get total documents for a given query (without doing any scoring/sorting, I hope)
     */
    fun count(query: Query): Int {
        val countRequest = CountRequest.Builder()
            .index("posts")
            .query(query)
            .build()

        return client.count(countRequest).count().toInt()
    }

    /**
     * Add a new item into the index
     *
     * TODO: Handle response!
     */
    fun index(item: SearchItem) {
        val indexRequest = IndexRequest.Builder<SearchItem>()
            .index("posts")
            .document(item)
            .build()

        client.index(indexRequest)
    }

    /**
     * Update a document on the index
     */
    fun update(item: SearchItem) {
        val upsertRequest: UpdateRequest<SearchItem, SearchItem> = UpdateRequest.Builder<SearchItem, SearchItem>()
            .index("posts")
            .id(item.id)
            .doc(item)
            .docAsUpsert(true)
            .build()

        client.update(upsertRequest, SearchItem::class.java)
    }

    /**
     * Delete a document from the index
     *
     * Unlike the DB we want hard deletions for unwanted posts, so remove them entirely from the system
     */
    fun delete(id: String) {
        val deleteRequest = DeleteRequest.Builder()
            .index("posts")
            .id(id)
            .build()

        client.delete(deleteRequest)
    }
}
