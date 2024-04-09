package com.gmtkgamejam.bot

import com.gmtkgamejam.services.PostService
import org.javacord.api.entity.message.embed.EmbedBuilder
import org.javacord.api.entity.user.User

object BotMessageBuilder {

    private val postService = PostService()

    fun canBuildEmbedFromUser(sender: User): Boolean = postService.getPostByAuthorId(sender.id.toString()) != null

    fun embedMessage(recipient: User, sender: User): EmbedBuilder {
        val postItem = postService.getPostByAuthorId(sender.id.toString())!!

        val shortDescription = if (postItem.description.length > 240) postItem.description.take(237) + "..." else postItem.description

        return EmbedBuilder()
            .setTitle("${sender.name} wants to get in contact!")
            .setDescription("Hey there ${recipient.name}! Someone wants to get in touch - this is a summary of their current post on the Team Finder!")
            .setAuthor("GMTK Team Finder", "https://findyourjam.team/", "https://findyourjam.team/logos/jam-logo-stacked.webp")
            .addField("Description", shortDescription)
            .addField("${sender.name} is looking for:", postItem.skillsSought.toString())
            .addField("${sender.name} can bring:", postItem.skillsPossessed.toString())
            .addInlineField("Engine(s)", postItem.preferredTools.toString())
            .addInlineField("Timezone(s)", postItem.timezoneOffsets.map { if (it < 0) "UTC-$it" else "UTC+$it" }.toString())
            .addField("Like what you see?", "Check out their full post here to see more! https://findyourjam.team/gmtk/${postItem.id}/")
            .setFooter("Feedback? DM @dotwo in the #developing-gtmk-team-finder-app channel")
    }

    // TODO: Add a variety of messages to mix things up a bit?
    fun basicMessage(recipient: User, sender: User): String {
        return "Hey ${recipient.mentionTag}, ${sender.mentionTag} wants to get in contact about your Team Finder post!"
    }
}