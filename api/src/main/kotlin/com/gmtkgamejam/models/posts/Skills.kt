package com.gmtkgamejam.models.posts

enum class Skills(private var readableName: String) {
    ART_2D("2D Art"),
    ART_3D("3D Art"),
    CODE("Code"),
    DESIGN_PRODUCTION("Design/Production"),
    SFX("SFX"),
    MUSIC("Music"),
    TESTING_SUPPORT("Testing/Support"),
    TEAM_LEAD("Team lead"),
    VOICE_ACTING("Voice acting"),
    VIBES("Vibes"),
    OTHER("Other");

    override fun toString(): String {
        return readableName;
    }
}
