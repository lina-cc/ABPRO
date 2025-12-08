# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Firebase Setup

This project uses Firebase for Authentication and Database. To run it locally, you must configure your credentials:

1.  **Create a Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Register Web App**: In your project settings, register a new Web App to get your configuration keys.
3.  **Create Database**: Go to "Firestore Database" and create a database (Start in Test Mode).
4.  **Enable Auth**: Go to "Authentication" and enable "Email/Password" and "Google" sign-in providers.
5.  **Configure Environment**:
    -   Copy the `.env.example` file to a new file named `.env`.
    -   Fill in the values in `.env` with your keys from step 2.

    ```bash
    cp .env.example .env
    # Edit .env with your keys
    ```

## Deployment to Vercel

If you are deploying this project to Vercel, you must manually add the environment variables in the Vercel Project Settings.

1. Go to your project dashboard on Vercel.
2. Click on **Settings** -> **Environment Variables**.
3. Add the following variables (copy the values from your local `.env` file):

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

You can use the `.env.example` file as a reference for the variable names.
