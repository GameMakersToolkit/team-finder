## Build stage image ##
FROM ghcr.io/graalvm/jdk-community:25 AS builder

# Build small JRE image
# This tiny JRE lets us use alpine:latest for the prod image below to cut down filesize
RUN $JAVA_HOME/bin/jlink \
         --verbose \
         --module-path "$JAVA_HOME/jmods" \
         --add-modules ALL-MODULE-PATH \
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
RUN ./gradlew build -x test




## Production build image ##
FROM debian:bookworm-slim AS team-finder

ENV JAVA_HOME=/jre
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*

# Grafana integration
ADD https://github.com/grafana/grafana-opentelemetry-java/releases/latest/download/grafana-opentelemetry-java.jar /app/otel-agent.jar
# Keep runtime opts minimal by default; operators can still override JAVA_OPTS.
ENV JAVA_OPTS="-javaagent:/app/otel-agent.jar"

COPY --from=builder /customjre $JAVA_HOME

# The files/folders are the fully-qualified app name (com.gmtkgamejam.api-x.y.z) - shorten here for ease of use
COPY --from=builder /opt/code/build/distributions/com.gmtkgamejam.api*.zip ./api.zip

# Extract distribution
RUN unzip api.zip && mv com.gmtkgamejam* api

EXPOSE 8080

# Start application from /bin/bash script
CMD ["./api/bin/com.gmtkgamejam.api"]
