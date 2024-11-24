package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.jams.Jam
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.litote.kmongo.getCollectionOfName

interface JamRepository {
    fun getJams(): Collection<Jam>
}

open class JamRepositoryImpl(val client: MongoClient): JamRepository {
    private val col: MongoCollection<Jam> = client
        .getDatabase("team-finder")
        .getCollectionOfName("jams")

    override fun getJams(): Collection<Jam> {
        // Can't remember what find all is
        return col.find().toList()
    }
}