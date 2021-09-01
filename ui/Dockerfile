FROM node:13.12-alpine

WORKDIR /app

# Add node binaries to $PATH for libraries
ENV PATH /app/node_modules/.bin:$PATH

# Thin-install app dependencies
COPY package.json package-lock.json ./
RUN npm install --silent

# Add app; non-prod files still useful for local dev
COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
