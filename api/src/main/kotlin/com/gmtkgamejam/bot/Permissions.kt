package com.gmtkgamejam.bot

import com.gmtkgamejam.Config
import java.time.LocalDateTime

class Permissions {

    private val userIdMessageTimes: MutableMap<String, LocalDateTime> = mutableMapOf()

    // Sender/Recipient Pair is stored as a String to allow for easier handling of JSON in monitoring
    private val userIdPerUserMessageTimes: MutableMap<String, LocalDateTime> = mutableMapOf()

    // User A needs to wait X seconds between messaging User B and User C
    private val userRateLimitTimeOutInSeconds = Config.getString("bot.userRateLimit").toLong()

    // User A can't ping User B more than once per X seconds
    private val perUserTimeoutInSeconds = Config.getString("bot.perRecipientRateLimit").toLong()

    fun canUserSendMessage(userId: String): Boolean {
        val currentDateTime = LocalDateTime.now()
        val previousMessageDateTime = userIdMessageTimes[userId] ?: LocalDateTime.MIN

        return currentDateTime.isAfter(previousMessageDateTime.plusSeconds(userRateLimitTimeOutInSeconds))
    }

    fun canUserSendMessageToThisUser(recipientId: String, senderId: String): Boolean {
        val currentDateTime = LocalDateTime.now()

        val specificRecipientKey = Pair(senderId, recipientId).toString()
        val previousMessageDateTime = userIdPerUserMessageTimes[specificRecipientKey] ?: LocalDateTime.MIN

        return currentDateTime.isAfter(previousMessageDateTime.plusSeconds(perUserTimeoutInSeconds))
    }

    fun trackSuccessfulMessage(recipientId: String, senderId: String) {
        val sendTime = LocalDateTime.now()
        userIdMessageTimes[senderId] = sendTime
        userIdPerUserMessageTimes[Pair(senderId, recipientId).toString()] = sendTime
    }

}