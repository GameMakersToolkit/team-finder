val ktorVersion: String by project
val koinVersion: String by project
val kspVersion: String by project
val koinAnnotationsVersion: String by project
val kotlinVersion: String by project
val logbackVersion: String by project
val mockkVersion: String by project

plugins {
    application
    kotlin("jvm") version "2.2.20"
    kotlin("plugin.serialization") version "2.2.20"
//    id("com.google.devtools.ksp") version "$kspVersion"
    id("com.google.devtools.ksp") version "2.2.20-2.0.4"
}

group = "com.gmtkgamejam"
version = "1.1.0"

application {
    mainClass.set("com.gmtkgamejam.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("ch.qos.logback:logback-classic:$logbackVersion")

    // Logging support for Javacord
    implementation("org.apache.logging.log4j:log4j-to-slf4j:2.25.1")

    // Koin core features
    implementation("io.insert-koin:koin-ktor:$koinVersion")
    // Koin KSP nonsense; manages boilerplate for stuff like @Single annotation
    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    // Koin Annotations KSP Compiler
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")

    // DB
    implementation("org.litote.kmongo:kmongo:5.5.1")

    // Discord bot
    implementation("org.javacord:javacord:3.8.0")

    // Ktor server core, auth, etc
    implementation("io.ktor:ktor-server-core-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-netty-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-auth-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-auth-jwt-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-cors:$ktorVersion")

    // Ktor core for making web requests
    implementation("io.ktor:ktor-client-core-jvm:$ktorVersion")
    implementation("io.ktor:ktor-client-cio-jvm:$ktorVersion")

    // Ktor serialisation
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
    // HTTP serialisation for HttpClient making external requests
    implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-client-content-negotiation-jvm:$ktorVersion")
    // HTTP serialisation for receiving requests from the front end
    implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktorVersion")

    testImplementation("io.insert-koin:koin-test:4.1.1")
    testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo:4.21.0")
    testImplementation("org.jetbrains.kotlin:kotlin-test:$kotlinVersion")
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
    testImplementation("io.ktor:ktor-server-tests-jvm:2.3.13")
    testImplementation("io.mockk:mockk:$mockkVersion")
}
