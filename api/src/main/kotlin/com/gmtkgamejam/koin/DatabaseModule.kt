package com.gmtkgamejam.koin

import com.gmtkgamejam.Config
import com.gmtkgamejam.repositories.*
import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single {
        val url = Config.getString("secrets.database.url")
        KMongo.createClient(url)
    }
    single<AdminRepository> { AdminRepositoryImpl(get()) }
    single<AnalyticsRepository> { AnalyticsRepositoryImpl(get()) }
    single<FavouritesRepository> { FavouritesRepositoryImpl(get()) }
    single<PostRepository> { PostRepositoryImpl(get()) }
    single<JamRepository> { JamRepositoryImpl(get()) }
}
