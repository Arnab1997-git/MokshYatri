# Moksh Yatri V1 — Architecture Audit 001

**Audit Date:** June 8, 2026  
**Scope:** Moksh Yatri V1.0.0 (`frontend/` application + `docs/` baseline)  
**Branch Reviewed:** `v2-development` (representative of V1 architecture)  
**Auditor:** AI Architecture Review (per `frontend/CLAUDE.md` audit priorities)

---

## Executive Summary

Moksh Yatri V1 is a functional, feature-rich travel platform with a clear three-surface product model (public website, customer portal, admin portal). The codebase follows a consistent **service-layer-over-Supabase** pattern that enabled rapid V1 delivery.

The architecture is **appropriate for an early production release** but carries **incremental debt** in four areas that should be addressed before V2 scale:

1. **Authorization is UI-gated, not server-enforced** — no Next.js middleware; data access relies on Supabase RLS (not verified in-repo).
2. **Nearly all data access runs from the browser** via a single anon Supabase client — admin operations and AI APIs lack server-side guards.
3. **Service layer fragmentation** — 45 services with overlapping responsibilities, duplicated helpers, and inconsistent scoping (admin-wide vs user-scoped queries).
4. **Documentation drift** — `DATABASE_SCHEMA.md` and product docs under-describe the live schema and behavior.

**Overall V1 verdict:** Solid foundation for incremental V2 evolution. No major rewrite required. Prioritize security hardening, service consolidation, and server-boundary introduction in thin slices.

---

## Scope & Methodology

### Documents Reviewed

| Document | Location |
|----------|----------|
| AI context | `frontend/CLAUDE.md` |
| Vision | `docs/product/VISION.md` |
| V2 roadmap | `docs/product/V2_ROADMAP.md` |
| System overview | `docs/architecture/SYSTEM_OVERVIEW.md` |
| Database schema | `docs/database/DATABASE_SCHEMA.md` |
| Security baseline | `docs/security/SECURITY_BASELINE.md` |
| V1 release notes | `docs/release-notes/V1_RELEASE.md` |

### Code Reviewed

- 42 App Router pages under `frontend/src/app/`
- 45 services under `frontend/src/services/`
- 2 API routes under `frontend/src/app/api/`
- Auth provider, Supabase client, admin/customer layouts
- Component and section organization

### Out of Scope

- Live Supabase RLS policy verification (policies are not in this repository)
- Production runtime metrics, load testing, or penetration testing
- Vercel deployment configuration

---

## 1. Folder Structure

### Current Layout

```
MokshYatri/
├── docs/                    # Product, architecture, security docs
└── frontend/                # Entire application
    └── src/
        ├── app/             # Routes (public, dashboard, admin, api)
        ├── components/      # Shared UI (admin, customer, layout, animations)
        ├── sections/        # Homepage section compositions
        ├── services/        # Supabase data access (45 files)
        ├── providers/       # AuthProvider
        ├── lib/             # supabase client, utils
        └── data/            # Static seed data (appears unused)
```

### Strengths

- **Clear repo split** between `docs/` and `frontend/` keeps product knowledge separate from code.
- **App Router conventions** are followed: `app/admin/*`, `app/dashboard/*`, and public routes are visually distinct.
- **Homepage sections** (`sections/home/`) are separated from generic `components/`, supporting the cinematic landing experience.
- **Portal-specific components** exist (`components/admin/`, `components/customer/`).

### Weaknesses

- **All application code lives inside `frontend/`** with no shared types, database migrations, or Supabase config in-repo — schema truth is external.
- **`src/data/` is orphaned** — `destinations.ts`, `hiddenGems.ts`, and `experiences.ts` have no imports; live data comes from Supabase via services.
- **No `types/` directory** despite 20+ database tables referenced in services.
- **Inconsistent naming** — `sections/` vs `components/home/` both hold homepage-related UI.
- **No `hooks/`, `constants/`, or `errors/`** folders; logic is embedded in pages and services.

### Risks

