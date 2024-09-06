package com.gmtkvotingsystem.koin

import com.gmtkvotingsystem.Config
import org.koin.dsl.module
import org.litote.kmongo.KMongo

val DatabaseModule =
    module(createdAtStart = true) {
        single {
            val url = Config.getString("secrets.database.url")
            KMongo.createClient(url)
        }
    }
