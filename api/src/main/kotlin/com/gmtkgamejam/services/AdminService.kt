package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.repositories.AdminRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class AdminService : KoinComponent {
    private val repository: AdminRepository by inject()

    fun banUser(bannedUser: BannedUser) {
        repository.banUser(bannedUser)
    }

    fun unbanUser(bannedUser: BannedUser) {
        repository.unbanUser(bannedUser)
    }
}
