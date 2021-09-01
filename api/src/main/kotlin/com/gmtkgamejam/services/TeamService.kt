package com.gmtkgamejam.services

import com.gmtkgamejam.models.Team
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.litote.kmongo.KMongo
import org.litote.kmongo.getCollection

class TeamService {

    private val client: MongoClient = KMongo.createClient("mongodb://root:example@db:27017")

    private val col: MongoCollection<Team>

    init {
        val database = client.getDatabase("teams")
        col = database.getCollection()
    }
    fun doThing(team: Team) {
        col.insertOne(team)
    }

}

