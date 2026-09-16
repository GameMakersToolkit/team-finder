FROM postgres:16-alpine

RUN apk add --no-cache bash jq

COPY init-postgres.sql data.json jams.json init.sh /
COPY ./posts/*.json /posts/

RUN ["chmod", "+x", "/init.sh"]

ENTRYPOINT ["/init.sh"]
