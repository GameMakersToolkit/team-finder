val ktor_version: String by project
val koin_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    application
    kotlin("jvm") version "1.7.10"
    kotlin("plugin.serialization") version "1.7.10"
}

group = "com.gmtkgamejam"
version = "1.0.1"

application {
    mainClass.set("com.gmtkgamejam.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("ch.qos.logback:logback-classic:$logback_version")

    // Logging support for Javacord
    implementation("org.apache.logging.log4j:log4j-to-slf4j:2.17.2")

    // Koin core features
    implementation("io.insert-koin:koin-ktor:$koin_version")

    // DB
    implementation("org.litote.kmongo:kmongo:4.6.1")

    // Discord bot
    implementation("org.javacord:javacord:3.4.0")

    // Ktor server core, auth, etc
    implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-netty-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-cors:$ktor_version")

    // Ktor core for making web requests
    implementation("io.ktor:ktor-client-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-client-cio-jvm:$ktor_version")

    // Ktor serialisation
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")
    // HTTP serialisation for HttpClient making external requests
    implementation("io.ktor:ktor-client-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-client-content-negotiation-jvm:$ktor_version")
    // HTTP serialisation for receiving requests from the front end
    implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")

    testImplementation("io.insert-koin:koin-test:3.3.3")
    testImplementation("org.jetbrains.kotlin:kotlin-test:$kotlin_version")
    testImplementation("io.ktor:ktor-server-test-host:$ktor_version")
    testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
}
