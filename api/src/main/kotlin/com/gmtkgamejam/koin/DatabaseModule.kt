package com.gmtkgamejam.koin

import com.gmtkgamejam.Config
import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single {
        val url = Config.getString("secrets.database.url")
        println("Init KMongo connection: [$url]")
        KMongo.createClient(url)
    }
}
