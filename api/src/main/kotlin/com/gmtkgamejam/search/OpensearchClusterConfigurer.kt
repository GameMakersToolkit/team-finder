package com.gmtkgamejam.search

import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.SearchItem
import com.gmtkgamejam.services.SearchService
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.mapping.SearchAsYouTypeProperty
import org.opensearch.client.opensearch.indices.CreateIndexRequest
import org.opensearch.client.opensearch.indices.DeleteIndexRequest

/**
 * Internally-used singleton for configuring the Opensearch cluster
 *
 * Expect only to use this when configuring a cluster from a fresh install
 */
class OpensearchClusterConfigurer: KoinComponent {

    private val client: OpenSearchClient by inject()

    /**
     * Initialise the cluster
     *
     * This method should cascade to all the other tasks to be done
     */
    fun initCluster(posts: List<PostItem>) {
        initIndices()
        backfillPosts(posts)
    }

    /**
     * Initialise all indices in the cluster
     */
    private fun initIndices() {
        client.indices().delete(DeleteIndexRequest.Builder().index("posts").build())

        val postsIndexMappings = mapOf(
            /**
             * SearchAsYouType is a pre-built field type that specialises in fast real time searching
             * @see https://opensearch.org/docs/latest/field-types/supported-field-types/search-as-you-type/
             */
            "description_shingle" to SearchAsYouTypeProperty.Builder().build()._toProperty()
        )

        val createPostsIndex = CreateIndexRequest.Builder()
            .index("posts")
            .mappings { it.properties(postsIndexMappings) }
            .build()

        client.indices().create(createPostsIndex)
    }

    /**
     * Stick posts into Opensearch
     */
    private fun backfillPosts(posts: List<PostItem>) {
        posts.map { SearchService().index(SearchItem(it)) }
    }

}