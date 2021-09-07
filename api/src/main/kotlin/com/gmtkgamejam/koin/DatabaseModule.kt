package com.gmtkgamejam.koin

import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single {
        val user = getProperty("DATABASE_USER")
        val password = getProperty("DATABASE_PASSWORD")
        val host = getProperty("DATABASE_HOST")
        val port = getProperty("DATABASE_PORT")

        KMongo.createClient("mongodb://$user:$password@$host:$port")
    }
}
