package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.jams.Jam
import com.gmtkgamejam.models.admin.AdminInfo
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.Jams
import com.gmtkgamejam.db.JsonSerializationHelper
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import kotlinx.serialization.json.Json

interface JamRepository {
    fun getJams(): Collection<Jam>
    fun updateJam(jam: Jam): Jam
    fun getJam(jamId: String): Jam?
}

@Single(createdAtStart = true)
open class JamRepositoryImpl(private val dbManager: DatabaseManager): JamRepository, KoinComponent {
    private val json = Json { ignoreUnknownKeys = true }

    override fun getJams(): Collection<Jam> {
        return transaction(dbManager.database) {
            Jams.selectAll().map { rowToJam(it) }
        }
    }

    override fun updateJam(jam: Jam): Jam {
        transaction(dbManager.database) {
            Jams.update({ Jams.jamId eq jam.jamId }) {
                it[Jams.name] = jam.name
                it[Jams.status] = jam.status.toString()
                it[Jams.start] = jam.start
                it[Jams.end] = jam.end
                it[Jams.styles] = JsonSerializationHelper.encodeMap(jam.styles)
                it[Jams.adminIds] = JsonSerializationHelper.encodeToJson(jam.adminIds)
                it[Jams.guildId] = jam.guildId
                it[Jams.channelId] = jam.channelId
                it[Jams.guildInviteLink] = jam.guildInviteLink
                it[Jams.discordEnabled] = jam.discordEnabled
                if (::adminInfo.isInitialized()) {
                    it[Jams.adminInfo] = JsonSerializationHelper.encodeToJson(jam.adminInfo)
                }
                if (::bgImageUrl.isInitialized()) {
                    it[Jams.bgImageUrl] = jam.bgImageUrl
                }
                if (::logoLargeUrl.isInitialized()) {
                    it[Jams.logoLargeUrl] = jam.logoLargeUrl
                }
                if (::logoStackedUrl.isInitialized()) {
                    it[Jams.logoStackedUrl] = jam.logoStackedUrl
                }
                if (::faviconUrl.isInitialized()) {
                    it[Jams.faviconUrl] = jam.faviconUrl
                }
            }
        }
        return jam
    }

    override fun getJam(jamId: String): Jam? {
        return transaction(dbManager.database) {
            Jams.selectAll()
                .where { Jams.jamId eq jamId }
                .singleOrNull()
                ?.let { rowToJam(it) }
        }
    }

    private fun rowToJam(row: ResultRow): Jam {
        return Jam(
            jamId = row[Jams.jamId],
            name = row[Jams.name],
            status = com.gmtkgamejam.models.jams.JamStatus.valueOf(row[Jams.status]),
            start = row[Jams.start],
            end = row[Jams.end],
            styles = JsonSerializationHelper.decodeMap(row[Jams.styles]),
            adminIds = JsonSerializationHelper.decodeListString(row[Jams.adminIds]),
            guildId = row[Jams.guildId],
            channelId = row[Jams.channelId],
            guildInviteLink = row[Jams.guildInviteLink],
            discordEnabled = row[Jams.discordEnabled]
        ).apply {
            val adminInfoJson = row[Jams.adminInfo]
            if (!adminInfoJson.isNullOrBlank()) {
                try {
                    adminInfo = json.decodeFromString(adminInfoJson)
                } catch (e: Exception) {
                    // ignore
                }
            }

            val bgImageUrl = row[Jams.bgImageUrl]
            if (!bgImageUrl.isNullOrBlank()) {
                this.bgImageUrl = bgImageUrl
            }

            val logoLargeUrl = row[Jams.logoLargeUrl]
            if (!logoLargeUrl.isNullOrBlank()) {
                this.logoLargeUrl = logoLargeUrl
            }

            val logoStackedUrl = row[Jams.logoStackedUrl]
            if (!logoStackedUrl.isNullOrBlank()) {
                this.logoStackedUrl = logoStackedUrl
            }

            val faviconUrl = row[Jams.faviconUrl]
            if (!faviconUrl.isNullOrBlank()) {
                this.faviconUrl = faviconUrl
            }
        }
    }
}
