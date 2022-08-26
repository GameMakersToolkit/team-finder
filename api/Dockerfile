FROM openjdk:11-jdk-slim

# Install packages: unzip (as its not always available)
RUN apt-get update && apt-get -y install unzip

COPY gradle/ /opt/code/gradle
COPY gradlew /opt/code/gradlew
COPY settings.gradle.kts gradle.properties* /opt/code/

WORKDIR /opt/code/

# Download/unpack gradle dependencies as early as possible in order to cache image
# Ignore any build failures (no source code has been copied yet) - we're justing trying to cache the gradle bin
RUN ./gradlew help

# Copy code and build artefact
COPY build.gradle.kts /opt/code/build.gradle.kts

# Download dependencies in order to save that build time later
RUN ./gradlew build

COPY src/ /opt/code/src

# Do the actual build, now we have source code
RUN ./gradlew build --build-cache

# Extract distribution
# The files/folders are the fully-qualified app name (com.gmtkgamejam.api-x.y.z) - shorten here for ease of use
RUN mv /opt/code/build/distributions/com.gmtkgamejam.api*.zip ./api.zip
RUN unzip api.zip && mv com.gmtkgamejam* api

EXPOSE 8080

# Start application from /bin/bash script
CMD ["/opt/code/api/bin/com.gmtkgamejam.api"]
