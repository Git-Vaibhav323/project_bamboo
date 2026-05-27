# Deploy BAANS INFRA to Vercel

## One-click setup

1. Import [project_bamboo](https://github.com/Git-Vaibhav323/project_bamboo) in [Vercel](https://vercel.com/new).
2. Framework preset: **Other**.
3. **Root Directory:** set to `artifacts/baans-infra` (recommended — uses `artifacts/baans-infra/vercel.json`).
   - Or leave as repo root (`.`) — uses root `vercel.json` instead.
4. Deploy — no extra env vars required (`PORT` and `BASE_PATH` default in `vite.config.ts`).

## Build settings

**If Root Directory = `artifacts/baans-infra`** (recommended):

| Setting | Value |
|---------|--------|
| Install | `cd ../.. && pnpm install` |
| Build | `cd ../.. && pnpm --filter @workspace/baans-infra run build` |
| Output | `dist` |

**If Root Directory = `.` (repo root):**

| Setting | Value |
|---------|--------|
| Install | `pnpm install` |
| Build | `pnpm install && pnpm --filter @workspace/baans-infra run build` |
| Output | `artifacts/baans-infra/dist` |

## Local production build

```bash
pnpm install
pnpm --filter @workspace/baans-infra run build
pnpm --filter @workspace/baans-infra run serve
```

Optional env (see `artifacts/baans-infra/.env.example`):

- `PORT=5173`
- `BASE_PATH=/`

## SPA routing

Both `vercel.json` files rewrite all routes to `index.html` for client-side routing (wouter).

## Troubleshooting “No Output Directory named public”

This happens when Vercel’s **Root Directory** is `artifacts/baans-infra` but the output path points at the monorepo root. Set **Output Directory** to `dist` in the Vercel dashboard, or redeploy after pulling the latest `artifacts/baans-infra/vercel.json`.
