# Audio File Hosting App

## Main features
1. **User Management (Administrator Access Only):**
   * Administrators can create new user accounts.
   * Administrators can update existing user account information.
   * Administrators can delete user accounts.

2. **Audio File Management (Accessible to All Registered Users):**
   * Registered users can upload audio files of supported types, as specified in the `ALLOWABLE_AUDIO_CODECS` configuration.
   * Registered users can play back any audio file that has been uploaded.
   * Visibility of uploaded audio files is restricted to the user who performed the upload.

## Limitations
1. **Support PostgresSQL only**
   * To change the connection string, modify the value of the 
  
2. **Audio File Size Limit:**
   * The maximum size for uploaded audio files is 10 megabytes (MB).
   * To change this limit, modify the value of the `MAX_FILE_UPLOAD_SIZE_MB` constant located in the file `./src/app/constants.ts/`.

3. **Fixed Audio Storage Path:**
   * All uploaded audio files are stored within the mounted storage directory located at `./audio_uploads`.
   * To change this storage location, modify both the `AUDIO_UPLOAD_FOLDER` constant in the `./src/app/constants.ts/` file and the volume mount configuration within the `./docker-compose.yml` file.

## System Architecture
```mermaid
   graph TD
      User[User] -->|Uploads/Downloads| WebServer[Web Server]
      WebServer -->|Handles Requests| AppServer[Application Server]
      AppServer -->|Stores/Retrieves Data| Database[PostgreSQL Database]
      AppServer -->|Stores Audio Files| Storage[Audio File Storage]
      Admin[Administrator] -->|Manages Users| AppServer
```

## API Definition
Refer to the OpenAPI Spec

## 
To run this application, ensure you have the following software and configurations in place, depending on your chosen execution method:

## Running with Docker
### Pre-requisites
* **Docker Desktop:**
  Ensure Docker Desktop is installed on your system.
* **Environment Configuration:**
  Create a `.env` file in the project root and populate it with the necessary environment variables based on the `.env.examples` file.
  The PostgreSQL host is `postgresdb`.

### Running the Application
1. **Build and Start Containers:**
   Execute the following command to build the Docker images and start the containers in detached mode:
   ```bash
   docker compose up --build -d
   ```

2. **Access the application:**
   Once the containers are running, open your web browser and navigate to http://localhost:3000 to access the application interface.

## Running Locally
### Prerequisites
* **NodeJS:**
  Ensure you have NodeJS version 20 or higher installed on your system.
* **PostgreSQL:**
  A local PostgreSQL database instance must be set up and running.
* **Environment Configuration:**
  Create a `.env` file in the root directory of the project and populate it with the necessary environment variables based on the `.env.examples` file. The PostgreSQL host is `localhost`.
* **Database Connection String:**
  Update the `DATABASE_URL` variable within your `.env` file to reflect the connection details of your local PostgreSQL database. For example: `postgresql://postgres:mysecretpassword@localhost:5432/mydb?schema=public`. Adjust the username, password, host, port, and database name as required.

### Running the Application
1. **Initialize Database (Seed):**
   To create an initial administrator user in the database, execute the following command in your terminal:
   ```bash
   npm run db:seed
   ```

2. **Start Development Server:**
   Launch the application's development server by running:
    ```bash
    npm run dev
    ```

3. **Access the application:**
   Once the development server is running, and you should be able to access the application at `http://localhost:3000`.

## Other commands
### Seeding the Database
This command is used to create an initial administrator user within the application's database. To execute the database seeding process, run the following command in your terminal:

```bash
npm run db:seed
```

### Resetting the Database
This command allows you to reset the application's database to its initial state. To perform a database reset, use the following command:

```bash
npm run migrate:reset
```
### Generating OpenAPI Documentation
To generate the OpenAPI documentation for the application, execute the following command:

```bash
npx next-swagger-doc-cli next-swagger-doc.json
```

This will create or update the `doc/swagger.json` file with the latest API definitions based on the application's configuration.
