package com.gmtkgamejam

inline fun <reified A : Enum<A>> enumSetFromInput(commaSeparatedString: String) : Set<A> {
    return commaSeparatedString.split(',').filter(String::isNotBlank).map { enumValueOf<A>(it) }.toSet()
}