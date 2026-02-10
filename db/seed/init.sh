#!/bin/bash

### Each top-level command should be triggered from here
### This is because Docker only lets us do one CMD, but we want multiple commands to be able to reference 'db'

# Import data.json to seed posts
echo "Seeding posts"
mongoimport --host db --port 27017 \
  --db team-finder --collection posts \
  --authenticationDatabase admin --username root --password example \
  --drop --file /data.json --jsonArray

for filename in /posts/*.json; \
do echo "Importing $filename"; mongoimport --host db --port 27017 \
  --db team-finder --collection posts \
  --authenticationDatabase admin --username root --password example \
  --drop --file $filename --jsonArray; \
done


# Use latest contents of jams.json to fill in itch.io jams integration
mongoimport --host db --port 27017 \
  --db team-finder --collection jams \
  --authenticationDatabase admin --username root --password example \
  --drop --file /jams.json --jsonArray

# We run the init-mongo script against the 'admin' collection,
# as that's where the user is defined/authenticated against
mongosh db:27017/admin /init-mongo.js
