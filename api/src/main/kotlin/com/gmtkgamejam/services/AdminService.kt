package com.gmtkgamejam.services

import com.gmtkgamejam.models.BannedUser
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.litote.kmongo.eq
import org.litote.kmongo.getCollectionOfName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class AdminService : KoinComponent {

    private val client: MongoClient by inject()

    private val bannedUserCol: MongoCollection<BannedUser>

    init {
        val database = client.getDatabase("team-finder")
        bannedUserCol = database.getCollectionOfName("banned-users")
    }

    fun banUser(bannedUser: BannedUser) {
        bannedUser.bannedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        bannedUserCol.insertOne(bannedUser)
    }

    fun unbanUser(bannedUser: BannedUser) {
        bannedUserCol.deleteMany(BannedUser::discordId eq bannedUser.discordId)
    }

}

