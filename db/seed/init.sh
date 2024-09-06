#!/bin/bash

### Each top-level command should be triggered from here
### This is because Docker only lets us do one CMD, but we want multiple commands to be able to reference 'db'

# Import data.json to seed posts
echo "Seeding posts"
mongoimport --host db --port 27017 \
  --db team-finder --collection posts \
  --authenticationDatabase admin --username root --password example \
  --drop --file /data.json --jsonArray

# Use latest contents of jams.json to fill in itch.io jams integration
echo "Seeding jams - run python3 jams.py to create jams.json file if it doesn't exist!"
mongoimport --host db --port 27017 \
  --db team-finder --collection jams \
  --authenticationDatabase admin --username root --password example \
  --drop --file /jams.json --jsonArray

# We run the init-mongo script against the 'admin' collection,
# as that's where the user is defined/authenticated against
mongosh db:27017/admin /init-mongo.js
