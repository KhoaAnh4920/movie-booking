# Movie Booking Microservices

A scalable, event-driven movie ticket booking system built with **Microservices** architecture.

## 🚀 Key Features

- **Microservices Architecture**: Separate services for Catalog, Booking, and Payment.
- **Event-Driven**: Uses **RabbitMQ** for asynchronous communication between services (e.g., Payment -> Booking confirmation).
- **Concurrency Handling**: Prevents double-booking using **Redis** Distributed Locks and Database transactions.
- **API Gateway**: Centralized entry point using `http-proxy-middleware` for routing and authentication.
- **Database-per-Service**: Each service owns its data schema (PostgreSQL).

## 🛠 Tech Stack

- **Node.js Services (Catalog, Booking, Gateway)**: [NestJS](https://nestjs.com/) (TypeScript)
- **Payment Service**: [Spring Boot](https://spring.io/projects/spring-boot) (Java 17)
- **Packet Manager**: [pnpm](https://pnpm.io/)
- **Databases**: PostgreSQL (Prisma ORM for NestJS)
- **Caching & Locking**: Redis
- **Message Broker**: RabbitMQ
- **Infrastructure**: Docker & Docker Compose

## 🏗 Architecture Overview

| Service             | Port (Host) | Tech        | Description                                                |
| :------------------ | :---------- | :---------- | :--------------------------------------------------------- |
| **API Gateway**     | `8000`      | NestJS      | Entry point. Routes requests and handles Auth mock.        |
| **Catalog Service** | `3001`      | NestJS      | Manages Movies, Showtimes, Halls, and Seats. Owns pricing. |
| **Booking Service** | `3002`      | NestJS      | Manages Booking lifecycle (`PENDING` -> `CONFIRMED`).      |
| **Payment Service** | `8080`      | Spring Boot | Simulates payment processing and publishes events.         |

## ⚙️ Setup & Installation

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Node.js (v18+)
- Java 17 (for Payment Service)
- [pnpm](https://pnpm.io/installation)

### 1. Start Infrastructure

Run the following command to start PostgreSQL, Redis, RabbitMQ, and API Gateway:

```bash
docker-compose up -d
```

### 2. Install Dependencies

Install dependencies for the Node.js services:

```bash
pnpm install
```

### 3. Database Migration & Seeding

Initialize the databases for Catalog and Booking services:

```bash
# Catalog Service
cd services/catalog-service
npx prisma migrate dev
npx prisma db seed

# Booking Service
cd ../booking-service
npx prisma migrate dev
```

### 4. Run Services (Local Development)

**Catalog Service (NestJS)**

```bash
cd services/catalog-service
pnpm start:dev
```

**Booking Service (NestJS)**

```bash
cd services/booking-service
pnpm start:dev
```

**Payment Service (Spring Boot)**

```bash
cd services/payment-service
./mvnw spring-boot:run
```

**API Gateway**

```bash
# Running via Docker is recommended, or locally:
cd gateway/api-gateway
pnpm start:dev
```

## 📂 Project Structure

```
.
├── gateway
│   └── api-gateway       # NestJS Gateway
├── services
│   ├── catalog-service   # NestJS
│   ├── booking-service   # NestJS
│   └── payment-service   # Java / Spring Boot
├── docker-compose.yml    # Infrastructure
└── ...
```
