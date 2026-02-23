package com.gmtkgamejam.bot

import com.gmtkgamejam.services.JamService
import com.gmtkgamejam.services.PostService
import org.javacord.api.entity.message.embed.EmbedBuilder
import org.javacord.api.entity.user.User

class BotMessageBuilder(
    private val postService: PostService,
    private val jamService: JamService
) {
    fun canBuildEmbedFromUser(sender: User, jamId: String): Boolean = postService.getPostByAuthorId(sender.id.toString(), jamId) != null

    fun embedMessage(recipient: User, sender: User, jamId: String): EmbedBuilder {
        val post = postService.getPostByAuthorId(sender.id.toString(), jamId)!!
        val jam = jamService.getJam(jamId)!!

        val shortDescription = if (post.description.length > 240) post.description.take(237) + "..." else post.description

        val embed = EmbedBuilder()
            .setTitle("[${jam.name}] ${sender.name} wants to get in contact!")
            .setDescription("Hey there ${recipient.name}! ${sender.name} wants to get in touch - this is a summary of their current post on the ${jam.name} Team Finder!")
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
            .addField("Like what you see?", "Check out their full post here to see more! https://findyourjam.team/${jamId}/${post.id}/")
            .setFooter("Feedback? Issues? DM @dotwo on Discord for support.")

        return embed
    }

    // TODO: Add a variety of messages to mix things up a bit?
    fun basicMessage(recipient: User, sender: User, jamId: JamId): String {
        val jam = jamService.getJam(jamId)!!
        return """
            Hey ${recipient.mentionTag}, ${sender.mentionTag} wants to get in contact about your ${jam.name} Team Finder post!
            They don't have a post on the Team Finder yet, so why not drop them a message and find out more?
        """.trimIndent()
    }
}
