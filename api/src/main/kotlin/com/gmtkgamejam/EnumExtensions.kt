package com.gmtkgamejam

/**
 * Floating function to cast a String to an Enum without throwing an exception
 *
 * Suggest using with mapNotNull{} where possible
 */
inline fun <reified A : Enum<A>> enumFromStringSafe(value: String) : A? {
    return enumValues<A>().find { s -> s.name == value.uppercase() }
}