package com.gmtkgamejam.services

import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.repositories.JamRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class JamService: KoinComponent {

    private val repository: JamRepository by inject()

    fun getJams(): Collection<Jam> {
        return repository.getJams()
    }

}