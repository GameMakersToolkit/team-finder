package com.gmtkgamejam.koin

import com.gmtkgamejam.Config
import com.gmtkgamejam.repositories.AdminRepository
import com.gmtkgamejam.repositories.AdminRepositoryImpl
import com.gmtkgamejam.repositories.FavouritesRepository
import com.gmtkgamejam.repositories.FavouritesRepositoryImpl
import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single {
        val url = Config.getString("secrets.database.url")
        KMongo.createClient(url)
    }
    single<AdminRepository> { AdminRepositoryImpl(get()) }
    single<FavouritesRepository> { FavouritesRepositoryImpl(get()) }
}
