# Memory — BetterAuth Integration (NestJS + React)

Last updated: 2026-07-02

## What was built

- **`prisma/schema.prisma`** — Account, Session, Verification models for BetterAuth (SQLite)
- **`src/lib/auth/auth.config.ts`** — `createAuth(prisma)` factory using dynamic ESM import of better-auth + prismaAdapter
- **`src/lib/auth/auth-factory.service.ts`** — DI provider with lazy Promise-based auth initialization (constructor starts no async work)
- **`src/lib/auth/auth.module.ts`** — `@Global()`, exports AuthFactoryService
- **`src/main.ts`** — CORS enabled, `toNodeHandler(auth)` mounted on `/api/auth/`, auth retrieved via DI (AuthFactoryService)
- **`client/src/lib/auth-client.ts`** — `createAuthClient()` with `VITE_API_URL` fallback
- **`client/src/components/LoginForm.tsx`** — signIn/signUp, session check on mount (`useEffect` + `getSession()`), success/error/loading states, signOut call
- **`client/src/App.tsx`** — simplified (no unused props)

## Decisions made

- **ESM-only workaround**: BetterAuth is ESM-only. NestJS outputs CJS. Dynamic `import()` in `createAuth()` works. AuthFactoryService uses lazy init (first `getAuth()` call triggers the import), avoiding `--experimental-vm-modules` in Jest.
- **Express 5 path pattern**: `/api/auth/` (trailing slash) instead of `/api/auth/*` — Express 5 + path-to-regexp v8 dropped bare `*`.
- **AuthFactoryService design**: Lazy Promise pattern — constructor does nothing, `getAuth()` is async and caches the result. Tested by mocking `createAuth` via `jest.mock()`.
- **Prisma 7 adapter**: `@prisma/adapter-libsql` mandatory. `super({ adapter })` in constructor.
- **CORS**: `app.enableCors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true })`.
- **Client session check**: `useEffect` on mount calls `authClient.getSession()` to restore welcome screen after page refresh.
- **AuthModule @Global()**: infrastructure modules in `src/lib/` must be `@Global()` per AGENTS.md convention.

## Problems solved

- **ESM import in Jest**: Previous `onModuleInit` approach triggered dynamic import during module compilation, which Jest's VM rejected without `--experimental-vm-modules`. Fixed by lazy init + mock in test.
- **AuthFactoryService dead code**: Was created but never used (main.ts called `createAuth` directly). Fixed by wiring `factory.getAuth()` in main.ts.
- **CORS missing**: First curl test passed but browser would block. Added `app.enableCors()`.
- **Sign out not working**: Button only cleared local state; added `authClient.signOut()`.
- **No session persistence on refresh**: Added `useEffect` + `getSession()` to restore UI state on mount.

## Current state

- Server starts, CORS enabled, BetterAuth middleware on `/api/auth/`
- `POST /api/auth/sign-up/email` and `POST /api/auth/sign-in/email` work
- LoginForm shows sign-in/sign-up toggle, loading state, error messages, success welcome screen, sign out
- Session persists across page refresh (welcome screen restored)
- All 4 unit test suites + 1 E2E suite pass
- Server and client both build cleanly
- Committed to `main` at `a0291e6`

## Next session starts with

1. Add auth session protection on server (NestJS Guard) for API routes
2. Add auth session check on client (useSession hook + protected route component)
3. Start server: `npx nest build && node dist/src/main.js` from `crud-app/`
4. Start client: `npm run dev` from `crud-app/client/`

## Open questions

- (none currently)
