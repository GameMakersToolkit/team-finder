package com.gmtkgamejam.services

import com.gmtkgamejam.models.admin.BannedUser
import com.gmtkgamejam.repositories.AdminRepository
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

interface AdminService {
    fun banUser(bannedUser: BannedUser)
    fun unbanUser(bannedUser: BannedUser)
}

class AdminServiceImpl(private val repository: AdminRepository) : AdminService {
    override fun banUser(bannedUser: BannedUser) {
        repository.banUser(bannedUser)
    }

    override fun unbanUser(bannedUser: BannedUser) {
        repository.unbanUser(bannedUser)
    }
}

