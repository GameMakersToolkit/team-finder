package com.gmtkgamejam

import kotlinx.serialization.json.*
import java.time.LocalDateTime

fun List<*>.toJsonElement(): JsonElement {
    val list: MutableList<JsonElement> = mutableListOf()
    this.forEach { value ->
        when (value) {
            null -> list.add(JsonNull)
            is Map<*, *> -> list.add(value.toJsonElement())
            is List<*> -> list.add(value.toJsonElement())
            is Boolean -> list.add(JsonPrimitive(value))
            is Number -> list.add(JsonPrimitive(value))
            is String -> list.add(JsonPrimitive(value))
            is Enum<*> -> list.add(JsonPrimitive(value.toString()))
            else -> throw IllegalStateException("Can't serialize unknown collection type: $value")
        }
    }
    return JsonArray(list)
}

fun Map<*, *>.toJsonElement(): JsonElement {
    val map: MutableMap<String, JsonElement> = mutableMapOf()
    this.forEach { (key, value) ->
        key as String
        when (value) {
            null -> map[key] = JsonNull
            is Map<*, *> -> map[key] = value.toJsonElement()
            is List<*> -> map[key] = value.toJsonElement()
            is Boolean -> map[key] = JsonPrimitive(value)
            is Number -> map[key] = JsonPrimitive(value)
            is String -> map[key] = JsonPrimitive(value)
            is Enum<*> -> map[key] = JsonPrimitive(value.toString())
            is LocalDateTime -> map[key] = JsonPrimitive(value.toString())
            else -> throw IllegalStateException("Can't serialize unknown type: $value")
        }
    }
    return JsonObject(map)
}
