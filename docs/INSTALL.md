# Installation Guide — Data Center Capacity & Power Modeling Tool

> Step-by-step instructions for setting up the development environment.

---

## System Requirements

- **macOS** 13+ (or Linux)
- **Node.js** 22.x (LTS)
- **npm** 10.x+
- **Git**
- **SQLite** (bundled with Node.js, no separate install needed)

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd "Power Modeling Tool"

# 2. Install dependencies
npm install

# 3. Set up the database
npx prisma generate
npx prisma migrate dev

# 4. Seed sample data
npx prisma db seed

# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## Detailed Setup

### 1. Prerequisites

Install Node.js 22 via nvm (recommended):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22
```

Verify:

```bash
node -v   # Should show v22.x
npm -v    # Should show 10.x+
```

### 2. Clone and Install

```bash
git clone <repo-url>
cd "Power Modeling Tool"
npm install
```

### 3. Database Setup

Generate the Prisma client and create the database:

```bash
npx prisma generate    # Generate TypeScript types
npx prisma migrate dev # Create and apply migrations
```

This creates a SQLite database at `prisma/dev.db`.

### 4. Seed Data

```bash
npx prisma db seed
```

This populates the database with:
- 8 catalog items (GPUs, CPUs, storage)
- 1 sample scenario ("Caxa")
- 3 sites (Virginia, Oregon, Nevada)
- 10 sample deployments
- 2 assumptions (cooling overhead, inflation rate)

### 5. Run the App

```bash
npm run dev
```

Navigate to **http://localhost:3000**.

---

## Project Structure

```
Power Modeling Tool/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard
│   ├── scenarios/        # Scenario pages
│   └── catalog/          # Catalog pages
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # Sidebar, navigation
│   ├── dashboard/        # Dashboard components
│   ├── scenario/         # Scenario view, charts, dialogs
│   └── catalog/          # Catalog components
├── lib/
│   ├── actions.ts        # Server actions
│   ├── db.ts             # Prisma client
│   ├── schemas.ts        # Zod validation
│   └── engine/           # Calculation engine
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── migrations/       # Migration history
├── docs/                 # Documentation
├── .husky/               # Git hooks
└── vitest.config.ts      # Test configuration
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests |
| `npm run test:watch` | Watch mode for tests |
| `npx prisma studio` | Database GUI |
| `npx prisma db seed` | Re-seed database |
| `npx tsc --noEmit` | TypeScript type check |

---

## Environment Configuration

No `.env` file is required for development. The database defaults to `prisma/dev.db` (SQLite).

For production, configure via `docker-compose.yml` or set environment variables:

```bash
DATABASE_URL="file:./prisma/dev.db"
```

---

## Docker

Build and run with Docker:

```bash
npm run docker:build   # Build the image
npm run docker:up      # Start containers (web + adminer)
npm run docker:down    # Stop containers
```

Services:
- **Web** — `http://localhost:3000`
- **Adminer** (database GUI) — `http://localhost:8080`

### Docker Credentials for Adminer

| Field | Value |
|-------|-------|
| System | SQLite |
| Default directory | `/app/prisma/` |
| Database file | `dev.db` |

---

## Troubleshooting

### `npm install` fails

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Prisma client errors

```bash
npx prisma generate
npx prisma migrate dev
```

### TypeScript errors persist after changes

Clear the build cache:

```bash
rm -rf .next node_modules/.cache tsconfig.tsbuildinfo
npx tsc --noEmit
```

### Database is locked

Stop the dev server, then:

```bash
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

Or kill the existing process:

```bash
lsof -ti:3000 | xargs kill
```

---

## Next Steps

After installation:
1. Read the [User Guide](./USER_GUIDE.md) for how to use the app
2. Read the [Developer Guide](./DEVELOPER_GUIDE.md) for contributing code
3. Read the [Architecture Guide](./ARCHITECTURE.md) for system design
