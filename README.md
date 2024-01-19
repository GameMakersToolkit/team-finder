<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/GameMakersToolkit/team-finder/main/ui/public/logos/jam-logo.webp" alt="Project Build Status">
</p>
<p align="center">
  <img src="https://github.com/GameMakersToolkit/team-finder/actions/workflows/api-run-tests.yml/badge.svg" alt="API CI Status">
  <img src="https://github.com/GameMakersToolkit/team-finder/actions/workflows/ui-run-tests.yml/badge.svg" alt="UI CI Status">
</p>

# Team Finder

The Team Finder is a website that helps Game Jam participants find people to work with!

## Overview

The Team Finder application contains three primary components:
- **UI (:3000)**: A React UI written in TypeScript
- **API (:8080)**: A Kotlin/Ktor REST API that handles queries, PostItem CRUD actions, admin tools etc.
- **DB**: A MongoDB database which holds data about PostItems, user Auth status and admin tools

The Team Finder also has two local tools which are used in development:
- **DB Viewer (:8081)**: A Mongo-Express image which allows for easy access to the local database
- **DB Seed**: A Docker image which is used to reset the local database to a known state

## Quickstart

This repo is designed to quickly and easily run within Docker. We highly recommend installing Docker on your development
machine (if you haven't used Docker before, something like [Docker Desktop](https://www.docker.com/products/docker-desktop/) would be suitable.
The Team Finder is a non-commercial open source project, so you do not need to pay for a licence).

### Docker

* Navigate to the root of the project
* Copy the file `.env.example` to a new file called `.env`
  * Speak to a member of the team to get the `DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN` values
* Run `npm --prefix ui ci` to install 3rd party UI libraries
* Run `docker compose up -d`

This will run all Team Finder components, and start the website in [http://localhost:3000](http://localhost:3000).

The UI will still use the Vite hot-reload functionality within Docker, so we recommend running all the images in Docker
for simplicity unless you're confident working with Docker.

If you prefer to run the UI outside of Docker, you can run all the other tools with `docker compose up -d api db db-seed db-viewer`

#### Docker Commands - Quick Reference

You'll need to be in the root directory of the app to run Docker commands.

```bash
# Runs all apps and logs all output to the terminal - very noisy!
# If you run the `up` command without `-d`, you'll turn off the app when you close the log output
docker compose up

# Run all apps in a 'detached' mode - the apps run in the background, and don't take over your terminal
docker compose up -d

# Run only some of the apps - the options are: [api, db, db-seed, db-viewer, ui]
docker compose up -d app1 app2 app3

# Forcibly rebuild the image
# You'll likely only need to do this when the API changes drastically 
# or when you want to re-run the db-seed (to reset the database)
docker compose up --build -d api db-seed 
```

### IDE/Natively (not recommended)

If you prefer to run the apps natively, you'll need to run the **UI**, **API** and **DB** on your machine.

#### Common

* Navigate to the root of the project
* Copy the file `.env.example` to a new file called `.env`
  * Speak to a member of the team to get the `DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN` values

#### UI

* Navigate to `./ui`
* Run `npm ci` to install 3rd party UI libraries
* Run `npm run dev` to run the UI in development mode
  * This includes Vite's hot-reload functionality


#### API

* Navigate to `./api`
* Run `gradle build` to download 3rd party libraries and build the app
  * **Windows**: `gradlew.bat build`  
  * **Mac/Linux**: `./gradlew build` 
* Run the app (substitute in environment variables as appropriate)
  * **Mac/Linux** `DATABASE_URL="..." ADMIN_DISCORD_IDS="..." DISCORD_CLIENT_ID="..." DISCORD_CLIENT_SECRET="..." DISCORD_BOT_TOKEN="..." API_URL="..." UI_URL="..." ./gradlew run`
  * **Windows (PowerShell)**  `$env:DISCORD_CLIENT_ID = "..."; $env:DISCORD_CLIENT_SECRET = "..."; $env:DISCORD_BOT_TOKEN = "..."; $env:DATABASE_URL="..."; $env:API_URL = "..."; $env:UI_URL = "..."; $env:ADMIN_DISCORD_IDS="..." ./gradlew.bat run`

If you're using the remote database (or a local DB with authentication), you'll likely need to import the certificate
locally. See https://docs.oracle.com/javase/tutorial/security/toolfilex/rstep1.html (or something newer) to import
the certificate into your keytool.


#### DB

Download and run MongoDB locally - [see the official docs here for more](https://www.mongodb.com/try/download/community).

#### DB Viewer

Follow the steps [on the Mongo Express github page](https://github.com/mongo-express/mongo-express).

#### DB Seed

The DB Seed runs a `mongoimport` command to populate the PostItem data, and a MongoJS script to set up some table 
indexes etc. to setup the database. [See the entrypoint shell script for more](https://github.com/GameMakersToolkit/team-finder/blob/main/db/seed/init.sh).
