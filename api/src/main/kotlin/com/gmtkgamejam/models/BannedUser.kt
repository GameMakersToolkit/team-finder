package com.gmtkgamejam.models

data class BannedUser(
    val discordId: String,
    val banningAdminId: String,
    var bannedAt: String?,
) {
    constructor(dto: BanUnbanUserDto) : this(dto.discordId, dto.adminId, null)
}
