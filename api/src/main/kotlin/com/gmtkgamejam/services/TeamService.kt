package com.gmtkgamejam.services

import com.gmtkgamejam.models.Team
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

class TeamService : KoinComponent {

    private val client: MongoClient by inject()

    private val col: MongoCollection<Team>

    init {
        val database = client.getDatabase("team-finder")
        col = database.getCollectionOfName("teams")
    }
    fun createTeam(team: Team) {
        col.insertOne(team)
    }

    fun getTeams(): List<Team> {
        return col.find().toList()
    }

    fun getTeam(id: Long) : Team? {
        return col.findOne(Team::id eq id)
    }

    fun updateTeam(team: Team) {
        col.updateOne(Team::id eq team.id, team)
    }

    fun deleteTeam(team: Team) {
        col.deleteOne(Team::id eq team.id)
    }

}

