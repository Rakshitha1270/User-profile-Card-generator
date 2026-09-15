# User Profile Card Generator

A form-based web application that accepts user details, processes them on a Node.js server, generates a dynamic profile card, and stores profiles in SQLite.

## Features
- User form: Name, Bio, Skills and Social Links
- Live profile card preview
- Server-side form processing using Node.js + Express
- SQLite database persistence
- Saved profile list
- Responsive design

## Requirements
- Node.js 18+
- npm

## Run locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## GitHub upload

Create a GitHub repository, upload all project files except `node_modules` and `profiles.db`, then commit.

## Render deployment

For a simple Render deployment:
- Build Command: `npm install`
- Start Command: `npm start`

Note: Render's filesystem can be ephemeral on free web services, so SQLite data may not persist across redeploys/restarts. For permanent production data, use a hosted database such as PostgreSQL.
