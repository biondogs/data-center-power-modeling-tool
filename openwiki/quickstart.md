---
type: Documentation
title: Quickstart
description: Entry point for the Data Center Power Modeling Tool OpenWiki. Covers setup, navigation, core concepts, and links to documentation sections.
resource: /README.md
tags: [quickstart, overview, setup, navigation]
---

# Quickstart

The **Data Center Power Modeling Tool** is a Next.js web application for modeling hardware deployments, power consumption, cooling overhead, and capital costs across multiple data center sites over quarterly time horizons. Users create isolated planning **scenarios**, add hardware **line items** (GPUs, CPUs, storage, networking), and run the engine to produce quarterly projections of IT power, facility power, utility costs, and capacity utilization.

## Setup

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The app runs at `http://localhost:3000`. Environment variables are loaded from `.env` (see `docs/INSTALL.md` for Docker/Caxa deployment).

## Architecture at a Glance

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| Frontend | React 19, shadcn/ui, Tailwind CSS v4, Recharts 3 |
| Forms | React Hook Form + Zod 4 |
| Data fetching | TanStack Query (React Query) |
| Database | SQLite via Prisma 6 |
| Testing | Vitest 4 |
| Deployment | Docker / Caxa binary |

## Navigation

- **[`Architecture`](architecture/overview.md)** — App routing, engine modules, ScenarioView decomposition, data flow diagram.
- **[`Data Model`](data-model.md)** — Prisma schema (5 models), entity relationships, business concepts, engine calculation formulas.

## Core Concepts

**Scenario** — A sandboxed planning exercise. Each scenario has its own sites, line items, and assumptions. Scenarios are independent; changes never leak across them.

**Site** — A data center location within a scenario (e.g., BayView, Mt.Wash). Sites store power capacity limits (IT, electrical, cooling, rack space), baseline legacy loads, and electricity rates.

**Line Item** — A hardware deployment row: links a catalog item to a site with a start/end quarter and quantity. The engine projects per-quarter power, capex, and capacity from these.

**Quarterly granularity** — All time references use `YYYYQ#` format. Projections are computed per quarter from `horizonStart` to `horizonEnd`.

## Existing Documentation

The repository ships with detailed documentation in `docs/`:

- `docs/ARCHITECTURE.md` — System architecture deep dive
- `docs/DEVELOPER_GUIDE.md` — Development workflows
- `docs/USER_GUIDE.md` — End-user guide
- `docs/INSTALL.md` — Setup and deployment
- `docs/SECURITY_AUDIT.md` — Security review
- `docs/UPGRADE.md` — Version upgrade notes

## Backlog

- **Test coverage** — `coverage/` directory exists but is not tracked as structured documentation. Consider linking key test modules (`lib/engine/features.test.ts`, `lib/actions.catalog.test.ts`) when test coverage docs are added.
- **Docker/Caxa deployment** — `Dockerfile`, `docker-compose.yml`, `entrypoint.sh`, `PORTABILITY.md` exist but deployment steps are not yet wiki-ified. Source: `docs/INSTALL.md`.