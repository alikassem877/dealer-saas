# Dealer SaaS

A multi-tenant automotive dealership management platform built with **Next.js, TypeScript, PostgreSQL, and Prisma**.

It allows dealerships to manage vehicles, customers, and sales while keeping each dealership's data isolated.

## Features

* Multi-tenant dealership management
* Platform Owner and Dealership Owner roles
* JWT authentication with HTTP-only cookies
* Secure password hashing with bcrypt
* Vehicle management
* VIN validation
* Customer management
* Sales management
* Lead → Customer conversion
* Sold vehicles cannot be edited or deleted
* Tenant data isolation
* API validation with Zod
* Authentication rate limiting
* Unit and integration tests

## Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Next.js REST API
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT + bcrypt
* **Validation:** Zod
* **Testing:** Vitest
* **Development:** Docker

## Architecture

```text
Browser
   │
   ▼
Next.js
   ├── Frontend
   └── REST API
        │
        ▼
      Prisma
        │
        ▼
    PostgreSQL
```

The application uses a shared database. Each dealership has its own data, and API queries are filtered using the authenticated user's `dealershipId`.

## Project Structure

```text
dealer-saas/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── login/
│   │   ├── register/
│   │   └── sales/
│   │
│   ├── components/
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   └── validation/
│   │
│   └── tests/
│       ├── unit/
│       └── integration/
│
├── prisma/
├── docker-compose.yml
└── package.json
```

## Getting Started

### Requirements

* Node.js 20+
* npm
* Docker Desktop
* Git

### 1. Clone the project

```bash
git clone https://github.com/alikassem877/dealer-saas.git
cd dealer-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```powershell
Copy-Item .env.example .env
Copy-Item .env.test.example .env.test
```

### 4. Start PostgreSQL

```bash
docker compose up -d
```

The development database uses port `5434`.

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database

```bash
npx prisma db seed
```

The seed creates sample dealerships, vehicles, and customers.

**Development account:**

```text
Email: owner@platform.com
Password: PlatformOwner123!
```

Do not use this account in production.

### 7. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Testing

Run unit tests:

```bash
npm run test:unit
```

Run integration tests:

```bash
npm run test:integration
```

Run all tests:

```bash
npm test
```

Current test result:

```text
16 unit tests passed
9 integration tests passed

25/25 tests passed
```

The tests cover:

* Authentication
* Registration and login
* Tenant isolation
* Vehicle ownership
* Sales
* Lead → Customer conversion
* Duplicate sales
* Sold vehicle protection

## Security

The project includes:

* JWT authentication
* HTTP-only cookies
* bcrypt password hashing
* Role-based authorization
* Tenant isolation
* Zod input validation
* Authentication rate limiting
* Security headers

## Known Limitations

* JWT sessions do not currently support token revocation.
* Rate limiting is stored in application memory.
* Billing and Stripe integration are not implemented.
* CSP is not currently configured.
* Docker configuration is for local development.

## Development Commands

| Command                    | Description              |
| -------------------------- | ------------------------ |
| `npm run dev`              | Start development server |
| `npm run build`            | Build the application    |
| `npm run start`            | Start production server  |
| `npm run lint`             | Run ESLint               |
| `npm test`                 | Run all tests            |
| `npm run test:unit`        | Run unit tests           |
| `npm run test:integration` | Run integration tests    |
| `npx prisma migrate dev`   | Run database migrations  |
| `npx prisma db seed`       | Seed the database        |
| `docker compose up -d`     | Start PostgreSQL         |

## License

MIT
