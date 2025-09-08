package com.gmtkgamejam

import io.ktor.server.application.*
import org.apache.hc.core5.http.HttpHost
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.ksp.generated.module
import org.litote.kmongo.KMongo
import org.opensearch.client.json.jackson.JacksonJsonpMapper
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.transport.OpenSearchTransport
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder


fun Application.koinModule() {
    startKoin {
        modules(
            module(createdAtStart = true) { single { Config(environment.config) } },
            DiModule().module,
            DatabaseModule,
            SearchEngineModule,
        )
    }
}

val DatabaseModule = module(createdAtStart = true) {
    single {
        val config: Config by inject()
        val url = config.getString("secrets.database.url")
        KMongo.createClient(url)
    }
}

val SearchEngineModule = module(createdAtStart = true) {
    single<OpenSearchClient> {
        val config: Config by inject()

        // TODO: Consider if there's a more flexible connection option w/o going into cert management hell
        val httpHost: HttpHost = HttpHost(
            config.getString("se.protocol"),
            config.getString("se.host"),
            config.getInt("se.port")
        )

        val transport: OpenSearchTransport = ApacheHttpClient5TransportBuilder
            .builder(httpHost)
            .setMapper(JacksonJsonpMapper())
            .build()

        OpenSearchClient(transport)
    }
}