- New contributors may edit static `data/` files expecting changes to appear in production.
- Schema changes in Supabase have no migration history in git — drift between environments is hard to detect.
- Missing shared types increase the chance of field-name mismatches across admin and customer surfaces.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Add `frontend/src/types/` with core domain types (`Profile`, `Lead`, `Quotation`, `Booking`, etc.) generated or maintained alongside `DATABASE_SCHEMA.md`. |
| **Medium** | Remove or clearly mark `src/data/` as deprecated seed/reference data. |
| **Medium** | Add `supabase/migrations/` (or document where migrations live) and link from `DATABASE_SCHEMA.md`. |
| **Low** | Consolidate homepage UI under either `sections/` or `components/home/`, not both. |
| **Low** | Add `docs/ai-audits/` index README pointing to this audit and future reviews. |

---

## 2. Service Layer Design

### Current Pattern

All 45 services follow a similar pattern:

```typescript
import { supabase } from "@/lib/supabase";

export async function getX() {
  const { data, error } = await supabase.from("table").select("...");
  if (error) { console.error(error); return []; }
  return data || [];
}
```

Services are imported directly from client components and API routes. There is no repository interface, no server/client split, and minimal shared error handling.

### Strengths

- **Consistent naming** (`*Service.ts`) makes discovery straightforward.
- **Domain alignment** — services map to business concepts (leads, quotations, bookings, gems, community).
- **Composable services** — e.g. `customer360Service`, `notificationService`, and `activityService` orchestrate lower-level services.
- **V2-ready seeds** — `timelineService`, `userPreferenceService`, `gemInteractionService`, `referralService`, and `achievementService` provide hooks for CRM intelligence and personalization without requiring new architectural patterns.
- **Pricing engine** (`pricingEngineService`) encapsulates complex quotation calculation logic separately from UI.

### Weaknesses

| Issue | Examples |
|-------|----------|
| **Duplicate functions** | `getCurrentProfile()` in both `authService.ts` and `profileService.ts` (identical implementations) |
| **Duplicate recommendation logic** | `recommendationService`, `recommendationEngineService`, and `aiGemService` all filter `hidden_gems` by vibe/style with near-identical switch maps |
| **Over-fragmented gem access** | `hiddenGemService`, `hiddenGemDetailService`, `addHiddenGemService` — three one-function files |
| **Over-fragmented community access** | `communityService` (publish only), `communityFeedService`, `communityDetailService`, `itineraryDetailService` — all touch `itineraries` |
| **Admin vs customer queries mixed** | `getLeads()` returns all leads; `getUserLeads(userId)` scopes by user — both in `leadService.ts` with no naming convention distinguishing scope |
| **Heavy `any` usage** | `leadService.createLead(lead: any)`, `quotationService.saveQuotation(quotation: any)`, `AuthProvider` user typed as `any` |
| **Debug logging in production paths** | `pricingEngineService` (11 `console.log` calls), `customer360Service.getCustomers()` logs raw data |
| **Notifications bypass DB table** | `notificationService` derives notifications from booking timelines; `notifications` table in schema docs is unused |

### Risks

- Admin-scoped functions (`getLeads`, `getBookings`, `getQuotations`, `getCustomers`) callable from any client if RLS is misconfigured.
- Duplicate logic will diverge during V2 recommendation work.
- `any` types hide breaking schema changes until runtime.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Introduce naming convention: `getAllLeads()` (admin) vs `getUserLeads(userId)` (customer); audit all services for scope clarity. |
| **High** | Extract shared `getRecommendedGemsByStyle(style)` utility used by `recommendationService`, `recommendationEngineService`, and `aiGemService`. |
| **High** | Consolidate `getCurrentProfile()` into `profileService`; re-export from `authService` if needed for backward compatibility. |
| **Medium** | Merge gem services: `hiddenGemService.ts` (+ detail + add functions as methods). |
| **Medium** | Merge itinerary/community reads into `itineraryService.ts`; keep `publishTrip` there. |
| **Medium** | Add a thin `services/errors.ts` or consistent `{ success, data, error }` return shape. |
| **Low** | Remove `console.log` from `pricingEngineService` and `customer360Service`. |
| **Low** | Decide on notifications: use `notifications` table or update schema docs to reflect computed approach. |

---

## 3. Next.js Routing Structure

### Route Map (42 pages)

| Zone | Routes |
|------|--------|
| **Public** | `/`, `/hidden-gems`, `/hidden-gems/[id]`, `/hidden-gems/add`, `/dream-trips`, `/community`, `/community/[id]`, `/personality`, `/recommendations`, `/plan`, `/plan-my-trip`, `/login`, `/signup` |
| **Profile (unscoped)** | `/profile`, `/profile/edit` |
| **Customer** | `/dashboard/*` (12 routes including `/dashboard/[id]`) |
| **Admin** | `/admin/*` (14 routes) |

