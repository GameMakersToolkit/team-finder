package com.gmtkgamejam

import com.gmtkgamejam.errors.ValidationException
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ResponseEnvelopeTest {
    @Test
    fun `respondData wraps payload in data envelope`() = testApplication {
        application {
            install(ContentNegotiation) {
                json(Json { prettyPrint = false })
            }
            routing {
                get("/ok") {
                    call.respondData(mapOf("status" to "ok"))
                }
            }
        }

        val response = client.get("/ok")

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals(ContentType.Application.Json.withCharset(Charsets.UTF_8), response.contentType())
        assertTrue(response.bodyAsText().contains("\"data\""))
        assertTrue(response.bodyAsText().contains("\"status\":\"ok\""))
    }

    @Test
    fun `error handling maps validation exception to error envelope`() = testApplication {
        application {
            install(ContentNegotiation) {
                json(Json { prettyPrint = false })
            }
            configureErrorHandling()
            routing {
                get("/bad") {
                    throw ValidationException("Invalid payload", mapOf("field" to "reason"))
                }
            }
        }

        val response = client.get("/bad")
        val body = response.bodyAsText()

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertTrue(body.contains("\"error\""))
        assertTrue(body.contains("\"code\":\"validation_error\""))
        assertTrue(body.contains("\"message\":\"Invalid payload\""))
        assertTrue(body.contains("\"field\":\"reason\""))
    }

    @Test
    fun `error handling maps unexpected exception to internal error envelope`() = testApplication {
        application {
            install(ContentNegotiation) {
                json(Json { prettyPrint = false })
            }
            configureErrorHandling()
            routing {
                get("/boom") {
                    error("boom")
                }
            }
        }

        val response = client.get("/boom")
        val body = response.bodyAsText()

        assertEquals(HttpStatusCode.InternalServerError, response.status)
        assertTrue(body.contains("\"error\""))
        assertTrue(body.contains("\"code\":\"internal_error\""))
    }
}
