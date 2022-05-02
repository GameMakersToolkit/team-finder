package com.gmtkgamejam.koin

import com.gmtkgamejam.Config
import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule = module(createdAtStart = true) {
    single {
        val user = Config.getString("secrets.database.user")
        val password = Config.getString("secrets.database.password")
        val host = Config.getString("secrets.database.host")
        val port = Config.getString("secrets.database.port")

        KMongo.createClient("mongodb://$user:$password@$host:$port")
    }
}
