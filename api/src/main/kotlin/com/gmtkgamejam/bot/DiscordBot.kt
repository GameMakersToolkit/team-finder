package com.gmtkgamejam.bot

import com.gmtkgamejam.Config
import com.gmtkgamejam.models.jams.AdminInfo
import com.gmtkgamejam.services.JamService
import com.gmtkgamejam.services.PostService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.future.await
import kotlinx.coroutines.withContext
import org.javacord.api.DiscordApi
import org.javacord.api.DiscordApiBuilder
import org.javacord.api.entity.channel.ServerTextChannel
import org.javacord.api.entity.intent.Intent
import org.javacord.api.entity.message.MessageBuilder
import org.javacord.api.entity.server.Server
import org.javacord.api.entity.user.User
import org.javacord.api.exception.DiscordException
import org.javacord.api.exception.MissingPermissionsException
import org.koin.core.annotation.Single
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.jvm.optionals.getOrElse

typealias JamId = String

@Single(createdAtStart = true)
class DiscordBot(postService: PostService): KoinComponent {

    private val config: Config by inject()
    private val jamService: JamService by inject()

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private lateinit var api: DiscordApi

    private var servers: MutableMap<JamId, Server> = mutableMapOf()

    private var channels: MutableMap<JamId, ServerTextChannel> = mutableMapOf()

    private val messageBuilder = BotMessageBuilder(postService, jamService)

    private val approvedUsers: MutableList<String> = mutableListOf()

    init {
        val token = config.getString("bot.token")
        val builder = DiscordApiBuilder().setToken(token).setIntents(Intent.GUILD_MEMBERS)

        try {
            api = builder.login().join()
            logger.info("Discord bot is online and ready for action!")
        } catch (ex: Exception) {
            logger.warn("Discord bot could not be initialised - continuing...")
            logger.warn(ex.toString())
        }
    }

    fun getOrFindServer(jamId: JamId): Server {
        if (!servers.containsKey(jamId)) {
            // TODO handling
            val jam = jamService.getJam(jamId)!!
            val server = api.getServerById(jam.guildId).get()
            servers[jamId] = server
        }

        return servers[jamId]!!
    }

    fun getOrFindChannel(jamId: JamId): ServerTextChannel {
        if (!channels.containsKey(jamId)) {
            // TODO handling
            val jam = jamService.getJam(jamId)!!
            val channel = api.getServerTextChannelById(jam.channelId).get()
            channels[jamId] = channel
        }

        return channels[jamId]!!
    }

    suspend fun createContactUserPingMessage(jamId: JamId, recipientUserId: String, senderUserId: String) {
        val recipient: User = api.getUserById(recipientUserId).await()
        val sender: User = api.getUserById(senderUserId).await()
        val dmChannel = recipient.privateChannel.getOrElse { recipient.openPrivateChannel().get() }

        val messageSendAttempt = if (messageBuilder.canBuildEmbedFromUser(sender, jamId)) {
            logger.info("[CONTACT] [EMBED] ${sender.name} ($senderUserId) contacted ${recipient.name} ($recipientUserId)")
            dmChannel.sendMessage(messageBuilder.embedMessage(recipient, sender, jamId))
        } else {
            logger.info("[CONTACT] [BASIC] ${sender.name} ($senderUserId) contacted ${recipient.name} ($recipientUserId)")
            dmChannel.sendMessage(messageBuilder.basicMessage(recipient, sender, jamId))
        }

        try {
            withContext(Dispatchers.IO) {
                messageSendAttempt.get()
            }

            createFallbackChannelPingMessage(jamId, recipient, sender)
        } catch (ex: InterruptedException) {
            createFallbackChannelPingMessage(jamId, recipient, sender)
        } catch (ex: java.util.concurrent.ExecutionException) {
            createFallbackChannelPingMessage(jamId, recipient, sender)
        }
    }

    private suspend fun createFallbackChannelPingMessage(jamId: String, recipient: User, sender: User) {
        val messageContents = "Hey ${recipient.mentionTag} (${recipient.name}), ${sender.mentionTag} (${sender.name}) wants to get in contact about your Team Finder post!"
        // TODO: Validate message actually sent, give error otherwise
        val channel = getOrFindChannel(jamId)
        channel.sendMessage(messageContents).await()
    }

    suspend fun doesUserHaveValidPermissions(userId: String): Boolean {
        // If the API hasn't authenticated, we either have technical issues, or the token wasn't set properly
        // (e.g. running locally). If so, just run like normal for now.
        if (!this::api.isInitialized) {
            logger.info("Skipping user permissions check because API isn't active")
            return true
        }

        // Exit early if user has already been approved to avoid swamping Discord
        if (approvedUsers.contains(userId)) {
            return true
        }

        return trySendMessage(userId)
    }

    private suspend fun trySendMessage(userId: String): Boolean {
        var didMessageFailBecausePerms = false
         try {
            val user: User = api.getUserById(userId).await()

            logger.debug("Trying to send user garbage message...")

            val messageResult = MessageBuilder()
                .append("") // Intentionally left blank!
                .send(user)
                .await()

            logger.error("This shouldn't print, but you never know - message: $messageResult")
        } catch (ex: MissingPermissionsException) {
            // A 403 response should only fire when the user has locked down DM permissions
            logger.debug("User doesn't have contact perms set properly!")
            didMessageFailBecausePerms = true
        } catch (ex: DiscordException) {
            // Any other response should indicate the message send attempt succeeded,
            // but failed because the message is garbage
            logger.debug("User has correct contact perms active!")
            approvedUsers.add(userId)
        }

        return !didMessageFailBecausePerms
    }

    fun isUserInGuild(jamId: JamId, userId: String): Boolean {
        val server = getOrFindServer(jamId)
        return server.getMemberById(userId).isPresent
    }

    fun getDisplayNameForUser(jamId: JamId, userId: String): String {
        val baseUserName = api.getUserById(userId).get().name

        return try {
            val server = getOrFindServer(jamId)
            server.getMemberById(userId).get().getNickname(server).get()
        } catch (ex: NoSuchElementException) {
            baseUserName
        }
    }

    suspend fun sendStatusMessageToPingChannel(jamId: JamId) {
        val messageContents = "[STATUS] Discord bot is alive and well!"
        // TODO: Validate message actually sent, give error otherwise
        getOrFindChannel(jamId).sendMessage(messageContents).await()
    }

    fun getAdminInfo(jamId: JamId, ids: List<String>): Map<String, AdminInfo> {
        val info = ids.associateBy(
            {it},
            {AdminInfo(it, getDisplayNameForUser(jamId, it))}
        )
        return info
    }

}
