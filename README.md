# Task Tracker App

A full-stack task management application with secure user authentication and protected task routes.

---

## What It Does

- **Sign Up & Sign In:** Create an account and log in using JWT-based authentication.
- **Route Guarding:** Unauthenticated users are redirected to the login page; protected pages (`/` and `/tasks`) require a valid session token.
- **Task Management:** Create, view, update, and delete tasks tied to your account.
- **API Communication:** A centralized fetch utility handles JWT attachment and response parsing automatically.

---