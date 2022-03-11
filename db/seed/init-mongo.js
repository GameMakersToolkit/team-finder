/** All interactive Mongo shell commands can be run from here - it's a lot easier in JS when you need loops etc */

db.auth("root", "example")
db = db.getSiblingDB('team-finder')

// Create TTL for auth records
db.getCollection('auth').createIndex( { "expiry": 1 }, { expireAfterSeconds: 10 } )