package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.repositories.AdminRepository
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent

interface AdminService {
    fun banUser(bannedUser: BannedUser)
    fun unbanUser(bannedUser: BannedUser)
}

@Single(createdAtStart = true)
class AdminServiceImpl(private val repository: AdminRepository) : AdminService, KoinComponent {
    override fun banUser(bannedUser: BannedUser) {
        repository.banUser(bannedUser)
    }

    override fun unbanUser(bannedUser: BannedUser) {
        repository.unbanUser(bannedUser)
    }
}
