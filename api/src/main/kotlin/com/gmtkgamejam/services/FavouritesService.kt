package com.gmtkgamejam.services

import com.gmtkgamejam.models.posts.dtos.FavouritePostDto
import com.gmtkgamejam.models.posts.FavouritesList
import com.gmtkgamejam.repositories.FavouritesRepository

interface FavouritesService {
    fun getFavouritesByUserId(discordId: String): FavouritesList
    fun saveFavourites(favourites: FavouritesList): FavouritesList
    fun addPostAsFavourite(discordId: String, post: FavouritePostDto): FavouritesList
}

class FavouritesServiceImpl(private val repository: FavouritesRepository) : FavouritesService {
    override fun getFavouritesByUserId(discordId: String): FavouritesList {
        return repository.getFavouritesByUserId(discordId) ?: FavouritesList(discordId)
    }

    override fun saveFavourites(favourites: FavouritesList): FavouritesList {
        repository.saveFavourites(favourites)
        return favourites
    }

    override fun addPostAsFavourite(discordId: String, post: FavouritePostDto) =
        this.saveFavourites((repository.getFavouritesByUserId(discordId) ?: FavouritesList(discordId))
            .also {
                it.postIds.add(post.postId)
            }
        )
}

