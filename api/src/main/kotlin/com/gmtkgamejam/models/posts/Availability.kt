package com.gmtkgamejam.models.posts

enum class Availability {

    /**
     * Haven't decided/don't know yet
     */
    UNSURE,

    /**
     * A few hours over the whole jam
     */
    MINIMAL,

    /**
     * Less than 4 hours per day
     */
    PART_TIME,

    /**
     * 4-8 hours per day
     */
    FULL_TIME,

    /**
     * As much time as I can
     */
    OVERTIME,
}