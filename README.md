# Audio File Hosting App

## Running with Docker
To run the application using Docker, follow these steps:

1. Build and start the containers in detached mode by running:
  ```bash
  docker compose up --build -d
  ```
  This command initializes both the PostgreSQL and application containers. Database migrations and seeding are handled automatically.

2. Access the application by opening your browser and navigating to [http://localhost:3000](http://localhost:3000).

## Starting the Development Server
To launch the development server, execute:
```bash
npm run dev
```

## Seeding the Database
To create an initial admin user, run:
```bash
npm run db:seed
```

## Resetting the Database
To reset the database, use:
```bash
npm run migrate:reset
```