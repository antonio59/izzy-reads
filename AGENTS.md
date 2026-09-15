# Izzy Reads — Agent Guide

## Conventions

- **British English** in all user-facing copy, comments, and docs (favourite, colour, customise, organise). Schema/API field names (e.g. `favoriteGenres`) are fixed identifiers — do not rename.
- **No em-dashes** (`—`). Use a spaced en-dash (`–`) where a dash is needed; otherwise prefer commas, colons, or full stops.
- Keep secrets out of source control. Convex env vars for prod must be set with `npx convex env set NAME value --prod`.

## Verify

```bash
npx tsc -b && npx eslint . && npx vitest run && npx vite build
```

## Deploy

- Pushing to `main` triggers CI → `deploy-convex` (prod) automatically.
- Dependency updates come via Dependabot (grouped, Mondays); patch/minor PRs auto-merge after checks pass.
