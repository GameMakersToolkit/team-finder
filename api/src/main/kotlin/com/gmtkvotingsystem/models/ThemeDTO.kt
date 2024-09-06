package com.gmtkvotingsystem.models

import kotlinx.serialization.Serializable

@Serializable
data class ThemeDTO(
    val themes: List<String>,
)
