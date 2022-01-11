package com.gmtkgamejam.models

enum class Skills(val bitwiseId: Int) {
    ART_2D(1),
    ART_3D(2),
    CODE(4),
    DESIGN_PRODUCTION(8),
    SOUND_MUSIC(16),
    TESTING_SUPPORT(32),
    TEAM_LEAD(128),
    OTHER(64);

    companion object {
        fun fromBitwiseId(id: Int): List<Skills> = values().filter { s -> (id and s.bitwiseId == s.bitwiseId) }
        fun fromString(name: String) = values().find { s -> name == s.toString() }
    }
}
