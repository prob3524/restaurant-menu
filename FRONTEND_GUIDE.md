# Frontend Development Guide

This guide explains how to run the frontend **independently** of the Laravel backend.

## Prerequisites
- Node.js installed.
- `npm install` has been run.

## How to Run
Run the following command in your terminal:

```powershell
npx vite --config vite.frontend.config.js
```

This will:
1. Start the Vite development server on `http://localhost:5173`.
2. Automatically open your default browser.
3. Serve the site using **Mock Data** (bypassing the database).

## Project Changes
We added 3 files to enable this "Standalone Mode" without touching your backend code:

1. **`index.html`**: The entry point for the browser.
2. **`vite.frontend.config.js`**: A simplified Vite config that skips Laravel integration.
3. **`vite-dev-entry.jsx`**: A special entry script that loads Mock Data before starting the app.

## Notes
- **Admin Panel** is NOT accessible in this mode.
- **API Calls** are mocked. Dynamic changes won't persist to a database.
- **Images**: We load images from Unsplash or local assets.
