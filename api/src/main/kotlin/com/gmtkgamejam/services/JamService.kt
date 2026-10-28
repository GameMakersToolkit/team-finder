package com.gmtkgamejam.services

import com.gmtkgamejam.models.auth.AuthTokenSet
import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.models.jams.JamStatus
import com.gmtkgamejam.repositories.JamRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface JamService {
    fun getJams(tokenSet: AuthTokenSet?): Collection<Jam>
    fun updateJam(jam: Jam): Jam
    fun getJam(jamId: String): Jam?
    fun getJam(jamId: String, tokenSet: AuthTokenSet?): Jam?
    fun softDeleteJam(jamId: String): Jam?
}

@Single(createdAtStart = true)
class JamServiceImpl(private val repository: JamRepository) : JamService, KoinComponent {
    override fun getJams(tokenSet: AuthTokenSet?): Collection<Jam> {
        return repository.getJams()
            .filter { jam ->
                (jam.deletedAt == null) &&
                (jam.status == JamStatus.VISIBLE ||
                (jam.adminIds.contains(tokenSet?.discordId) && jam.jamId == tokenSet?.jamId))
            }
    }
    override fun updateJam(jam: Jam): Jam = repository.updateJam(jam)

    override fun getJam(jamId: String, tokenSet: AuthTokenSet?): Jam? {
        val jam = repository.getJam(jamId)
        return when {
            jam == null -> null
            jam.deletedAt != null -> null
            jam.status == JamStatus.VISIBLE -> jam
            jam.adminIds.contains(tokenSet?.discordId) && jam.jamId == tokenSet?.jamId -> jam
            else -> null
        }
    }
    override fun getJam(jamId: String) = repository.getJam(jamId)

    override fun softDeleteJam(jamId: String): Jam? {
        val jam = repository.getJam(jamId) ?: return null
        jam.deletedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        return repository.updateJam(jam)
    }
}
