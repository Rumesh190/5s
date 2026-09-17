# Standalone 5S

A demo-ready frontend MVP for garment-manufacturing 5S audits, corrective actions, Red Tags, continuous improvements, dashboards, evidence, and branded reports.

The application currently uses browser persistence and demo identities. No production backend, database, object storage, or identity provider is connected yet.

## Local setup

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The demo login is `admin` / `admin`; the user menu provides demo-role switching for workflow walkthroughs.

## Quality checks

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Production preview:

```bash
npm start
```

## MVP and backend status

Frontend workflows are functional and use centralized feature stores backed by `localStorage`. Evidence and signatures are browser data URLs. Browser role checks are demonstration-only and must become server authorization during backend integration.

For architecture, canonical data sources, business rules, lifecycle ownership, demo reset, backend boundaries, and AI guidance, read [AGENTS.md](./AGENTS.md) before changing code.

Additional backend handover material is under [`docs/`](./docs/).
