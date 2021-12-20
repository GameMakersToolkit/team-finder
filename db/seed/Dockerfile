FROM mongo

COPY data.json ./data.json
CMD mongoimport --host db --port 27017 \
    --db team-finder --collection posts \
    --authenticationDatabase admin --username root --password example \
    --drop --file /data.json --jsonArray
