# CourtHub

CourtHub is a greenfield monorepo for a staff-assisted multi-sport facility platform covering basketball, volleyball, pickleball, and badminton operations. The repo includes a Next.js 15 frontend, NestJS microservice scaffolds, database migrations, local Docker Compose wiring, and Kubernetes manifests for production deployment.

## Workspace Layout

- `frontend/web`: Next.js App Router web app for the public marketplace, login/signup, user dashboard, and admin operations.
- `mobile/app`: Expo + TypeScript mobile app for the same CourtHub product experience.
- `shared/domain`: Shared TypeScript domain models, marketplace data, scheduling helpers, and sport constants.
- `backend/services/*`: NestJS microservices for auth, booking, equipment, pricing, payment, notifications, analytics, display, plus the API gateway.
- `infra/migrations`: PostgreSQL schema creation with booking overlap protection and required tables.
- `infra/seeds`: Seed data for staff users, customers, courts, equipment, and pricing rules.
- `infra/nginx`: Gateway reverse-proxy config for local development.
- `infra/k8s`: Production Kubernetes manifest bundle.

## Web Routes

Public:

- `/`
- `/login`
- `/signup`
- `/forgot-password`

Protected:

- `/dashboard`
- `/admin`
- `/display`

Legacy routes such as `/executive`, `/operations`, and `/bookings/new` redirect into the new player/admin flows during the transition.

## Service Ports

- `4000`: API registry
- `4001`: Auth service
- `4002`: Booking service
- `4003`: Equipment service
- `4004`: Pricing service
- `4005`: Payment service
- `4006`: Notification service
- `4007`: Analytics service
- `4008`: Display service

## Swagger / OpenAPI

Each Nest service boots Swagger at `/docs` after startup.

Examples:

- `http://localhost:4002/docs`
- `http://localhost:4004/docs`
- `http://localhost:4006/docs`

## Local Development

Install dependencies from the monorepo root:

```bash
npm install
```

Run the web app directly:

```bash
npm run dev:web
```

Run the Expo mobile app:

```bash
npm run dev:mobile
```

Bring up the full local stack:

```bash
docker compose up --build
```

## Current Build Notes

- The web app now centers on a public marketplace home, a player dashboard, and a vendor admin workspace with cleaner blue sports branding.
- The shared domain package now includes marketplace vendors, courts, demo accounts, booking reservations, and deterministic schedule-availability helpers.
- The new mobile workspace is scaffolded with Expo Router and TypeScript, but if Expo dependencies are missing locally you may need to rerun `npm install` once network connectivity is stable.
- The Nest services are scaffolded with domain-specific endpoints and in-memory logic to express the required booking, pricing, payment, and notification flows.
- PostgreSQL migrations include the required core tables and a GiST exclusion constraint that prevents overlapping bookings on the same court resource.
- Nginx acts as the local API gateway, while Kubernetes manifests package the web app, gateway, and services for cluster deployment.
