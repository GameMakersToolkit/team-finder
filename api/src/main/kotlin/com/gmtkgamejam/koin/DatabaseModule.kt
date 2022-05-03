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
        val protocol = Config.getString("secrets.database.protocol")
        val certPath = Config.getString("secrets.database.certPath")

        if (protocol == "mongodb") {
            // Create simple connection
            KMongo.createClient("$protocol://$user:$password@$host:$port")
        } else {
            // FIXME: None of this should need breaking out into config values,
            //        but 'team-finder' and the replicaSet can be changed externally
            val settings = "team-finder?authSource=admin&replicaSet=db-mongodb-1&tls=true&tlsCAFile=$certPath"
            KMongo.createClient("$protocol://$user:$password@$host/$settings")
        }

    }
}
