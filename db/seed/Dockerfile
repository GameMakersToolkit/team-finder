FROM mongo

COPY init-mongo.js data.json init.sh /

RUN ["chmod", "+x", "/init.sh"]

ENTRYPOINT ["/init.sh"]
