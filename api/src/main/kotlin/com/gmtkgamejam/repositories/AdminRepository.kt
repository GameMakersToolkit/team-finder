package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.admin.BannedUser
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoCollection
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.litote.kmongo.eq
import org.litote.kmongo.getCollectionOfName
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface AdminRepository {
    fun banUser(bannedUser: BannedUser)
    fun unbanUser(bannedUser: BannedUser)
}

@Single(createdAtStart = true)
class AdminRepositoryImpl(val client: MongoClient) : AdminRepository, KoinComponent {
    private val bannedUserCol: MongoCollection<BannedUser>

    init {
        val database = client.getDatabase("team-finder")
        bannedUserCol = database.getCollectionOfName("banned-users")
    }

    override fun banUser(bannedUser: BannedUser) {
        bannedUser.bannedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        bannedUserCol.insertOne(bannedUser)
    }

    override fun unbanUser(bannedUser: BannedUser) {
        bannedUserCol.deleteMany(BannedUser::discordId eq bannedUser.discordId)
    }

}
