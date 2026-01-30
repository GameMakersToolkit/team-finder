package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.jams.Jam
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.litote.kmongo.eq
import org.litote.kmongo.findOne
import org.litote.kmongo.getCollectionOfName
import org.litote.kmongo.updateOne

interface JamRepository {
    fun getJams(): Collection<Jam>
    fun updateJam(jam: Jam): Jam
    fun getJam(jamId: String): Jam?
}

@Single(createdAtStart = true)
open class JamRepositoryImpl(val client: MongoClient): JamRepository, KoinComponent {
    private val col: MongoCollection<Jam> = client
        .getDatabase("team-finder")
        .getCollectionOfName("jams")

    override fun getJams(): Collection<Jam> {
        // Can't remember what find all is
        return col.find().toList()
    }

    override fun updateJam(jam: Jam): Jam {
        col.updateOne(Jam::jamId eq jam.jamId, jam)
        return jam
    }

    override fun getJam(jamId: String): Jam? {
        return col.findOne(Jam::jamId eq jamId)
    }
}
