package com.gmtkgamejam.repositories

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.db.DatabaseManager
import com.gmtkgamejam.db.BannedUsers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface AdminRepository {
    fun banUser(bannedUser: BannedUser)
    fun unbanUser(bannedUser: BannedUser)
}

@Single(createdAtStart = true)
class AdminRepositoryImpl(private val dbManager: DatabaseManager) : AdminRepository, KoinComponent {

    override fun banUser(bannedUser: BannedUser) {
        bannedUser.bannedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))

        transaction(dbManager.database) {
            BannedUsers.insert {
                it[BannedUsers.discordId] = bannedUser.discordId
                it[BannedUsers.banningAdminId] = bannedUser.banningAdminId
                it[BannedUsers.bannedAt] = bannedUser.bannedAt
            }
        }
    }

    override fun unbanUser(bannedUser: BannedUser) {
        transaction(dbManager.database) {
            BannedUsers.deleteWhere { BannedUsers.discordId eq bannedUser.discordId }
        }
    }

}
