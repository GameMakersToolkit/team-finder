package com.gmtkgamejam.koin

import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single { KMongo.createClient("mongodb://root:example@db:27017") }
}