### Strengths

- **Logical portal prefixes** — `/dashboard` and `/admin` clearly separate authenticated surfaces.
- **Nested dynamic routes** — `[id]` detail pages for leads, quotations, bookings, customers, gems, and community.
- **Admin workflow routing** — `/admin/quotation-engine?leadId=` supports lead-to-quote flow.
- **Customer portal nav** — `CustomerPortalNav` provides consistent sub-navigation within dashboard.

### Weaknesses

| Issue | Detail |
|-------|--------|
| **Ambiguous `/dashboard/[id]`** | Catch-all dynamic segment hosts itinerary detail — collides semantically with `/dashboard/leads/[id]`, `/dashboard/bookings/[id]`, etc. |
| **Duplicate profile routes** | `/profile` + `/profile/edit` exist outside `/dashboard/profile` with overlapping functionality |
| **Duplicate planning routes** | `/plan` (itinerary generator) and `/plan-my-trip` (lead capture) — naming does not convey distinct purpose |
| **Unprotected public write routes** | `/hidden-gems/add` has no auth gate in layout; relies on Supabase RLS for insert control |
| **Admin dev route in production tree** | `/admin/pricing-test` appears to be a development/testing page |
| **Almost entirely client-rendered** | 41 of 42 pages use `"use client"`; only root `page.tsx` (homepage) is a server component |

### Risks

- `/dashboard/[id]` will conflict if new top-level dashboard sections are added (e.g. `/dashboard/settings`).
- Users may be confused by `/profile` vs `/dashboard/profile`.
- Client-only pages miss SEO, streaming, and server-side auth opportunities.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Rename `/dashboard/[id]` → `/dashboard/itineraries/[id]` (add redirect from old path). |
| **Medium** | Redirect `/profile` and `/profile/edit` → `/dashboard/profile` (or gate `/profile` behind auth layout). |
| **Medium** | Rename or document `/plan` vs `/plan-my-trip` (e.g. `/tools/itinerary` and `/inquire`). |
| **Medium** | Protect `/hidden-gems/add` with auth check in page or shared layout. |
| **Low** | Remove or gate `/admin/pricing-test` behind dev-only env flag. |
| **Low** | Gradually convert read-heavy public pages (`hidden-gems`, `community`) to server components with client islands. |

---

## 4. API Route Organization

### Current State

