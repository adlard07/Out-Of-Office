# two·tickets

A private, gamified travel-planning universe for two — dream up where to go, plan every hour of it,
then keep it forever.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **Framer Motion**.
Trips, itineraries, budgets, checklists and the memory book all come from the FastAPI backend in
`../backend`; the browser talks to it directly through `lib/api.ts`.

## Run it

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000. `npm run build` for a production build, `npm run typecheck` for types.

By default this talks to the **deployed** backend — the Lambda function URL in `ap-south-1`. To work
against a local backend instead, run `uvicorn app.main:app --reload` in `../backend` and set
`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`.

Either way the backend's `FRONTEND_ORIGIN` must include this origin or CORS blocks every call. When
the API is unreachable a banner says so rather than the screens silently emptying.

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend origin; `/api/v1` is appended by the client | `https://ohys7a7koazwgvaopochceokye0htxhz.lambda-url.ap-south-1.on.aws` |
| `NEXT_PUBLIC_API_TOKEN` | Bearer token, only when the backend runs with `AUTH_ENABLED=true` | unset |

`NEXT_PUBLIC_*` values are inlined into the browser bundle at build time, so a change needs a dev
server restart (or a rebuild) to take effect.

## The six features

| Area | Route | What works |
| --- | --- | --- |
| AI Destination Discovery | `/discover` | Budget / timing / mood **plus a free-text prompt** describing the trip; the backend weights the words above the mood tags. Scored, reasoned recommendations as rich cards |
| Destination details | `/destination/[id]` | Hero, overview, budget, experiences, stays, travel, AI itinerary preview |
| Spin the Wheel | `/wheel` | Animated roulette, classic reveal + "Complete surprise" 3-clue mode |
| AI Trip Planner | `/plan/[id]` → `/trip/[id]/itinerary` | Intake form calls `POST /trips/plan` (creates the trip *and* its itinerary); day-by-day timeline; replace / remove / move / complete activities; natural-language assistant |
| Budget & Expenses | `/trip/[id]/budget` | Total / estimated / actual / remaining, planned-vs-actual per category, add-expense |
| Preparation & Packing | `/trip/[id]/checklist` | Checkable prep sections feeding trip-readiness %, AI-generated packing list |
| Our Adventures | `/adventures`, `/adventures/[id]` | Photo cards → scrapbook with masonry gallery, expense summary, AI "trip story" |
| Upcoming Trip home | `/` | Homepage transforms into a live countdown + dashboard when a trip is active |

## Project structure

```
app/                      Routes (App Router). Dynamic pages are Client Components using `use(params)`.
components/
  layout/                 Navbar (top bar + mobile tab bar), Footer, PageShell
  ui/                     Button, GlassCard, Tag, ProgressBar, AnimatedCounter, Modal, Field set, SmartImage…
  home/ discover/ wheel/ itinerary/ budget/ trip/ adventures/   feature components
data/                     Local atlas: 8 curated destinations (imagery, experiences, stays, travel
                          options), moods, and the checklist seed posted for a new trip
lib/
  types.ts                Domain model
  api.ts                  fetch wrapper for the backend: base URL, `/api/v1` prefix, `ApiError`
  store.tsx               `StoreProvider` — server data (trips, shortlist) plus the little that stays
                          on the device (wheel line-up, active trip, destination cache, packing ticks)
  currency.ts             Configurable currency (defaults to INR) + formatting
  budget.ts date.ts checklist.ts images.ts cn.ts   pure helpers
services/
  dto.ts                  Wire types mirroring the backend's Pydantic schemas (snake_case)
  map.ts                  Wire ⇄ domain conversion, plus the local-atlas enrichment
  destinations.ts trips.ts expenses.ts checklist.ts memories.ts adventures.ts   one per API area
  types.ts                Shared result shapes + the `TravelDataService` interface
  travel.mock.ts          Simulated flights / hotels / geocode — the backend has no such endpoints
  index.ts                Single wiring point
```

## How the frontend and backend divide the work

The backend owns everything that must survive a refresh or a second device: destinations it has
suggested, the shortlist, trips, itineraries, expenses, checklists, packing lists, stories and the
memory book. Components never see wire types — `services/map.ts` converts them.

Four things are deliberately **not** server state:

- **The local atlas** (`data/destinations.ts`) — imagery, galleries, experiences, stays and travel
  options. The backend's destination rows have no columns for these, so a suggestion whose name
  matches an atlas entry borrows its art and copy; others render without those sections.
- **The wheel line-up and which trip is active** — UI state, kept in `localStorage`.
- **Packing tick-boxes** — the backend stores the generated list but has no route to mark an item
  packed, so ticks live on the device.
- **Flights / hotels / geocoding** (`services/travel.mock.ts`) — no backend endpoints exist yet.

Two backend shapes drive the flow more than they look:

- `POST /trips/plan` creates the trip *and* generates its itinerary in one call, so the planner form
  lives at `/plan/[destinationId]`, before a trip id exists.
- The only itinerary-editing route is a natural-language rewrite of the whole plan, so "replace",
  "find cheaper", "add" and reordering are all phrased as instructions for it (`services/trips.ts`).
  Completing, moving between days and deleting have their own precise routes.

## Notes

- Currency is configurable in `lib/currency.ts` (`ACTIVE_CURRENCY`). Default: ₹ / `en-IN`.
- Photos are Unsplash CDN URLs with a deterministic Picsum fallback (`components/ui/SmartImage.tsx`).
- "Clear local data" in the footer wipes the device-local state only; server data is untouched.
