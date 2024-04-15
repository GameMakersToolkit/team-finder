package com.gmtkgamejam.search

import com.gmtkgamejam.enumSetFromInput
import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.PostItem
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import io.ktor.http.*
import org.opensearch.client.opensearch._types.FieldValue
import org.opensearch.client.opensearch._types.ScoreSort
import org.opensearch.client.opensearch._types.SortOptions
import org.opensearch.client.opensearch._types.SortOrder
import org.opensearch.client.opensearch._types.query_dsl.*

private fun <E> Set<E>.toFieldValue(): FieldValue = FieldValue.of(this.toString())
private fun String.toFieldValue(): FieldValue = FieldValue.of(this)

/**
 * Parameter block for a search request made by a user
 */
data class SearchParams(
    val sortBy: String,
    val sortDir: String,
    val description: String?,
    val skillsPossessed: Set<Skills>?,
    val skillsSought: Set<Skills>?,
    val tools: Set<Tools>?,
    val languages: Set<String>?,
    val availability: Set<Availability>?,
    val timezones: Set<Int>?,
) {
    constructor(params: Parameters) : this(
        sortBy = params["sortBy"] ?: "score",
        sortDir = params["sortDir"] ?: "desc",
        description = params["description"],
        skillsPossessed = params["skillsPossessed"]?.let { enumSetFromInput<Skills>(it) },
        skillsSought = params["skillsSought"]?.let { enumSetFromInput<Skills>(it) },
        tools = params["tools"]?.let { enumSetFromInput<Tools>(it) },
        languages = params["languages"]?.split(',')?.filter(String::isNotBlank)?.toSet(),
        availability = params["availability"]?.let { enumSetFromInput<Availability>(it) },
        timezones = generateTimezones(params)
    )

    private fun matchQuery(params: MatchQuery.Builder.() -> Unit): Query = Query.Builder().match(
        MatchQuery.Builder().apply(params).build()
    ).build()

    private fun termQuery(params: TermQuery.Builder.() -> Unit): Query = Query.Builder().term(
        TermQuery.Builder().apply(params).build()
    ).build()

    private fun termsQuery(params: TermsQuery.Builder.() -> Unit): Query = Query.Builder().terms(
        TermsQuery.Builder().apply(params).build()
    ).build()

    /**
     * Convert the included search parameters into an Opensearch query object
     */
    fun query(): Query {
        val builder = BoolQuery.Builder()

        /** STEP 1: FILTER ON REQUIRED FIELDS TO ENSURE ALL RESULTS CONTAIN ALL ELEMENTS */
        skillsPossessed?.let { builder.filter(matchQuery { field(PostItem::skillsPossessed.name); query(skillsPossessed.toFieldValue()) }) }
        skillsSought?.let { builder.filter(matchQuery { field(PostItem::skillsSought.name); query(skillsSought.toFieldValue()) }) }
        languages?.let { builder.filter(matchQuery { field(PostItem::languages.name); query(languages.toFieldValue()) }) }
        tools?.let { builder.filter(matchQuery { field(PostItem::preferredTools.name); query(tools.toFieldValue()) }) }

        /** STEP 2: SCORE BASED ON VARIABLE FIELDS */
        // TODO: Add flex without making fields irrelevant
        description?.isNotBlank()?.let {
            builder.must(matchQuery {
                field("description_shingle")
                query(description.toFieldValue())
                fuzziness("2.0")
            })
        }

        timezones?.let {
            builder.must(termsQuery {
                field(PostItem::timezoneOffsets.name)
                terms { it.value(timezones.map { tz -> FieldValue.of(tz.toString()) }) }
            })
        }

        // All other fields are term queries because we don't want any analysis done - it's all exact matches
        availability?.let {
            builder.should(termQuery {
                field(PostItem::availability.name)
                value(availability.toFieldValue())
            })
        }

        return builder.build().toQuery()
    }

    private fun sortOptions(params: SortOptions.Builder.() -> Unit): SortOptions =
        SortOptions.Builder().apply(params).build()

    fun sort(): List<SortOptions> {
        val sortOrder = if (sortDir == "asc") SortOrder.Asc else SortOrder.Desc
        val primarySort = when(sortBy) {
            "score" -> sortOptions { score { ScoreSort.Builder().order(sortOrder) } }
            "size" -> sortOptions { field { it.field(sortBy); it.order(sortOrder) } }
            else -> sortOptions { field { it.field("$sortBy.keyword"); it.order(sortOrder) } }
        }

        // Secondary sort functions as a deterministic tiebreaker when multiple docs have same score
        val secondarySort = sortOptions { field { it.field("id.keyword"); it.order(sortOrder)} }
        return listOf(primarySort, secondarySort)
    }

    companion object {
        fun generateTimezones(params: Parameters): Set<Int>? {
            if (params["timezoneStart"] == null || params["timezoneEnd"] == null) {
                return null
            }

            val timezoneStart = params["timezoneStart"]!!.toInt()
            val timezoneEnd = params["timezoneEnd"]!!.toInt()
            val timezones: MutableSet<Int> = mutableSetOf()
            if (timezoneStart == timezoneEnd) {
                timezones.add(timezoneStart)
            } else if (timezoneStart < timezoneEnd) {
                // UTC-2 -> UTC+2 should be: [-2, -1, 0, 1, 2]
                timezones.addAll((timezoneStart..timezoneEnd))
            } else {
                // UTC+9 -> UTC-9 should be: [9, 10, 11, 12, -12, -11, -10, -9]
                timezones.addAll((timezoneStart..12))
                timezones.addAll((-12..timezoneEnd))
            }

            return timezones
        }
    }
}
