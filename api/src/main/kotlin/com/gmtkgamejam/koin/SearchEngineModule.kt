package com.gmtkgamejam.koin

import com.gmtkgamejam.Config
import org.apache.hc.core5.http.HttpHost
import org.koin.dsl.module
import org.opensearch.client.json.jackson.JacksonJsonpMapper
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.transport.OpenSearchTransport
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder

val SearchEngineModule = module(createdAtStart = true) {
    single<OpenSearchClient> {
        // Depending on hosting requirements, this is likely `http` while inside a VPC
        val httpHost = HttpHost(
            // TODO: Consider if there's a more flexible connection option w/o going into cert management hell
            Config.getString("se.protocol"),
            Config.getString("se.host"),
            Config.getInt("se.port")
        )

        val transport: OpenSearchTransport = ApacheHttpClient5TransportBuilder
            .builder(httpHost)
            .setMapper(JacksonJsonpMapper())
            .build()

        OpenSearchClient(transport)
    }
}