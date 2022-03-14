#!/bin/bash

### Each top-level command should be triggered from here
### This is because Docker only lets us do one CMD, but we want multiple commands to be able to reference 'db'

# Import data.json to seed posts
mongoimport --host db --port 27017 \
  --db team-finder --collection posts \
  --authenticationDatabase admin --username root --password example \
  --drop --file /data.json --jsonArray

# We run the init-mongo script against the 'admin' collection,
# as that's where the user is defined/authenticated against
mongo db:27017/admin /init-mongo.js
