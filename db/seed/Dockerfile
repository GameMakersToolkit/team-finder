FROM mongo

COPY init-mongo.js data.json jams.json init.sh /
COPY ./posts/*.json /posts/

RUN ["chmod", "+x", "/init.sh"]

ENTRYPOINT ["/init.sh"]
