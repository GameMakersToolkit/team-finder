package com.gmtkgamejam.db

import org.jetbrains.exposed.sql.Table

/**
 * Posts table - stores team/project posts from users
 */
object Posts : Table("posts") {
    val id = varchar("id", 255)
    val jamId = varchar("jam_id", 255)
    val author = varchar("author", 255)
    val authorId = varchar("author_id", 255)
    val portfolioLinks = text("portfolio_links") // JSON array as text
    val description = text("description")
    val size = integer("size")
    val skillsPossessed = text("skills_possessed").nullable() // JSON array as text
    val skillsSought = text("skills_sought").nullable() // JSON array as text
    val preferredTools = text("preferred_tools").nullable() // JSON array as text
    val availability = varchar("availability", 50)
    val timezoneOffsets = text("timezone_offsets") // JSON array as text
    val languages = text("languages") // JSON array as text
    val queryCount = integer("query_count").default(0)
    val fullPageViewCount = integer("full_page_view_count").default(0)
    val reportCount = integer("report_count").default(0)
    val unableToContactCount = integer("unable_to_contact_count").default(0)
    val createdAt = varchar("created_at", 50)
    val updatedAt = varchar("updated_at", 50)
    val deletedAt = varchar("deleted_at", 50).nullable()

    override val primaryKey = PrimaryKey(id)
}

/**
 * Jams table - stores jam/event metadata
 */
object Jams : Table("jams") {
    val jamId = varchar("jam_id", 255)
    val name = varchar("name", 500)
    val status = varchar("status", 50)
    val start = long("start")
    val end = long("end")
    val styles = text("styles") // JSON as text
    val adminIds = text("admin_ids") // JSON array as text
    val guildId = varchar("guild_id", 255)
    val channelId = varchar("channel_id", 255)
    val guildInviteLink = varchar("guild_invite_link", 500).nullable()
    val discordEnabled = bool("discord_enabled").default(true)
    val adminInfo = text("admin_info").nullable() // JSON as text
    val bgImageUrl = varchar("bg_image_url", 1000).nullable()
    val logoLargeUrl = varchar("logo_large_url", 1000).nullable()
    val logoStackedUrl = varchar("logo_stacked_url", 1000).nullable()
    val faviconUrl = varchar("favicon_url", 1000).nullable()

    override val primaryKey = PrimaryKey(jamId)
}

/**
 * Favourites table - stores user favorite posts
 */
object Favourites : Table("favourites") {
    val discordId = varchar("discord_id", 255)
    val postIds = text("post_ids") // JSON array as text

    override val primaryKey = PrimaryKey(discordId)
}

/**
 * BannedUsers table - stores banned user information
 */
object BannedUsers : Table("banned_users") {
    val discordId = varchar("discord_id", 255)
    val banningAdminId = varchar("banning_admin_id", 255)
    val bannedAt = varchar("banned_at", 50).nullable()

    override val primaryKey = PrimaryKey(discordId)
}

/**
 * AuthTokens table - stores Discord OAuth tokens (with TTL via database)
 */
object AuthTokens : Table("auth_tokens") {
    val id = varchar("id", 255)
    val jamId = varchar("jam_id", 255)
    val discordId = varchar("discord_id", 255)
    val accessToken = text("access_token")
    val tokenType = varchar("token_type", 50)
    val expiry = long("expiry")
    val refreshToken = text("refresh_token").nullable()
    val createdAt = long("created_at")

    override val primaryKey = PrimaryKey(id)
}

/**
 * AnalyticsCommonEvents table - tracks common analytics events
 */
object AnalyticsCommonEvents : Table("analytics_common_events") {
    val id = varchar("id", 255)
    val loginCount = integer("login_count").default(0)

    override val primaryKey = PrimaryKey(id)
}

/**
 * AnalyticsViewEvents table - tracks search view queries
 */
object AnalyticsViewEvents : Table("analytics_view_events") {
    val query = text("query")
    val count = integer("count").default(0)

    override val primaryKey = PrimaryKey(query)
}

/**
 * AnalyticsMetricCounters table - detailed analytics metrics
 */
object AnalyticsMetricCounters : Table("analytics_metric_counters") {
    val id = varchar("id", 500)
    val jamId = varchar("jam_id", 255)
    val metric = varchar("metric", 100)
    val label = varchar("label", 500).default("")
    val count = long("count").default(0)

    override val primaryKey = PrimaryKey(id)
}

/**
 * AnalyticsHomepageUniqueViews table - tracks unique homepage viewers
 */
object AnalyticsHomepageUniqueViews : Table("analytics_homepage_unique_views") {
    val id = varchar("id", 500)
    val jamId = varchar("jam_id", 255)
    val viewerKey = varchar("viewer_key", 255)

    override val primaryKey = PrimaryKey(id)
}
