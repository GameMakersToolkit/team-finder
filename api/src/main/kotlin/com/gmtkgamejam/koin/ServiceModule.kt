package com.gmtkgamejam.koin

import com.gmtkgamejam.services.AdminServiceImpl
import com.gmtkgamejam.services.AnalyticsServiceImpl
import com.gmtkgamejam.services.AuthServiceImpl
import com.gmtkgamejam.services.FavouritesServiceImpl
import com.gmtkgamejam.services.JamServiceImpl
import com.gmtkgamejam.services.PostServiceImpl
import org.koin.dsl.module

val ServiceModule = module(createdAtStart = true) {
    single { AdminServiceImpl(get()) }
    single { PostServiceImpl(get(), get()) }
    single { AuthServiceImpl(get()) }
    single { AnalyticsServiceImpl(get(), get()) }
    single { JamServiceImpl(get()) }
    single { FavouritesServiceImpl(get()) }
}