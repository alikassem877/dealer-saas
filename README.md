Dealer SaaS

A Multi-Tenant Automotive Dealership Management Platform

A full-stack web application built with Next.js, TypeScript, PostgreSQL, and Prisma, enabling dealerships to manage vehicles, customers, and sales with secure tenant data isolation.

Key Features

- Multi-Tenant Architecture: Secure data isolation between dealerships
- Role-Based Access: Platform Owner and Dealership Owner roles
- Authentication: JWT, HTTP-only cookies, and bcrypt
- Vehicle Management: Inventory management with VIN validation
- Customer Management: Customer records and lead-to-customer conversion
- Sales Management: Sales tracking and sold vehicle protection
- Security: Zod validation and authentication rate limiting
- Testing: Unit and integration tests

Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Next.js REST API
- Database: PostgreSQL, Prisma
- Authentication: JWT, bcrypt
- Validation: Zod
- Testing: Vitest
- Development: Docker

Getting Started

1. Clone and install

git clone https://github.com/alikassem877/dealer-saas.git
cd dealer-saas
npm install

2. Configure environment variables

Copy ".env.example" to ".env" and ".env.test.example" to ".env.test".

3. Set up the database

docker compose up -d
npx prisma migrate dev
npx prisma db seed

4. Start the application

npm run dev

Open "http://localhost:3000".

Testing

25/25 Tests Passed

- 16 unit tests
- 9 integration tests

npm test

License

MIT