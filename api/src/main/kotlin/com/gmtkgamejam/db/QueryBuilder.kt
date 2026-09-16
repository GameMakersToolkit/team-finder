package com.gmtkgamejam.db

import com.gmtkgamejam.models.posts.Availability
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools
import com.gmtkgamejam.enumFromStringSafe
import io.ktor.http.*
import org.jetbrains.exposed.sql.*

/**
 * Helper class to build Exposed SQL queries from HTTP parameters
 * This replaces the kmongo Bson filter building logic
 */
object QueryBuilder {

    /**
     * Build a WHERE clause from HTTP parameters
     * Returns a lambda that can be used with Exposed's where clause
     */
    fun buildPostFilter(params: Parameters): (SqlExpressionBuilder.() -> Op<Boolean>) {
        return {
            var condition: Op<Boolean> = Posts.deletedAt.isNull()

            // Filter by jam ID
            params["jamId"]?.let {
                condition = condition and (Posts.jamId eq it)
            }

            // Filter by description (case-insensitive substring match)
            params["description"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.map { it.trim() }
                ?.forEach {
                    // PostgreSQL lower() for case-insensitive substring match
                    condition = condition and (Posts.description.lowerCase() like "%${it.lowercase()}%")
                }

            // Filter by skills possessed
            val skillsPossessedSearchMode = params["skillsPossessedSearchMode"] ?: "and"
            params["skillsPossessed"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.mapNotNull { enumFromStringSafe<Skills>(it) }
                ?.let { skills ->
                    if (skills.isNotEmpty()) {
                        val skillFilters = skills.map { skill ->
                            // Check if skill is in the JSON array - using like for JSON substring matching
                            (Posts.skillsPossessed like "%\"${skill.name}\"%") or
                            (Posts.skillsPossessed like "%${skill.name}%")
                        }
                        if (skillsPossessedSearchMode == "and") {
                            skillFilters.forEach { condition = condition and it }
                        } else {
                            condition = condition and skillFilters.reduce { acc, op -> acc or op }
                        }
                    }
                }

            // Filter by skills sought
            val skillsSoughtSearchMode = params["skillsSoughtSearchMode"] ?: "and"
            params["skillsSought"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.mapNotNull { enumFromStringSafe<Skills>(it) }
                ?.let { skills ->
                    if (skills.isNotEmpty()) {
                        val skillFilters = skills.map { skill ->
                            (Posts.skillsSought like "%\"${skill.name}\"%") or
                            (Posts.skillsSought like "%${skill.name}%")
                        }
                        if (skillsSoughtSearchMode == "and") {
                            skillFilters.forEach { condition = condition and it }
                        } else {
                            condition = condition and skillFilters.reduce { acc, op -> acc or op }
                        }
                    }
                }

            // Filter by preferred tools
            params["tools"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.mapNotNull { enumFromStringSafe<Tools>(it) }
                ?.forEach { tool ->
                    condition = condition and (
                        (Posts.preferredTools like "%\"${tool.name}\"%") or
                        (Posts.preferredTools like "%${tool.name}%")
                    )
                }

            // Filter by languages
            params["languages"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.let { languages ->
                    if (languages.isNotEmpty()) {
                        val langFilters = languages.map { lang ->
                            (Posts.languages like "%\"$lang\"%") or
                            (Posts.languages like "%$lang%")
                        }
                        condition = condition and langFilters.reduce { acc, op -> acc or op }
                    }
                }

            // Filter by availability
            params["availability"]?.split(',')
                ?.filter(String::isNotBlank)
                ?.mapNotNull { enumFromStringSafe<Availability>(it) }
                ?.let { availabilities ->
                    if (availabilities.isNotEmpty()) {
                        val availFilters = availabilities.map { avail ->
                            Posts.availability eq avail.name
                        }
                        condition = condition and availFilters.reduce { acc, op -> acc or op }
                    }
                }

            // Filter by timezone range
            if (params["timezoneStart"] != null && params["timezoneEnd"] != null) {
                val timezoneStart = params["timezoneStart"]?.toIntOrNull()
                val timezoneEnd = params["timezoneEnd"]?.toIntOrNull()

                if (timezoneStart != null && timezoneEnd != null) {
                    val timezones: MutableList<Int> = mutableListOf()
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

                    // Check if any of the timezones are in the JSON array
                    if (timezones.isNotEmpty()) {
                        val tzFilters = timezones.map { tz ->
                            Posts.timezoneOffsets like "%$tz%"
                        }
                        condition = condition and tzFilters.reduce { acc, op -> acc or op }
                    }
                }
            }

            condition
        }
    }

    /**
     * Build a sort clause from HTTP parameters
     * Returns a pair of (Column, SortOrder)
     */
    fun buildPostSort(params: Parameters): Pair<Column<*>, SortOrder> {
        val sortByFieldName = params["sortBy"] ?: "createdAt"
        val sortDir = params["sortDir"]?.lowercase()

        val column: Column<*> = when (sortByFieldName) {
            "createdAt" -> Posts.createdAt
            "updatedAt" -> Posts.updatedAt
            "queryCount" -> Posts.queryCount
            "fullPageViewCount" -> Posts.fullPageViewCount
            "reportCount" -> Posts.reportCount
            else -> Posts.createdAt
        }

        val sortOrder = when (sortDir) {
            "asc" -> SortOrder.ASC
            "desc" -> SortOrder.DESC
            else -> SortOrder.DESC
        }

        return column to sortOrder
    }
}
