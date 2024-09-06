package com.gmtkvotingsystem.services

import com.gmtkvotingsystem.models.*
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.UpdateOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne
import kotlin.random.Random

class ThemeService : KoinComponent {
    private val client: MongoClient by inject()

    private val col: MongoCollection<Theme>
    private val votesCol: MongoCollection<Vote>

    init {
        val database = client.getDatabase("gmtk-voting-system")
        col = database.getCollectionOfName("themes")
        votesCol = database.getCollectionOfName("votes")
    }

    fun getForUser(discordId: String): ThemeDTO {
        val themes = col.find(Theme::discordId eq discordId).toList()
        val themeTextList = themes.map { it.text }
        return ThemeDTO(themeTextList)
    }

    fun setForUser(
        discordId: String,
        themes: List<String>,
    ) {
        col.deleteMany(Theme::discordId eq discordId)
        themes.map { col.updateOne(Theme(discordId, it), UpdateOptions().upsert(true)) }
    }

    fun getAsVotesForUser(discordId: String): List<ThemeVotedOnDTO> {
        val rng = Random(discordId.toLong())
        val currentVotes = votesCol.find(Vote::discordId eq discordId).toList().associate { it.themeId to it.score }
        val themes =
            col
                .find()
                .toList()
                .shuffled(rng)
                .subList(0, 3) // todo
                .map { theme -> ThemeVotedOnDTO(theme._id, discordId, theme.text, currentVotes[theme._id] ?: 0) }

        return themes
    }

    fun setAsVotesForUser(
        discordId: String,
        dto: VotesDTO,
    ) {
        votesCol.deleteMany(Vote::discordId eq discordId)
        dto.votes.map { votesCol.updateOne(Vote(it.id, discordId, it.score), UpdateOptions().upsert(true)) }
    }
}
