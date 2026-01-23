package com.gmtkgamejam.services

import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.repositories.JamRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface JamService {
    fun getJams(): Collection<Jam>
    fun updateJam(jam: Jam): Jam
    fun getJam(jamId: String): Jam?
}

@Single(createdAtStart = true)
class JamServiceImpl(private val repository: JamRepository) : JamService, KoinComponent {
    override fun getJams() = repository.getJams()
    override fun updateJam(jam: Jam): Jam = repository.updateJam(jam)
    override fun getJam(jamId: String) = repository.getJam(jamId)
}
