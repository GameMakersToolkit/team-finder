package com.gmtkgamejam.models.admin

import com.gmtkgamejam.models.admin.dtos.BanUnbanUserDto

data class BannedUser(
    val discordId: String,
    val banningAdminId: String,
    var bannedAt: String?,
) {
    constructor(dto: BanUnbanUserDto) : this(dto.discordId, dto.adminId, null)
}
