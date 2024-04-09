package com.gmtkgamejam.services

import com.gmtkgamejam.bot.DiscordBot
import com.gmtkgamejam.models.bot.BotRecord
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.getCollectionOfName

class BotService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<BotRecord>

    private val loadedBots: Map<String, DiscordBot>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("bots")
        loadedBots = col.find().toList().associate { botRecord -> botRecord.jamId to DiscordBot(botRecord.guildId, botRecord.botToken) }
    }

    fun getBots(): Map<String, DiscordBot> = loadedBots

}

