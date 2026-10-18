Dealer SaaS

A multi-tenant automotive dealership management platform built with Next.js, TypeScript, PostgreSQL, and Prisma.

Features

- Multi-tenant architecture with secure data isolation
- Role-based access (Platform Owner and Dealership Owner)
- JWT authentication with HTTP-only cookies
- Vehicle, customer, and sales management
- VIN validation
- Lead-to-customer conversion
- Sold vehicle protection
- API validation with Zod
- Authentication rate limiting

Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Next.js REST API
- Database: PostgreSQL, Prisma
- Authentication: JWT, bcrypt
- Validation: Zod
- Testing: Vitest
- Development: Docker

Getting Started

git clone https://github.com/alikassem877/dealer-saas.git
cd dealer-saas
npm install

Configure ".env" using ".env.example", then run:

docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev

Open "http://localhost:3000".

Testing

25 tests passed: 16 unit tests and 9 integration tests.

npm test

License

MIT