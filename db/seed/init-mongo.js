/** All interactive Mongo shell commands can be run from here - it's a lot easier in JS when you need loops etc */

db.auth("root", "example")
db = db.getSiblingDB('team-finder')

// Tear down existing auth collection context - sometimes we lose the index otherwise (for some reason)
db.getCollection('auth').remove({})
db.getCollection('auth').drop()

// Create TTL for auth records
// The expiry field tracks the expiry of the accessToken, which is 10 minutes from issue;
// We want to clear the record itself (including long-lived refreshToken) only when the token is no longer usable
// Discord doesn't provide information on how long the refreshToken is valid for, but it's claimed up to 7 days
// We use 1 day as a happy medium, as 24 hours since last activity seems like a reasonable amount of time to re-auth
db.getCollection('auth').createIndex( { "expiry": 1 }, { expireAfterSeconds: 86400 } )