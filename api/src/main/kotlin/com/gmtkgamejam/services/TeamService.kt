package com.gmtkgamejam.services

import com.gmtkgamejam.models.Team
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.getCollection

class TeamService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<Team>

    init {
        val database = client.getDatabase("teams")
        col = database.getCollection()
    }
    fun doThing(team: Team) {
        col.insertOne(team)
    }

}

