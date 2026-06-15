# Upgrade & Migration Guide

Data Center Capacity & Power Modeling Tool — Update Procedures

## Database Migrations

### Creating a New Migration (Development)

```bash
# After editing prisma/schema.prisma
npx prisma migrate dev --name descriptive_name

# Example
npx prisma migrate dev --name add_rack_space_to_site
```

This:
1. Reads the schema changes
2. Generates SQL migration files in `prisma/migrations/`
3. Applies them to the development database
4. Regenerates the Prisma client

### Applying Migrations (Production)

```bash
# Apply all pending migrations without dev prompts
npx prisma migrate deploy
```

### Resetting the Database (Development Only)

```bash
# Destroys all data, re-runs all migrations
npx prisma migrate reset

# Then re-seed
npx prisma db seed
```

### Current Migration History

| Migration | Description |
|-----------|-------------|
| `20260318155928_init` | Initial schema with all models |

---

## Schema Evolution Patterns

### Adding a Field to an Existing Model

```prisma
// 1. Edit schema.prisma
model Site {
  // ... existing fields
  newField String?  // Use ? for nullable to avoid breaking existing data
}

// 2. Migrate
npx prisma migrate dev --name add_new_field

// 3. Update code that creates/updates the model
```

### Adding a New Model

```prisma
// 1. Add model to schema.prisma
model NewModel {
  id        String   @id @default(uuid())
  scenarioId String
  scenario  Scenario @relation(fields: [scenarioId], references: [id])
  // ... fields
}

// 2. Add relation to existing model
model Scenario {
  // ...
  newModelItems NewModel[]
}

// 3. Migrate
npx prisma migrate dev --name add_new_model

// 4. Update data fetching to include the relation
```

### Renaming a Field

1. Create migration with `@@map` or use two-step approach:
   - Add new field with new name
   - Migrate
   - Backfill data via a custom migration script
   - Remove old field
   - Migrate again

2. Update all code references (actions, services, components)

### Adding a New Assumption

No schema change needed — assumptions use a key-value pattern. Just:
1. Handle the new key in `updateScenarioAssumptions` in `lib/actions.ts`
2. Use it in `Aggregator.aggregateSite()` in `lib/engine/aggregator.ts`
3. Add a default in `prisma/seed.ts`

---

## Dependency Updates

### Node.js

The project requires **Node.js 22+**. If updating from an older version:

```bash
# Check version
node --version

# Update with nvm
nvm install 22
nvm use 22
```

### Next.js

Currently on Next.js 16.1.1 (canary). When updating:

1. Update `package.json` version
2. `npm install`
3. `npm run build` to check for breaking changes
4. Review [Next.js changelog](https://nextjs.org/docs/app/changelog) for breaking changes

### Tailwind CSS v4

Key differences from v3:
- No `tailwind.config.ts` — configuration via `@theme` in CSS
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss`)
- `content` paths configured in PostCSS

If you need to add custom theme values:

```css
/* app/globals.css */
@theme {
  --color-brand: #3b82f6;
  --spacing-72: 18rem;
}
```

### Prisma

After updating Prisma:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### TypeScript

The project uses strict mode. After updating TypeScript:

```bash
npx tsc --noEmit
```

Fix any new strict mode errors. Common issues:
- Missing return types on functions
- `any` types that need proper typing
- Missing property initialization in classes

---

## Branching & PR Workflow

### Feature Branch

```bash
git checkout -b feature/your-feature
# Make changes
npm run test && npm run lint && npm run build
git add .
git commit -m "feat: describe change"
git push origin feature/your-feature
```

### Before Submitting a PR

```bash
# Verify everything works
npm run test     # All tests pass
npm run lint     # No lint errors
npm run build    # Builds successfully
npx tsc --noEmit # Type check passes
```

### Checklist

- [ ] All tests pass (`npm run test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Prisma migrations included (if schema changed)
- [ ] `npx prisma generate` run (if schema changed)
- [ ] Documentation updated (if user-facing change)

---

## Backup & Restore

### Database Backup

SQLite is a single file. Copy it:

```bash
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

### Export via Application

**Single scenario:** Use the Export button → JSON in the scenario detail page.

**All scenarios:** Use the `exportAllScenarios()` server action, which returns:
- All scenarios with sites, line items, assumptions
- All referenced catalog items
- Full projection data

### Database Restore

```bash
# From backup file
cp prisma/dev.db.backup.20240101 prisma/dev.db

# Regenerate Prisma client to be safe
npx prisma generate
```

---

## Common Upgrade Issues

### "Prisma client not found" or "Engine binary not found"

```bash
npx prisma generate
npx prisma migrate deploy
```

### "Table doesn't exist" After Migration

The migration may not have been applied:

```bash
npx prisma migrate status    # Check pending migrations
npx prisma migrate deploy    # Apply them
```

### Tailwind Styles Not Applying After Update

Check `postcss.config.mjs`:

```js
export default {
  plugins: { "@tailwindcss/postcss": {} }
}
```

Clear the Next.js cache:

```bash
rm -rf .next
npm run dev
```

### TypeScript Errors on Engine Types

After engine changes, the `SiteProjection` interface may have changed. Update all consuming components:

```bash
npx tsc --noEmit
```

Look for type mismatches in `components/scenario/` — especially `PowerChart.tsx`, `ReportTable.tsx`, and `ScenarioSummaryReport.tsx`.

### Next.js Standalone Build Missing Prisma

Ensure `next.config.ts` has:

```ts
outputFileTracingIncludes: {
  "/": [
    "./node_modules/.prisma/client/**/*",
    "./prisma/**/*",
  ]
}
```

### Docker Build Fails

Rebuild from scratch:

```bash
npm run docker:down
docker compose build --no-cache
npm run docker:up
```

### Seed Script Fails

If the database has data but the seed conflicts:

```bash
npx prisma migrate reset
npx prisma db seed
```

---

## Version Information

| Component | Current Version |
|-----------|----------------|
| Node.js | 22+ |
| Next.js | 16.1.1 (canary) |
| React | 19 |
| TypeScript | 5 |
| Prisma | 6 |
| Tailwind CSS | v4 |
| Vitest | latest |
| Recharts | latest |
| shadcn/ui | v4 |
