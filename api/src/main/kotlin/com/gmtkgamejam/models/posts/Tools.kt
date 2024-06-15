package com.gmtkgamejam.models.posts

// For the time being, Tool == Engine
enum class Tools(
    private var readableName: String,
) {
    UNITY("Unity"),
    CONSTRUCT("Construct"),
    GAME_MAKER_STUDIO("Game Maker Studio"),
    GODOT("Godot"),
    TWINE("Twine"),
    BITSY("Bitsy"),
    UNREAL("Unreal"),
    RPG_MAKER("RPG Maker"),
    PICO_8("PICO 8"),
    OTHER("Other"),
    ;

    override fun toString(): String = readableName
}
