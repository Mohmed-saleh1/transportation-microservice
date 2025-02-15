# Transport API

Transport API is a modular, NestJS-based backend service for transportation management. It handles user authentication (with email verification and password resets), real-time vehicle tracking, trip scheduling, and vehicle management (with admin-only actions).

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Tracking](#tracking)
  - [Trips](#trips)
  - [Vehicles](#vehicles)
- [Swagger Documentation](#swagger-documentation)
- [Scripts](#scripts)
- [Logging](#logging)
- [License](#license)

## Features

- **Authentication:** User signup, login, email verification, password reset.
- **Real-time Tracking:** Push and retrieve GPS data for vehicles.
- **Trip Management:** Schedule, update, fetch, or cancel trips.
- **Vehicle Management:** Add, update, view, and delete vehicles (with admin restrictions).
- **Database:** PostgreSQL integration via TypeORM.
- **Documentation:** Auto-generated API docs using Swagger.
- **Logging:** Structured logging via Winston.
- **Dockerized:** Ready for containerized deployment using Docker Compose.

## Project Structure

```

src
│── auth
│   │── Dtos
│   │   │── forgot-password.dto.ts
│   │   │── login.dto.ts
│   │   │── resend-verify-email.dto.ts
│   │   │── reset-password.dto.ts
│   │   │── signup.dto.ts
│   │   │── verify-email.dto.ts
│   │   │── verify-reset-code.dto.ts
│   │── auth.controller.ts
│   │── auth.module.ts
│   │── auth.service.ts
│   │── auth.types.ts
│
│── common
|   |── core
|   |   │── database
|   |   │   │── database.module.ts
|   |   │── swagger
|   |   │   │── swagger.module.ts
│   │── guards
│   │   │── admin.guard.ts
│   │   │── jwt-auth.guard.ts
│   │── logger
│   │   │── winston.logger.ts
│   │── types
│   │   │── send.email.type.ts
│   │── utils
│   │   │── create-token.util.ts
│   │   │── email.utils.ts
│── tracking
│   │── dtos
│   │   │── create-track.dto.ts
│   │── tracking.controller.ts
│   │── tracking.entity.ts
│   │── tracking.gateway.ts
│   │── tracking.module.ts
│   │── tracking.service.ts
│
│── trips
│   │── dtos
│   │   │── create-trip.dto.ts
│   │   │── trips-response.dto.ts
│   │   │── update-trip.dto.ts
│   │── trip.controller.ts
│   │── trip.entity.ts
│   │── trip.module.ts
│   │── trip.service.ts
│   │── types.ts
│
│── users
│   │── dtos
│   │   │── create-user-response.dto.ts
│   │   │── create-user.dto.ts
│   │   │── update-user.dto.ts
│   │   │── user-response.dto.ts
│   │── user.entity.ts
│   │── user.service.ts
│   │── user.types.ts
│
│── vehicle
│   │── dtos
│   │── vehicle.controller.ts
│   │── vehicle.entity.ts
│   │── vehicle.module.ts
│   │── vehicle.service.ts
│   │── vehicle.types.ts
│
│── app.controller.spec.ts
│── app.controller.ts
│── app.module.ts
│── app.service.ts
│── main.ts
│
test
│── (test-related files)
│
.dockerignore
.env
.env.example
.eslintrc.js
.gitignore
.prettierrc
combine.log
docker-compose.yml
Dockerfile
error.log
nest-cli.json
package-lock.json
package.json
README.md
tsconfig.build.json
tsconfig.json


```

## Setup and Installation

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) or Docker (for containerized DB)
- _(Optional)_ [Docker & Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Create a `.env` file in the project root with the following:

```dotenv
# Server
PORT=3000

# Database
DB_HOST=db
DB_PORT=5432
DB_USER=user
DB_PASS=password
DB_NAME=transport_db
DB_SYNC=true

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s

# Email (Sending Email configuration)
API_KEY=your_email_api_key
SENDER_EMAIL=your_sender_email@example.com
SENDER_NAME="KIRO DEV"
```

Adjust these values according to your environment.

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mohmed-saleh1/transportation-microservice.git
   cd transportation-microservice
   ```

2. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

4. **Start the server:**

   ```bash
   npm run start:prod
   ```

Your API will be available at [http://localhost:3000](http://localhost:3000).

### Docker Setup

You can also run the project using Docker Compose:

1. **Build and start containers:**

   ```bash
   docker-compose up --build
   ```

   This command starts both the NestJS app and the PostgreSQL database.

2. **Access the API:**

   The API will be accessible at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                                                                     | Auth Required   |
| ------ | --------------------------- | ------------------------------------------------------------------------------- | --------------- |
| POST   | `/auth/signup`              | Registers a new user. Returns a JWT token in the `Authorization` header.        | No              |
| POST   | `/auth/login`               | Logs in a user. Returns a JWT token and user information.                       | No              |
| POST   | `/auth/verify-email`        | Verifies user email with a provided code. Returns a new token in the header.    | No              |
| POST   | `/auth/resend-verify-email` | Resends the email verification code.                                            | No              |
| POST   | `/auth/forgot-password`     | Sends a password reset email.                                                   | No              |
| POST   | `/auth/verify-reset-code`   | Verifies the password reset code and returns a new token.                       | No              |
| POST   | `/auth/reset-password`      | Resets the password using a provided token. Requires an `Authorization` header. | Yes (via token) |

### Tracking

| Method | Endpoint               | Description                                              |
| ------ | ---------------------- | -------------------------------------------------------- |
| POST   | `/tracking`            | Pushes GPS data for real-time tracking.                  |
| GET    | `/tracking/:vehicleId` | Retrieves the latest location for the specified vehicle. |

### Trips

| Method | Endpoint     | Description                           |
| ------ | ------------ | ------------------------------------- |
| POST   | `/trips`     | Schedules a new trip.                 |
| GET    | `/trips`     | Retrieves a list of all trips.        |
| GET    | `/trips/:id` | Retrieves details of a specific trip. |
| PATCH  | `/trips/:id` | Updates details of a trip.            |
| DELETE | `/trips/:id` | Cancels (deletes) a trip.             |

### Vehicles

| Method | Endpoint        | Description                        | Auth Required (Admin) |
| ------ | --------------- | ---------------------------------- | --------------------- |
| POST   | `/vehicles`     | Adds a new vehicle.                | Yes                   |
| GET    | `/vehicles`     | Lists all vehicles.                | No                    |
| GET    | `/vehicles/:id` | Retrieves vehicle details by ID.   | No                    |
| PATCH  | `/vehicles/:id` | Updates vehicle status or details. | No                    |
| DELETE | `/vehicles/:id` | Removes a vehicle from the system. | Yes                   |

> **Note:** Vehicle creation and deletion endpoints require a valid JWT token with admin privileges. These endpoints are protected using `JwtAuthGuard` and `AdminGuard`.

## Swagger Documentation

Swagger auto-generates interactive API documentation. To access it:

1. Run the API.
2. Open your browser and navigate to:  
   **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Here you can view all endpoints, see request/response models, and even test the endpoints directly from the browser.

## Scripts

The following scripts are defined in `package.json`:

- **`npm run build`**  
  Builds the application.

- **`npm run start`**  
  Starts the application.

- **`npm run start:dev`**  
  Runs the app in development mode with hot-reloading.

- **`npm run start:prod`**  
  Runs the production build of the app.

- **`npm run lint`**  
  Lints the codebase.

- **`npm run test`**  
  Runs the tests.

- **`npm run test:watch`**  
  Runs tests in watch mode.

- **`npm run format`**  
  Formats the code using Prettier.

## Logging

The API uses [Winston](https://github.com/winstonjs/winston) for logging:

- **Development:** Logs are output to the console with a custom format.
- **Production:** Logs are stored in files (`error.log` and `combine.log`) in JSON format.

## License

```
This project is released into the public domain. Anyone is free to use, modify, distribute, or do anything with this project without any restrictions.
```
