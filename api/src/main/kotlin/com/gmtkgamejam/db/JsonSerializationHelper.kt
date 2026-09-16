package com.gmtkgamejam.db

import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import com.gmtkgamejam.models.posts.Skills
import com.gmtkgamejam.models.posts.Tools

/**
 * Helper functions for JSON serialization/deserialization of collections
 */
object JsonSerializationHelper {
    private val json = Json { ignoreUnknownKeys = true }

    fun <T> encodeToJson(value: T): String {
        return when (value) {
            is List<*> -> json.encodeToString(value)
            is Map<*, *> -> json.encodeToString(value)
            else -> json.encodeToString(value)
        }.toString()
    }

    fun <T> decodeFromJsonString(jsonString: String?): String? {
        return if (jsonString.isNullOrBlank()) null else jsonString
    }

    fun encodeStringSet(set: Set<String>): String = json.encodeToString(set.toList())

    fun decodeStringSet(jsonString: String?): Set<String> {
        return try {
            if (jsonString.isNullOrBlank()) emptySet()
            else json.decodeFromString<List<String>>(jsonString).toSet()
        } catch (e: Exception) {
            emptySet()
        }
    }

    fun encodeIntSet(set: Set<Int>): String = json.encodeToString(set.toList())

    fun decodeIntSet(jsonString: String?): Set<Int> {
        return try {
            if (jsonString.isNullOrBlank()) emptySet()
            else json.decodeFromString<List<Int>>(jsonString).toSet()
        } catch (e: Exception) {
            emptySet()
        }
    }

    fun encodeSkillsSet(set: Set<Skills>?): String? {
        return if (set == null) null else json.encodeToString(set.map { it.name }.toList())
    }

    fun decodeSkillsSet(jsonString: String?): Set<Skills>? {
        return try {
            if (jsonString.isNullOrBlank()) null
            else json.decodeFromString<List<String>>(jsonString).mapNotNull { skillName ->
                try { Skills.valueOf(skillName) } catch (e: Exception) { null }
            }.toSet()
        } catch (e: Exception) {
            null
        }
    }

    fun encodeToolsSet(set: Set<Tools>?): String? {
        return if (set == null) null else json.encodeToString(set.map { it.name }.toList())
    }

    fun decodeToolsSet(jsonString: String?): Set<Tools>? {
        return try {
            if (jsonString.isNullOrBlank()) null
            else json.decodeFromString<List<String>>(jsonString).mapNotNull { toolName ->
                try { Tools.valueOf(toolName) } catch (e: Exception) { null }
            }.toSet()
        } catch (e: Exception) {
            null
        }
    }

    fun encodeMap(map: Map<String, String>): String = json.encodeToString(map)

    fun decodeMap(jsonString: String?): Map<String, String> {
        return try {
            if (jsonString.isNullOrBlank()) emptyMap()
            else json.decodeFromString(jsonString)
        } catch (e: Exception) {
            emptyMap()
        }
    }

    fun decodeListString(jsonString: String?): List<String> {
        return try {
            if (jsonString.isNullOrBlank()) emptyList()
            else json.decodeFromString(jsonString)
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun decodeMapStringAdminInfo(jsonString: String?): Map<String, Any> {
        return try {
            if (jsonString.isNullOrBlank()) emptyMap()
            else json.decodeFromString(jsonString)
        } catch (e: Exception) {
            emptyMap()
        }
    }
}
