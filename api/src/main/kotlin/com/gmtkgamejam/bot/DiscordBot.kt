package com.gmtkgamejam.bot

import kotlinx.coroutines.future.await
import org.javacord.api.DiscordApi
import org.javacord.api.DiscordApiBuilder
import org.javacord.api.entity.intent.Intent
import org.javacord.api.entity.message.MessageBuilder
import org.javacord.api.entity.server.Server
import org.javacord.api.entity.user.User
import org.javacord.api.exception.DiscordException
import org.javacord.api.exception.MissingPermissionsException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.jvm.optionals.getOrElse

class DiscordBot(
    guildId: String,
    botToken: String
) {

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private lateinit var api: DiscordApi

    private lateinit var server: Server

    private val approvedUsers: MutableList<String> = mutableListOf()

    init {
        val builder = DiscordApiBuilder().setToken(botToken).setIntents(Intent.DIRECT_MESSAGES, Intent.GUILD_MEMBERS)

        try {
            api = builder.login().join()
            server = api.getServerById(guildId).get()

            logger.info("Discord bot is online and ready for action!")
        } catch (ex: Exception) {
            logger.warn("Discord bot could not be initialised - continuing...")
            logger.warn(ex.toString())
        }
    }

    suspend fun createContactUserPingMessage(recipientUserId: String, senderUserId: String) {
        val recipient: User = api.getUserById(recipientUserId).await()
        val sender: User = api.getUserById(senderUserId).await()

        val dmChannel = recipient.privateChannel.getOrElse { recipient.openPrivateChannel().get() }

        if (BotMessageBuilder.canBuildEmbedFromUser(sender)) {
            dmChannel.sendMessage(BotMessageBuilder.embedMessage(recipient, sender))
        } else {
            dmChannel.sendMessage(BotMessageBuilder.basicMessage(recipient, sender))
        }
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

    fun isUserInGuild(userId: String): Boolean {
        return server.getMemberById(userId).isPresent
    }

    fun getDisplayNameForUser(userId: String): String {
        val baseUserName = api.getUserById(userId).get().name

        return try {
            server.getMemberById(userId).get().getNickname(server).get()
        } catch (ex: NoSuchElementException) {
            baseUserName
        }
    }

}
