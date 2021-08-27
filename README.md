# Team Finder

The GMTK Team Finder is a website that helps GMTK Game Jam participants find people to work with!

## Quickstart

Perform all the following steps for your chosen environment:

### IDE/Natively

#### API

Run the apps with the following environment variables, set in the IDE/on the command line:

* DISCORD_CLIENT_ID={get client ID}
* DISCORD_CLIENT_SECRET={get client secret}
  
Update the values to be as seen on our app page: https://discord.com/developers/teams

### Docker

#### API
* Copy the file `api/.env.example` to a new file called `api/.env`
** Update the values to be as seen on our app page: https://discord.com/developers/teams
* Navigate to the root of the project
* Run `docker compose up -d`
