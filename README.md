<p align="center">
  <img src="https://raw.githubusercontent.com/GameMakersToolkit/team-finder/main/ui/public/MainLogo100px.png" alt="Project Build Status">
</p>
<p align="center">
  <img src="https://github.com/GameMakersToolkit/team-finder/actions/workflows/api-run-tests.yml/badge.svg" alt="API CI Status">
  <img src="https://github.com/GameMakersToolkit/team-finder/actions/workflows/ui-run-tests.yml/badge.svg" alt="UI CI Status">
</p>

# Team Finder

The GMTK Team Finder is a website that helps GMTK Game Jam participants find people to work with!

## Project status

The project is in redevelopment with the following aims:

### API
* [x] Initial rebuild requirements
  * Dockerise API for easier cross-domain development
  * NoSQL solution for easier data model changes
  * Ktor to get aware from Springboot Sadness
* [x] Rebuild the concept of Teams into Posts
  * All previous requests to `/teams` now use `/posts`
  * All `/teams` endpoints have been moved across to `/posts`, but some functionality is still missing (see below)
* [ ] Post model updated as per design doc:
  * [x] Primary information
  * [ ] Secondary information (missing 'Preferred Engines/Programs')
  * [x] Teriary information (contact info not fully implemented)
* [x] Filtering/sorting logic `GET /posts` endpoint to (broadly) maintain feature parity
* [ ] Finalised Authentication/Authorisation solution
  * The current solution allows Auth with Discord and has a working `/userinfo` endpoint, but the mechanism itself isn't ideal
  * Because the Auth solution hasn't been finalised, protected actions (like creating a Post) don't currently work from existing UI
* [ ] Authentication validation on requests to protected endpoints

### UI
* [x] Initial rebuild requirements
  * Integrate with Docker solution - running all apps via Docker supports Vite hotreload
* [ ] Major refactor of UI structure
  * Raised by UI devs, the initial design of the UI codebase wasn't formalised during development
  * It would be best for a domain expert to design a standard and scaffold out that pattern for all devs to use
* [ ] Rebuild the concept of Teams into Posts
  * [x] Main Post list actions work with new URL and most of the updated query params
  * [x] Main Post list to use `skillsPossessed` and `skillsSought` instead of defunct `skillsetMask`
  * [ ] Create/Update/Delete PostItem doesn't use new* `/userinfo` mechanism
* [ ] Update PostItem component to display all Primary/Secondary/Tertiary information we want to display
  * There are no mock-up designs for this, current plan is UI devs to try mocking something up and submitting for feedback
* [ ] Add UX component to enforce User joins the GMTK Discord server before participating
  * See `is_in_guild` bool returned from `/userinfo`
  * [ ] Remove legacy warnings/messages to join GMTK discord once `is_in_guild` is confirmed to solve unfindable DM issue

Note: "new" `/userinfo` mechanism is functional and _could_ be integrated (as the final solution will use a `/userinfo` endpoint),
but the integration will need to be designed to submit a different Authorization header when the API implementation is finalised.

### Design decisions

* [ ] Decide how to manage Discord alternatives/solution to `user doesn't allow non-friends to DM` 

## Quickstart

Perform all the following steps for your chosen environment:

### IDE/Natively

#### API

Run the apps with the following environment variables, set in the IDE/on the command line:

* DISCORD_CLIENT_ID={get client ID}
* DISCORD_CLIENT_SECRET={get client secret}

If you have access to the Team Finder app in Discord, the ID/secret are [here](https://discord.com/developers/teams).
If not, message Dotwo to get access.

### Docker

#### API
* Copy the file `.env.example` to a new file called `.env`
** Update the values to be as seen on our app page: https://discord.com/developers/teams
* Navigate to the root of the project
* Run `docker compose up -d`
