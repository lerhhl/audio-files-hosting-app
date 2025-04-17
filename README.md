# Audio File Hosting App

## Overview
The **Audio File Hosting App** allows users to upload, manage, and play audio files securely. It includes features for user management, audio file handling, and API documentation.

---

## Features
1. **User Management (Administrator Access Only):**
   - Administrators can create, update, and delete user accounts.

2. **Audio File Management (Accessible to All Registered Users):**
   - Registered users can:
     - Upload audio files of supported types, as specified in the `ALLOWABLE_AUDIO_CODECS` configuration.
     - Play back their uploaded audio files.
     - View only their own uploaded files.

---

## Limitations
1. **Support PostgresSQL only**
   - To change the database connection string, modify the `DATABASE_URL` variable in the `.env` file.
  
2. **Audio File Size Limit:**
   - Maximum upload size is 10 MB.
   - To adjust this limit, update the `MAX_FILE_UPLOAD_SIZE_MB` constant in `./src/app/constants.ts`.

3. **Audio Storage Path:**
   - Uploaded audio files are stored in the `./audio_uploads` directory.
   - To change this location, update the `AUDIO_UPLOAD_FOLDER` constant in `./src/app/constants.ts` and the volume mount configuration in `docker-compose.yml`.

---

## System Architecture

![System Architecture Diagram](doc/system_architecture.png)

The system architecture diagram provides a visual representation of the application's components and their interactions. It is located in `doc/system_architecture.png`.

---

## API Documentation

The API definitions are available in the `/doc/swagger.json` file.

### Viewing the API Documentation
#### Using Visual Studio Code
1. Install the `OpenAPI (Swagger) Editor` extension.
2. Open the `/doc/swagger.json` file in the editor.
3. Click the **Show Preview** icon at the top of the editor or press `SHIFT + OPTION + P`.

#### Using a Web Browser
1. Start the application.
2. Navigate to [http://localhost:3000/api-doc](http://localhost:3000/api-doc).

#### Using the [Online Swagger Editor](https://editor.swagger.io/)
1. Open the `/doc/swagger.json` file.
2. Copy its content.
3. Paste the content into the [online Swagger editor](https://editor.swagger.io/).

---

## Running the Application

### Option 1: Running with Docker
#### Pre-requisites
* **Docker Desktop:**
  Ensure Docker Desktop is installed.
* **Environment Configuration:**
  Create a `.env` file in the project root and populate it with the necessary environment variables based on the `.env.examples` file.
  Use `postgresdb` as the PostgreSQL host

#### Steps
1. **Build and Start Containers:**
   ```bash
   docker compose up --build -d
   ```

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Running Locally
#### Prerequisites
- **Node.js**: Version 20 or higher.
- **PostgreSQL**: A local PostgreSQL instance must be running.
- **Environment Configuration**: Create a `.env` file in the root directory based on `.env.examples`. Use `localhost` as the PostgreSQL host.
- **Database Connection String**: Update the `DATABASE_URL` variable in `.env`. Example: Example:
  ```
  postgresql://postgres:mysecretpassword@localhost:5432/mydb?schema=public
  ```

#### Steps
1. **Initialize Database (Seed):**
   Create an initial administrator user by running:
   ```bash
   npm run db:seed
   ```

2. **Start Development Server:**
   Launch the development server by running:
    ```bash
    npm run dev
    ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Other commands
### Seeding the Database
To create an initial administrator user in the database:

```bash
npm run db:seed
```

### Resetting the Database
To reset the database to its initial state:

```bash
npm run migrate:reset
```

### Generating Swagger Documentation
To generate or update the OpenAPI documentation:

```bash
npm run generate:swagger
```
This updates the `doc/swagger.json` file with the latest API definitions.

---

## Notes
- Ensure all required environment variables are correctly configured in the `.env` file.
