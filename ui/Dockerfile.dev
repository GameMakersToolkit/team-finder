FROM node:16.9-alpine

WORKDIR /app

# Add node binaries to $PATH for libraries
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production

# Thin-install app dependencies
COPY package.json package-lock.json ./
RUN npm install --silent

# Add app; non-prod files still useful for local dev
COPY . ./

USER node

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]