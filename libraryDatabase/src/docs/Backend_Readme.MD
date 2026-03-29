# Library Management System API

A RESTful backend API for managing a library system — books, members, loans and fines. Built with Node.js, Express, and PostgreSQL.

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Database | PostgreSQL (via Supabase) |
| ORM | Drizzle ORM |
| API Testing | Postman |

---

## Project Structure

```
/src
  /config         → database connection (Drizzle client)
  /controllers    → request and response handling
  /middleware     → error handler, auth guards
  /models         → Drizzle schema and relations
  /routes         → URL path definitions
  /services       → business logic and database queries
  /types          → TypeScript interfaces and types
  /validations    → schema validation
server.ts         → server entry point
drizzle.config.ts → Drizzle ORM configuration
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A Supabase account and project
- Postman (for testing)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

2. Install dependencies

```bash
npm install
```

3. Set up your environment variables — create a `.env` file in the root:

```
DATABASE_URL=postgresql://postgres.yourprojectref:yourpassword@aws-0-region.pooler.supabase.com:5432/postgres
PORT=3000
```

4. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:3000`

---

## Database Setup

This project uses Supabase as the PostgreSQL host. The database schema is managed via Drizzle ORM.

Tables:
- `books` — library book records
- `members` — registered library members
- `loans` — active and historical book loans
- `fines` — overdue fines per member

To introspect an existing database and generate the Drizzle schema:

```bash
npx drizzle-kit introspect
```

To generate and apply migrations after schema changes:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## API Endpoints

### Books `/api/books`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Fetch all books |
| GET | `/api/books/:id` | Fetch a book by ID |
| POST | `/api/books` | Add a new book |
| PATCH | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

**POST /api/books — request body:**
```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "copiesAvailable": 5
}
```

---

### Members `/api/members`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/members` | Fetch all members |
| GET | `/api/members/:id` | Fetch a member by ID |
| POST | `/api/members` | Register a new member |
| PATCH | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |

**POST /api/members — request body:**
```json
{
  "name": "Raymond Omondi",
  "email": "raymond@gmail.com",
  "phoneNumber": "0765427891"
}
```

---

### Loans `/api/loans`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/loans` | Fetch all loans |
| GET | `/api/loans/:id` | Fetch a loan by ID |
| GET | `/api/loans/active` | Fetch all active loans |
| GET | `/api/loans/overdue` | Fetch all overdue loans |
| POST | `/api/loans` | Create a new loan |
| PATCH | `/api/loans/:id` | Update a loan (e.g. return a book) |
| DELETE | `/api/loans/:id` | Delete a loan |

**POST /api/loans — request body:**
```json
{
  "memberId": "member-uuid-here",
  "bookId": "book-uuid-here",
  "dueDate": "2026-04-14T00:00:00.000Z"
}
```

**PATCH /api/loans/:id — returning a book:**
```json
{
  "returnedAt": "2026-03-15T00:00:00.000Z"
}
```

---

### Fines `/api/fines`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fines` | Fetch all fines |
| GET | `/api/fines/:id` | Fetch a fine by ID |
| GET | `/api/fines/member/:memberId` | Fetch all fines for a member |
| POST | `/api/fines/calculate/:loanId` | Calculate and create a fine for a loan |
| PATCH | `/api/fines/:id/pay` | Mark a fine as paid |

**Fine calculation:**
Fines are calculated at **KES 30 per day overdue**. The fine is created when `POST /api/fines/calculate/:loanId` is called.

---

## Error Handling

All errors are handled by a central error handler middleware registered in `server.ts`. Services throw errors with attached status codes that the handler forwards to the client.

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (e.g. fine already paid) |
| 404 | Record not found |
| 500 | Internal server error |

---

## Testing with Postman

1. Ensure the server is running (`npm run dev`)
2. Open Postman and create a new HTTP request
3. Use `http://localhost:3000` as the base URL
4. For POST and PATCH requests, set Body → raw → JSON
5. For endpoints requiring an ID, fetch all records first to get a valid ID

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `PORT` | Port the server runs on (default: 3000) |

> Never commit your `.env` file. It is included in `.gitignore`.

---

## Scripts

```bash
npm run dev      # start development server
npm run build    # compile TypeScript
npm start        # run compiled server
```