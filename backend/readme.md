#  Backend Setup Guide

This guide explains how to set up, run, and understand the backend project.

---

## 1. Running the Backend

1. Open the terminal inside the backend folder.
2. Install all dependencies:
   ```bash
   npm i

## Dependencies Used

The project uses the following Node.js dependencies:

- **bcrypt** – Used to hash and verify passwords securely.
- **cookie-parser** – Parses cookies attached to the client request object.
- **cors** – Allows cross-origin requests (useful for frontend–backend communication).
- **dotenv** – Loads environment variables from a `.env` file.
- **express** – A lightweight framework to create REST APIs.
- **jsonwebtoken** – Creates and verifies JWT tokens for authentication.
- **mongoose** – Provides a way to interact with MongoDB using schemas and models.



## 3. Environment Variables and `.env.sample`

### Why Environment Variables?
Environment variables are used to store sensitive data (like database connection strings and secret keys) outside of the source code.  
This makes your app more secure and configurable.

### What is `.env.sample`?
- `.env.sample` is a **template file** that shows all required environment variables.  
- It does **not** contain actual values — just placeholders.  
- Developers can copy it to create their own `.env` file.


## 4. how to run

### use NodeMon to run it
 and make sure it is installed globally 

