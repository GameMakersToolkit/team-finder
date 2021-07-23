# team-finder-ui
Ensure you have a fairly recent version of NodeJS + npm installed and on your PATH (if applicable)

`npm install` to install all dependencies, `npm run dev` to begin serving the UI on `http://localhost:3000`

## API

By default, the app will make requests to the hosted API server. If you want it to make requests to a server running locally, create a `.env.local` file in the root of the project with this setting:

```
VITE_API_URL=http://localhost:8080
```