package com.gmtkgamejam.bot

import com.gmtkgamejam.services.PostService
import org.javacord.api.entity.message.embed.EmbedBuilder
import org.javacord.api.entity.user.User

class BotMessageBuilder(private val postService: PostService) {
    fun canBuildEmbedFromUser(sender: User): Boolean = postService.getPostByAuthorId(sender.id.toString()) != null

    fun embedMessage(recipient: User, sender: User): EmbedBuilder {
        val post = postService.getPostByAuthorId(sender.id.toString())!!

        val shortDescription = if (post.description.length > 240) post.description.take(237) + "..." else post.description

        val embed = EmbedBuilder()
            .setTitle("${sender.name} wants to get in contact!")
            .setDescription("Hey there ${recipient.name}! ${sender.name} wants to get in touch - this is a summary of their current post on the Team Finder!")
            .setAuthor("FindYourJam.Team Bot", "https://findyourjam.team/", "https://findyourjam.team/logos/jam-logo-stacked.webp")
            .addField("Description", shortDescription)

        // Add optional fields - turns out this includes timezones
        if (post.skillsSought?.isNotEmpty() == true) {
            embed.addField("${sender.name} is looking for:", post.skillsSought.toString())
        }
        if (post.skillsPossessed?.isNotEmpty() == true) {
            embed.addField("${sender.name} can bring:", post.skillsPossessed.toString())
        }
        if (post.preferredTools?.isNotEmpty() == true) {
            embed.addField("Engine(s)", post.preferredTools.toString())
        }
        if (post.timezoneOffsets.isNotEmpty()) {
            embed.addField("Timezone(s)", post.timezoneOffsets.map { if (it < 0) "UTC-$it" else "UTC+$it" }.toString())
        }

        embed
            .addField("Like what you see?", "Check out their full post here to see more! https://findyourjam.team/gmtk/${post.id}/")
            .setFooter("Feedback? DM @dotwo in the #team-finder-bot channel")

        return embed
    }

    // TODO: Add a variety of messages to mix things up a bit?
    fun basicMessage(recipient: User, sender: User): String {
        return """
            Hey ${recipient.mentionTag}, ${sender.mentionTag} wants to get in contact about your Team Finder post!
            They don't have a post on the Team Finder yet, so why not drop them a message and find out more?
        """.trimIndent()
    }
}