Only **2 API routes** exist:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai-advisor` | POST | Groq chat completion for travel Q&A |
| `/api/generate-itinerary` | POST | Groq itinerary generation with gem context |

Both are thin wrappers around Groq SDK calls. All other data mutations and reads go **directly from browser → Supabase**.

### Strengths

- **AI keys stay server-side** — `GROQ_API_KEY` is not exposed to the client.
- **Prompt engineering is centralized** in route handlers, not scattered in components.
- **Itinerary route composes domain logic** — imports `getRelevantGems` from `aiGemService` for hidden gem context.
- **Consistent error responses** — both routes return JSON with success/error fields.

### Weaknesses

| Issue | Detail |
|-------|--------|
| **No authentication on AI routes** | Any anonymous caller can POST and consume Groq quota |
| **No rate limiting** | Acknowledged in `SECURITY_BASELINE.md` as future work; not implemented |
| **No input validation** | Request bodies are destructured without schema validation (Zod, etc.) |
| **No request size limits** | Large payloads could be sent to itinerary generator (`max_tokens: 2500`) |
| **Inconsistent response shapes** | Advisor returns `{ success, answer }`; itinerary returns `{ result }` or `{ error }` |
| **No API versioning** | `/api/v1/...` pattern not established for V2 expansion |
| **Business logic not behind APIs** | Payments, quotations, lead creation, gem submission — all client-direct to Supabase |

### Risks

- **Cost abuse** — public AI endpoints without auth or rate limits are vulnerable to quota exhaustion.
- **Prompt injection** — user-supplied `question`, `destination`, `style` flow directly into prompts without sanitization.
- V2 multi-agent features will pressure an already minimal API surface.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Add authentication check to AI routes (require Supabase session or signed token). |
| **High** | Add rate limiting (Vercel KV, Upstash, or middleware-based) per IP/user on `/api/*`. |
| **High** | Add Zod validation for AI route request bodies with max string lengths. |
| **Medium** | Standardize API response envelope: `{ success, data, error, code }`. |
| **Medium** | Introduce `/api/v1/` prefix for new routes; keep existing routes with redirects. |
| **Low** | Add basic prompt-injection guardrails (strip system-like instructions from user input). |
| **Low** | Add structured logging (request id, latency, token usage) for AI routes. |

---

## 5. Supabase Integration

### Current Setup

```typescript
// frontend/src/lib/supabase.ts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

- Single browser client used everywhere (50+ import sites).
- `@supabase/auth-helpers-nextjs` is in `package.json` but **not used**.
- No `createServerClient` for Server Components or Route Handlers.
- No service-role client (correct — should never be client-exposed).

### Tables Referenced in Code (vs Documented)

| Documented in `DATABASE_SCHEMA.md` | Also in Code (undocumented) |
|--------------------------------------|----------------------------|
| profiles, leads, quotations, bookings, payments, hidden_gems, community_posts, notifications, hotel_allocations, vehicle_allocations, reviews | `booking_payments`, `package_templates`, `package_days`, `hotel_rate_groups`, `hotels`, `vehicles`, `vehicle_categories`, `destinations`, `itineraries`, `dream_trips`, `stories`, `gem_likes`, `gem_bookmarks`, `achievements`, `user_achievements`, `referrals` |

**Notable mismatches:**

- `community_posts` (documented) → community uses `itineraries.is_public`
- `notifications` (documented) → computed in `notificationService`, not read from table
- `payments` (documented) → code uses `booking_payments`

### Strengths

- **Single integration point** — one client file, easy to find.
- **AuthProvider** wraps the app and exposes session state globally.
- **Relational queries** — services use Supabase joins (`quotations → package_templates`, `bookings → quotations`).
- **Storage integration** — `avatarUploadService` uses Supabase Storage (`avatars` bucket).
- **Strict TypeScript** enabled in `tsconfig.json`.

### Weaknesses

- **All reads/writes from browser** — no server-side Supabase client for trusted operations.
- **Unused dependency** — `@supabase/auth-helpers-nextjs` adds confusion about intended auth pattern.
- **Unused dependency** — `ollama` in `package.json`, zero imports in `src/`.
- **Schema docs severely outdated** — ~15 tables in active use are undocumented.
- **No typed database client** — no `Database` generic from Supabase codegen.
- **Avatar upload** — no file type/size validation before upload.

### Risks

- If RLS policies are incomplete, the anon client becomes a full data API for any authenticated or unauthenticated user.
- Schema doc drift will mislead V2 agents and developers.
- Cookie-based SSR auth (required for middleware) is not configured.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Conduct full RLS audit in Supabase; document policies alongside `DATABASE_SCHEMA.md`. |
| **High** | Update `DATABASE_SCHEMA.md` to reflect all tables and correct entity names (`booking_payments`, `itineraries` for community). |
| **Medium** | Add Supabase TypeScript codegen (`supabase gen types`) → `frontend/src/types/database.ts`. |
| **Medium** | Implement `createServerClient` in middleware + server contexts using `@supabase/ssr` (replace unused auth-helpers). |
| **Medium** | Add file validation to `avatarUploadService` (MIME type, max size). |
| **Low** | Remove unused `ollama` dependency. |
| **Low** | Add `.env.example` documenting required variables. |

---

## 6. Customer / Admin Separation

### Current Model

| Concern | Customer | Admin |
|---------|----------|-------|
| **Route prefix** | `/dashboard/*` | `/admin/*` |
| **Layout guard** | `dashboard/layout.tsx` — checks `supabase.auth.getUser()` | `admin/layout.tsx` — checks `isAdmin()` via profiles.role |
| **Navigation** | `CustomerPortalNav` | `Sidebar` |
| **Data scoping** | Pages filter by `user.id` / `getUserLeads()` | Pages call unscoped `getLeads()`, `getBookings()`, etc. |

### Strengths

- **Distinct UI shells** — admin sidebar vs customer nav reinforces role separation.
- **Login routing** — post-login redirect sends ADMIN → `/admin`, others → `/dashboard`.
- **Customer pages scope data** — quotations, bookings, and leads pages filter through user's lead IDs.
- **Admin-only features isolated** — quotation engine, pricing test, allocations, payments, activity feed.

### Weaknesses

| Issue | Detail |
|-------|--------|
| **No middleware** | Route protection is client-side `useEffect` — flash of content, bypassable without RLS |
| **Admin check is client-only** | `isAdmin()` queries profiles from browser; no server verification on data mutations |
| **Admin users can access `/dashboard`** | No redirect away from customer portal for ADMIN role |
| **Profile routes outside dashboard** | `/profile` not wrapped by `dashboard/layout.tsx` |
| **Navbar shows admin link client-side** | `Navbar.tsx` checks `profile?.role === "ADMIN"` — UI-only gate |
| **No role enum/constants** | `"ADMIN"` and `"CUSTOMER"` are string literals scattered across files |

### Risks

- **Critical:** Without robust RLS, a CUSTOMER session could invoke admin service functions (`getLeads`, `deleteQuotation`, `createPayment`) from browser devtools.
- Client-side guards create a false sense of security in documentation (`SECURITY_BASELINE.md` states route protection exists).
- ADMIN users accessing customer dashboard may cause confusing dual-portal state.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Add `middleware.ts` with Supabase session refresh and route guards for `/dashboard/*` and `/admin/*`. |
| **High** | Verify/enforce RLS: customers read/write only own rows; admins have elevated policies. |
| **High** | Add `lib/roles.ts` with `Role` enum and `assertAdmin()` / `assertAuthenticated()` helpers. |
| **Medium** | Redirect ADMIN users from `/dashboard` to `/admin` (or show unified portal picker). |
| **Medium** | Move `/profile/*` under dashboard layout or duplicate auth guard. |
| **Low** | Add server-side admin check in admin-only API routes when introduced in V2. |

---

## 7. Technical Debt

### Debt Inventory

| Category | Items |
|----------|-------|
| **Duplication** | `getCurrentProfile` ×2; gem recommendation logic ×3; hidden gem services ×3; community/itinerary services ×4 |
| **Dead code** | `src/data/*.ts` unused; `ollama` package unused; `@supabase/auth-helpers-nextjs` unused |
| **Type safety** | Widespread `any`; no generated DB types; `AuthProvider.user: any` |
| **Logging** | Debug `console.log` in pricing engine, customer360, plan pages |
| **Import error** | `community/page.tsx` imports `{ div } from "framer-motion/client"` (unused/erroneous) |
| **Inconsistent formatting** | Mixed indentation styles in `plan/page.tsx`, `itineraryService.ts`, `pricingEngineService.ts` |
| **Alert-based UX** | `login/page.tsx`, `hidden-gems/add` use `alert()` for feedback |
| **No tests** | Zero test files in `frontend/` |
| **Doc drift** | Schema, community model, notifications model don't match code |
| **V2 roadmap empty** | `V2_ROADMAP.md` says "to be populated after audit" |

### Strengths

- Debt is **localized and incremental** — no systemic framework misuse.
- `tsconfig.json` has `strict: true` — good baseline for tightening types.
- Services are small and readable — refactoring risk is low per file.

### Weaknesses

- Debt compounds in recommendation and profile areas where V2 will invest heavily.
- No CI gate for build, lint, or typecheck visible in-repo.

### Risks

- Shipping V2 features on duplicated services will fork business logic.
- Lack of tests makes refactoring service consolidation risky without manual QA.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Populate `V2_ROADMAP.md` from this audit's prioritized backlog. |
| **High** | Add CI workflow: `npm run build && npm run lint`. |
| **Medium** | Add smoke tests for critical services (`leadService`, `quotationService`, `pricingEngineService`). |
| **Medium** | Replace `alert()` with toast/inline error components (existing shadcn setup). |
| **Low** | Run formatter/linter pass on inconsistently formatted files. |
| **Low** | Remove dead `data/` files or wire them as dev fallbacks with explicit naming. |

---

## 8. Scalability Concerns

### Current Bottlenecks

| Location | Pattern | Impact |
|----------|---------|--------|
| `dashboardService.getDashboardStats()` | Fetches all quotation rows to sum revenue in JS; loops all bookings with 2 queries each for trip readiness | O(n) admin dashboard load |
| `activityService.getActivityFeed()` | Loads all bookings, computes full timeline per booking | O(n × m) query explosion |
| `notificationService` | Same timeline computation per user booking | Heavy for active customers |
| `recommendationService` | `select("*")` on all hidden_gems, filters in JS | Grows with gem catalog |
| `pricingEngineService` | Fetches ALL `package_days`, filters in JS | Grows with package catalog |
| Client-side data fetching | Every page mount triggers fresh Supabase calls | No caching, no SWR/React Query |

### Strengths

- **Serverless deployment on Vercel** — horizontal scaling of Next.js routes is handled by platform.
- **Supabase** — managed Postgres scales independently.
- **Parallel queries** in `dashboardService` use `Promise.all` for counts (partial optimization).
- **AI workloads isolated** to 2 API routes — can be independently rate-limited and scaled.

### Weaknesses

- No pagination on list endpoints (`getLeads`, `getBookings`, `getHiddenGems`).
- No database-level aggregation for dashboard metrics (revenue, profit, funnel).
- No caching layer (CDN, React Query, or Supabase edge).
- All pages are client components — no static generation for public content.

### Risks

- Admin dashboard and activity feed will degrade noticeably beyond ~500 bookings.
- Groq API costs scale linearly with unauthenticated AI usage.
- Hidden gem catalog growth will slow recommendation features.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Add pagination to admin list pages and service functions (`range()`, cursor-based). |
| **High** | Replace JS aggregation in `dashboardService` with Supabase RPC or SQL views. |
| **Medium** | Refactor `activityService` to SQL view or materialized activity table updated on booking events. |
| **Medium** | Add React Query / SWR for client fetch caching with stale-while-revalidate. |
| **Medium** | Push gem filtering to SQL (`WHERE vibe IN (...)`) instead of `select("*")` + JS filter. |
| **Low** | ISR or static generation for public gem listing and community feed. |
| **Low** | Fix `pricingEngineService` to query `package_days` with `.eq("package_id", packageId)`. |

---

## 9. Security Concerns

### Alignment with `SECURITY_BASELINE.md`

The security baseline correctly identifies auth, role-based access, and env-based secrets. It also flags **RLS audit**, **rate limiting**, and **file upload validation** as future work — all remain unaddressed in code.

### Threat Model Summary

| Threat | Current Mitigation | Gap |
|--------|-------------------|-----|
| Unauthorized dashboard access | Client layout guard | No middleware; bypassable |
| Customer accessing admin data | Assumed RLS | RLS not in-repo; admin queries unscoped in services |
| AI API abuse | None | Public POST, no rate limit |
| Secret exposure | Server env for Groq | Supabase anon key is public by design — relies entirely on RLS |
| Privilege escalation | `profiles.role` string | No server-side role enforcement on writes |
| File upload abuse | Supabase storage policies | No client-side validation; unknown server policies |
| XSS via AI output | `react-markdown` rendering | Markdown rendering of AI content — review sanitization config |
| CSRF | Supabase auth tokens | Standard Supabase client model — acceptable |

### Strengths

- **No service role key in frontend code.**
- **Groq API key server-side only.**
- **Admin layout performs role check** before rendering admin UI.
- **Security baseline document exists** and honestly flags gaps.

### Weaknesses

- **No Next.js middleware** for auth (despite being listed as protection method in docs).
- **AI routes unauthenticated and unlimited.**
- **Hidden gem submission** open on public route.
- **Role stored in profiles table** — writable from client if RLS allows users to update own profile including `role`.
- **No audit logging** for admin actions (payments, quotation deletes, status changes).

### Risks

| Severity | Risk |
|----------|------|
| **Critical** | Incomplete RLS + unscoped admin services = horizontal privilege escalation |
| **High** | AI endpoint cost abuse |
| **High** | Role field tampering if profile update policy is permissive |
| **Medium** | Markdown XSS from AI-generated itineraries |
| **Low** | Avatar upload of unexpected file types |

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Full RLS policy review: profiles.role, leads, quotations, bookings, payments — document in `docs/security/`. |
| **High** | Add middleware auth guards; fail closed. |
| **High** | Authenticate + rate-limit `/api/ai-advisor` and `/api/generate-itinerary`. |
| **High** | Ensure `profiles.role` is not user-writable (column-level privilege or trigger). |
| **Medium** | Configure `react-markdown` with sanitization (rehype-sanitize). |
| **Medium** | Add admin audit log table for sensitive mutations. |
| **Low** | OWASP review per V2 security baseline roadmap. |

---

## 10. V2 Readiness

### V2 Objectives (from `CLAUDE.md`)

- Multi-agent AI architecture
- Advanced recommendation engine
- AI-assisted quotation generation
- CRM intelligence
- Travel timeline management
- Analytics dashboard
- Automated workflows

### Readiness Assessment

| V2 Capability | V1 Foundation | Readiness | Blockers |
|---------------|---------------|-----------|----------|
| **Multi-agent AI** | 2 monolithic Groq prompts | 🟡 Partial | Need API layer, agent orchestration module, auth |
| **Recommendation engine** | 3 duplicate vibe-scoring implementations | 🟡 Partial | Consolidate logic; add `user_preferences` / feedback loop |
| **AI quotation generation** | `pricingEngineService` + `quotation-engine` UI | 🟢 Good | Extend existing engine; add AI narrative layer |
| **CRM intelligence** | `customer360Service`, leads pipeline | 🟢 Good | Strong base; needs analytics aggregation |
| **Travel timeline** | `timelineService` already implemented | 🟢 Good | Promote to first-class feature; persist events |
| **Analytics dashboard** | `dashboardService` with funnel metrics | 🟡 Partial | Move aggregations to SQL; add time-series |
| **Automated workflows** | Status transitions in services | 🔴 Early | No event system, webhooks, or job queue |
| **Community v2** | Itinerary publishing model | 🟡 Partial | Clarify community_posts vs itineraries |
| **Notifications v2** | Computed from timelines | 🟡 Partial | Decide persist vs compute; use notifications table |

### Strengths

- **Domain services already map to V2 features** — minimal new concepts needed.
- **Timeline service** is a strong V2 anchor for customer journey visualization.
- **Gem interaction data** (likes, bookmarks, vibes) supports personalization.
- **Pricing engine** provides structured foundation for AI-assisted quotes.
- **Incremental evolution path** — no framework change required.

### Weaknesses

- **No event bus or background jobs** — workflows will need Supabase Edge Functions, Vercel Cron, or similar.
- **No API versioning or agent abstraction layer.**
- **Empty V2 roadmap** — no phased delivery plan.
- **Security gaps must close before AI agents get broader data access.**

### Risks

- Building multi-agent AI on unauthenticated, unvalidated API routes amplifies cost and abuse risk.
- Recommendation V2 built on 3 divergent implementations will increase maintenance burden.

### Recommended Improvements

| Priority | Improvement |
|----------|-------------|
| **High** | Define V2 phases in `V2_ROADMAP.md`: Phase 1 Security, Phase 2 Service consolidation, Phase 3 AI agents. |
| **High** | Create `services/ai/` module with shared Groq client, prompt templates, and validation. |
| **Medium** | Introduce `travel_timeline_events` table; migrate `timelineService` to read persisted events. |
| **Medium** | Add `recommendation_feedback` table (already suggested in schema doc). |
| **Medium** | Introduce Supabase Edge Function or Vercel Cron for workflow automation prototype. |
| **Low** | Establish `/api/v1/agents/` route structure for V2 agent endpoints. |

---

## Prioritized Improvement Backlog

### High Impact (address before significant V2 feature work)

1. **RLS audit and documentation** — verify every table used in services; document policies in-repo.
2. **Next.js middleware auth** — server-side session validation for `/dashboard/*` and `/admin/*`.
3. **Secure AI API routes** — authentication, rate limiting, input validation (Zod).
4. **Protect `profiles.role`** — prevent customer self-elevation to ADMIN.
5. **Update `DATABASE_SCHEMA.md`** — reflect all 25+ tables and actual entity relationships.
6. **Consolidate recommendation logic** — single `gemRecommendation` utility/module.
7. **Rename `/dashboard/[id]`** → `/dashboard/itineraries/[id]`.
8. **Service scope naming** — distinguish admin (`getAll*`) vs customer (`getUser*`) functions.
9. **Add Supabase TypeScript codegen** — `database.ts` types for all tables.
10. **Add CI build + lint gate**.

### Medium Impact (parallel with early V2 features)

1. Implement `createServerClient` / `@supabase/ssr` for middleware and server contexts.
2. Merge fragmented services (gems, itineraries/community, profile helpers).
3. Add pagination to admin lists and SQL aggregations for dashboard stats.
4. Standardize API response envelope; introduce `/api/v1/` prefix.
5. Redirect or merge duplicate routes (`/profile`, `/plan` vs `/plan-my-trip`).
6. Gate `/hidden-gems/add` behind authentication.
7. Populate `V2_ROADMAP.md` with phased delivery plan.
8. Create `services/ai/` shared module for V2 agent work.
9. Add `react-markdown` sanitization for AI output.
10. Remove debug logging and unused dependencies (`ollama`, unused auth-helpers).

### Low Impact (quality and developer experience)

1. Remove or repurpose unused `src/data/` files.
2. Consolidate `sections/` and `components/home/`.
3. Remove or env-gate `/admin/pricing-test`.
4. Replace `alert()` with proper UI feedback.
5. Add `.env.example`.
6. Add admin audit logging table.
7. ISR for public content pages.
8. Formatter pass on inconsistently styled files.
9. Fix erroneous `framer-motion/client` import in `community/page.tsx`.
10. Add `docs/ai-audits/README.md` index.

---

## Appendix A: Service Inventory

| Service | Primary Tables | Notes |
|---------|---------------|-------|
| authService | profiles | Duplicate `getCurrentProfile` |
| profileService | profiles | Canonical profile reads |
| profileUpdateService | profiles | Profile writes |
| profileStatsService | gem_likes, gem_bookmarks, itineraries | |
| leadService | leads, destinations | Admin + customer scope |
| quotationService | quotations, package_templates | |
| bookingService | bookings, booking_payments, allocations | |
| paymentService | booking_payments, bookings | |
| dashboardService | leads, quotations, bookings | Heavy aggregation |
| customerDashboardService | via leadService, bookingService | |
| customer360Service | profiles + orchestration | Debug logging |
| pricingEngineService | packages, hotels, vehicles | Debug logging |
| timelineService | via lead/booking services | V2-ready |
| activityService | via timelineService | N+1 pattern |
| notificationService | computed | Does not use notifications table |
| hiddenGemService | hidden_gems | |
| hiddenGemDetailService | hidden_gems | Merge candidate |
| addHiddenGemService | hidden_gems | Merge candidate |
| aiGemService | hidden_gems | Duplicate filter logic |
| recommendationService | profiles, hidden_gems | Duplicate filter logic |
| recommendationEngineService | hidden_gems | Duplicate filter logic |
| gemInteractionService | gem_likes, gem_bookmarks | |
| bookmarkService | gem_bookmarks | |
| userPreferenceService | gem_likes, gem_bookmarks | |
| itineraryService | itineraries | |
| itineraryDetailService | itineraries | Merge candidate |
| communityService | itineraries | Publish only |
| communityFeedService | itineraries | Merge candidate |
| communityDetailService | itineraries | Merge candidate |
| dreamTripService | dream_trips | |
| destinationService | destinations | |
| packageService | package_templates | |
| hotelService | hotels | |
| hotelAllocationService | hotel_allocations | |
| vehicleService | vehicles | |
| vehicleAllocationService | vehicle_allocations | |
| reviewService | reviews | |
| referralService | referrals, profiles | |
| achievementService | achievements, user_achievements | |
| travelMilestoneService | — | |
| storyService | stories | |
| documentService | — | |
| pdfService | — | |
| avatarUploadService | storage: avatars | |

---

## Appendix B: Architecture Diagram (V1)

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ Public Pages│  │  /dashboard  │  │     /admin        │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬─────────┘ │
│         │                │                     │           │
│         └────────────────┼─────────────────────┘           │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   45 × *Service.ts   │                      │
│              │   (supabase anon SDK)  │                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Supabase  │  │ /api/ai-*  │  │  Groq API  │
    │  Postgres  │  │  (2 routes)│──│  (LLM)     │
    │  + Auth    │  └────────────┘  └────────────┘
    │  + Storage │
    └────────────┘
           ▲
           │ RLS (assumed, not in-repo)
```

---

## Appendix C: Suggested V2 Roadmap Seeds

This audit recommends populating `docs/product/V2_ROADMAP.md` with:

**Phase 1 — Harden (4–6 weeks)**  
RLS audit, middleware auth, AI route security, schema doc sync, CI gate.

**Phase 2 — Consolidate (4–6 weeks)**  
Service merges, shared types, pagination, SQL aggregations, route cleanup.

**Phase 3 — Intelligence (ongoing)**  
AI module, recommendation feedback, persisted timelines, quotation AI assist, agent API surface.

**Phase 4 — Automation (ongoing)**  
Event-driven workflows, notifications table, analytics dashboard, CRM intelligence.

---

*End of Architecture Audit 001*
