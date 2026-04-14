# CourtHub

CourtHub is a greenfield monorepo for a staff-assisted multi-sport facility platform covering basketball, volleyball, pickleball, and badminton operations. The repo includes a Next.js 15 frontend, NestJS microservice scaffolds, database migrations, local Docker Compose wiring, and Kubernetes manifests for production deployment.

## Workspace Layout

- `apps/web`: Next.js App Router frontend with protected dashboards, booking wizard, display board, Framer Motion animations, Zustand state, and TanStack Query data loading.
- `packages/domain`: Shared enums, types, sport specs, sample data, pricing helpers, and display rotation constants.
- `services/*`: NestJS microservices for auth, booking, equipment, pricing, payment, notifications, analytics, display, plus a lightweight API registry service.
- `infra/migrations`: PostgreSQL schema creation with booking overlap protection and required tables.
- `infra/seeds`: Seed data for staff users, customers, courts, equipment, and pricing rules.
- `infra/nginx`: Gateway reverse-proxy config for local development.
- `infra/k8s`: Production Kubernetes manifest bundle.

## Frontend Routes

Public:

- `/login`
- `/forgot-password`

Protected:

- `/executive`
- `/executive/revenue`
- `/executive/forecasting`
- `/executive/equipment-revenue`
- `/executive/customers`
- `/executive/reports`
- `/operations`
- `/operations/calendar`
- `/operations/transitions`
- `/operations/no-shows`
- `/operations/check-in`
- `/operations/today`
- `/bookings/new`
- `/inventory`
- `/inventory/maintenance`
- `/inventory/damages`
- `/inventory/low-stock`
- `/inventory/history`
- `/pricing`
- `/pricing/peak-hours`
- `/pricing/special-days`
- `/pricing/history`
- `/pricing/simulator`
- `/staff`
- `/staff/messages`
- `/staff/shift-logs`
- `/staff/incidents`
- `/staff/schedule`
- `/display`

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

Bring up the full local stack:

```bash
docker compose up --build
```

## Current Build Notes

- The frontend is production-shaped and route-complete, with exact motion patterns applied to page transitions, live court cards, no-show warnings, booking stepper progress, QR generation, KPI count-up, and display rotation.
- The Nest services are scaffolded with domain-specific endpoints and in-memory logic to express the required booking, pricing, payment, and notification flows.
- PostgreSQL migrations include the required core tables and a GiST exclusion constraint that prevents overlapping bookings on the same court resource.
- Nginx acts as the local API gateway, while Kubernetes manifests package the web app, gateway, and services for cluster deployment.
