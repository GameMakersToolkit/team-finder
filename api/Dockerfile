## Build stage image ##
FROM amazoncorretto:12-alpine AS builder

# Required for strip-debug to work
RUN apk add --no-cache binutils

# Build small JRE image
# This tiny JRE lets us use alpine:latest for the prod image below to cut down filesize
RUN $JAVA_HOME/bin/jlink \
         --verbose \
         --add-modules ALL-MODULE-PATH \
         --strip-debug \
         --no-man-pages \
         --no-header-files \
         --compress=2 \
         --output /customjre

WORKDIR /opt/code/

COPY gradle/ ./gradle
COPY gradlew ./gradlew

# Resolve gradle and cache in early image layer
RUN ./gradlew


COPY settings.gradle.kts gradle.properties* ./

# Copy code and build artefact
COPY build.gradle.kts ./build.gradle.kts

# Download dependencies in order to save that build time later
RUN ./gradlew dependencies

COPY src/ ./src

# Do the actual build, now we have source code
RUN ./gradlew build




## Production build image ##
FROM alpine:latest AS team-finder

ENV JAVA_HOME=/jre
ENV PATH="${JAVA_HOME}/bin:${PATH}"

COPY --from=builder /customjre $JAVA_HOME

# The files/folders are the fully-qualified app name (com.gmtkgamejam.api-x.y.z) - shorten here for ease of use
COPY --from=builder /opt/code/build/distributions/com.gmtkgamejam.api*.zip ./api.zip

# Extract distribution
RUN unzip api.zip && mv com.gmtkgamejam* api

EXPOSE 8080

# Start application from /bin/bash script
CMD ["./api/bin/com.gmtkgamejam.api"]
