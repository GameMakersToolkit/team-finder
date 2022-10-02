#!/bin/sh

npm install --production=false --silent
npm rebuild esbuild

exec "$@"