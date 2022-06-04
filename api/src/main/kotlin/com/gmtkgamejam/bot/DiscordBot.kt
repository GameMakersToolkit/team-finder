package com.gmtkgamejam.bot

import com.gmtkgamejam.Config
import kotlinx.coroutines.future.await
import org.javacord.api.DiscordApi
import org.javacord.api.DiscordApiBuilder
import org.javacord.api.entity.channel.ServerTextChannel
import org.javacord.api.entity.message.Message
import org.javacord.api.entity.message.MessageBuilder
import org.javacord.api.entity.user.User
import org.javacord.api.exception.DiscordException
import org.javacord.api.exception.MissingPermissionsException

class DiscordBot {

    private lateinit var api: DiscordApi

    private lateinit var channel: ServerTextChannel

    init {
        val token = Config.getString("bot.token")
        val builder = DiscordApiBuilder().setToken(token)
        try {
            api = builder.login().join()

            // This is horrific, but it works for now!
            channel = api.channels.filter { it.asServerChannel().get().name == "bot-spam" }[0].asServerTextChannel().get()
        } catch (ex: Exception) {
            println("Discord bot could not be initialised - continuing...")
        }
    }

    suspend fun createContactUserPingMessage(recipientUserId: String, senderUserId: String): Boolean {
        val recipient: User = api.getUserById(recipientUserId).await()
        val sender: User = api.getUserById(senderUserId).await()

        val messageContents = "${recipient.mentionTag}: ${sender.mentionTag} wants to get in contact about your Team Finder post!"
        // TODO: Validate message actually sent, give error otherwise
        channel.sendMessage(messageContents).await()

        return true
    }

    suspend fun doesUserHaveValidPermissions(userId: String): Boolean {
        // If the API hasn't authenticated, we either have technical issues, or the token wasn't set properly
        // (e.g. running locally). If so, just run like normal for now.
        if (!this::api.isInitialized) {
            println("Skipping user permissions check because API isn't active")
            return true
        }

        return trySendMessage(userId)
    }

    private suspend fun trySendMessage(userId: String): Boolean {
        var didMessageFailBecausePerms = false
         try {
            val user: User = api.getUserById(userId).await()

            println("Trying to send user garbage message...")

            val messageResult = MessageBuilder()
                .append("") // Intentionally left blank!
                .send(user)
                .await()

            println("This shouldn't print, but you never know - message: $messageResult")
        } catch (ex: MissingPermissionsException) {
            // A 403 response should only fire when the user has locked down DM permissions
            println("User doesn't have contact perms set properly!")
            didMessageFailBecausePerms = true
        } catch (ex: DiscordException) {
            // Any other response should indicate the message send attempt succeeded,
            // but failed because the message is garbage
            println("User has correct contact perms active!")
        }

        return !didMessageFailBecausePerms
    }

}