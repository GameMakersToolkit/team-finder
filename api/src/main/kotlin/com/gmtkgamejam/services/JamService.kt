package com.gmtkgamejam.services

import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.models.jams.JamStatus
import com.gmtkgamejam.repositories.JamRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface JamService {
    fun getJams(tokenSet: AuthTokenSet?): Collection<Jam>
    fun updateJam(jam: Jam): Jam
    fun getJam(jamId: String): Jam?
    fun getJam(jamId: String, tokenSet: AuthTokenSet?): Jam?
}

@Single(createdAtStart = true)
class JamServiceImpl(private val repository: JamRepository) : JamService, KoinComponent {
    override fun getJams(tokenSet: AuthTokenSet?): Collection<Jam> {
        return repository.getJams()
            .filter { jam ->
                jam.status == JamStatus.VISIBLE ||
                (jam.adminIds.contains(tokenSet?.discordId) && jam.jamId == tokenSet?.jamId)
            }
    }
    override fun updateJam(jam: Jam): Jam = repository.updateJam(jam)

    override fun getJam(jamId: String, tokenSet: AuthTokenSet?): Jam? {
        val jam = repository.getJam(jamId)
        return when {
            jam?.status == JamStatus.VISIBLE -> jam
            jam?.adminIds?.contains(tokenSet?.discordId) == true -> jam
            else -> null
        }
    }
    override fun getJam(jamId: String) = repository.getJam(jamId)
}
