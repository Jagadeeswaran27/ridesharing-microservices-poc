# Microservices POC

A proof-of-concept microservices architecture built with **Express.js**, **TypeScript**, and **Nx** monorepo tooling. This project demonstrates a scalable backend system with an API Gateway and multiple microservices.

## Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Services](#available-services)
- [Development](#development)

## Architecture

This project follows a microservices architecture pattern:

- **API Gateway** (`api-gateway`) - Entry point for all client requests, handles routing and proxying to microservices
- **User Service** (`user-service`) - Manages user-related operations
- **Location Service** (`location-service`) - Handles location-based functionality with Redis caching

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** (v9.x or higher)
- **Docker** (for running Redis)
- **Nx CLI** (will be installed globally)

## Installation

### 1. Install Nx CLI Globally

```bash
npm install -g nx
```

### 2. Install Dependencies

Navigate to the project root and install all dependencies:

```bash
npm install
```

This will install dependencies for the entire monorepo, including all services.

## Configuration

### Environment Variables

Each service requires its own `.env` file. Create or verify the following environment files:

#### API Gateway (`apps/api-gateway/.env`)

```env
PORT=3000
NODE_ENV=development
```

#### User Service (`apps/user-service/.env`)

```env
PORT=3001
NODE_ENV=development
```

#### Location Service (`apps/location-service/.env`)

```env
PORT=3002
REDIS_URL=redis://localhost:6379
```

> **Note:** Adjust ports and configurations as needed for your environment.

### Redis Setup with Docker

The Location Service uses Redis for caching. Set up Redis using Docker:

#### Start Redis Container

```bash
docker run -d \
  --name <container-name> \
  -p 6379:6379 \
  redis:latest
```

#### Verify Redis is Running

```bash
docker ps
```

You should see the `<container-name>` container running.

#### Stop Redis (when needed)

```bash
docker stop <container-name>
```

#### Remove Redis Container (when needed)

```bash
docker rm <container-name>
```

## Running the Application

### Option 1: Run All Services Concurrently (Recommended)

The project is configured with a convenient script to run all microservices together. This is the recommended approach for development:

```bash
npm run dev
```

This command executes the following Nx command (as configured in `package.json`):

```bash
nx run-many --target=serve --projects=tag:type:gateway,tag:type:service
```

It automatically starts:

- **API Gateway** on `http://localhost:3000`
- **User Service** on `http://localhost:3001`
- **Location Service** on `http://localhost:3002`

All services will run concurrently in the same terminal, with output from each service clearly labeled.

### Option 2: Run Individual Services

You can also run services individually using Nx:

#### API Gateway

```bash
nx serve api-gateway
```

#### User Service

```bash
nx serve user-service
```

#### Location Service

```bash
nx serve location-service
```

### Verify Services are Running

Once started, the services will be available at:

- **API Gateway**: `http://localhost:3000`
- **User Service**: `http://localhost:3001`
- **Location Service**: `http://localhost:3002`

## Project Structure

```text
microservices-poc/
├── apps/
│   ├── api-gateway/          # API Gateway service
│   │   ├── src/
│   │   ├── .env
│   │   └── project.json
│   ├── user-service/         # User microservice
│   │   ├── src/
│   │   ├── .env
│   │   └── project.json
│   ├── location-service/     # Location microservice
│   │   ├── src/
│   │   ├── .env
│   │   └── project.json
│   ├── user-service-e2e/     # E2E tests for user service
│   └── location-service-e2e/ # E2E tests for location service
├── node_modules/
├── nx.json                   # Nx workspace configuration
├── package.json              # Root package.json
├── tsconfig.base.json        # Base TypeScript configuration
└── README.md
```

## Available Services

### API Gateway Details

- **Port**: 3000
- **Purpose**: Routes and proxies requests to appropriate microservices
- **Tags**: `type:gateway`

### User Service Details

- **Port**: 3001
- **Purpose**: Handles user management operations
- **Tags**: `type:service`

### Location Service Details

- **Port**: 3002
- **Purpose**: Manages location-based features with Redis caching
- **Dependencies**: Redis
- **Tags**: `type:service`

## Development

### Useful Nx Commands

```bash
# Run all services
npm run dev

# Serve a specific service
nx serve <service-name>

# Build a specific service
nx build <service-name>

# Run tests for a service
nx test <service-name>

# Lint a service
nx lint <service-name>

# Run type checking
nx typecheck <service-name>

# View project graph
nx graph
```

### Adding a New Service

To add a new microservice to the monorepo:

1. Create a new app in the `apps/` directory
2. Add a `project.json` with appropriate tags (`type:service`)
3. Create a `.env` file with service-specific configuration
4. Update the service to follow the existing patterns

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Monorepo Tool**: Nx
- **Caching**: Redis
- **Proxy**: http-proxy-middleware
- **Security**: Helmet, CORS, Rate Limiting
- **Utilities**: Morgan (logging), Compression, Axios

## Notes

- Ensure Redis is running before starting the Location Service
- All services use `dotenv` for environment variable management
- The API Gateway uses `http-proxy-middleware` for routing requests to microservices
- Services are configured with CORS, Helmet, and rate limiting for security
