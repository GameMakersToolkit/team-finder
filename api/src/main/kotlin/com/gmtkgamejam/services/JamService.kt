package com.gmtkgamejam.services

import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.repositories.JamRepository

interface JamService {
    fun getJams(): Collection<Jam>
}

class JamServiceImpl(private val repository: JamRepository) : JamService {
    override fun getJams() = repository.getJams()
}