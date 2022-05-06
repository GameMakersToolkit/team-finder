package com.gmtkgamejam.bot

import com.gmtkgamejam.Config
import kotlinx.coroutines.future.await
import org.javacord.api.DiscordApi
import org.javacord.api.DiscordApiBuilder
import org.javacord.api.entity.message.MessageBuilder
import org.javacord.api.entity.user.User
import org.javacord.api.exception.DiscordException
import org.javacord.api.exception.MissingPermissionsException
import java.util.concurrent.CompletableFuture

class ContactPermissionsCheckerBot {

    private lateinit var api: DiscordApi

    init {
        val token = Config.getString("bot.token")
        val builder = DiscordApiBuilder().setToken(token)
        try {
            api = builder.login().join()
        } catch (ex: Exception) {
            println("Discord bot could not be initialised - continuing...")
        }
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

        return didMessageFailBecausePerms
    }

}