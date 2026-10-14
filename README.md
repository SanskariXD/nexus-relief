# Nexus Relief

A responsive disaster-coordination **simulation for India**, built with Next.js, React, TypeScript and Leaflet. All incident, volunteer, NGO and provider records are fictional. No SMS, emails, emergency calls or dispatches are sent. For actual emergencies in India, call 112.

## Run

Node 22+ recommended. Run `npm ci`, configure `.env.local` from `.env.example`, then `npm run dev`. Generate `DEMO_SESSION_SECRET` with a cryptographically secure random generator (32 bytes). Keep it server-side. Build with `npm run build`; test with `npm test`.

## Implemented

- Dashboard metrics derived from current workspace records.
- Six fictional incidents, twelve fictional volunteers, and six resource providers with DEMO-R001–006 identifiers.
- Report creation and separate deterministic intake assessments. Reports remain unverified.
- Interactive OpenStreetMap / Leaflet map with selectable markers and filters; approximate locality coordinates.
- Volunteer registration, review, availability and skills filtering.
- Resource proposals constrained by city, availability and category, with travel and access explicitly unverified.
- Eight mission stages, server-validated demo coordinator actions, inventory reservation/release/consumption, completion notes, and audit events.
- Guided Koramangala scenario, export and reset.
- Agent command center with actual supplied addresses, honest simulation output and optional server-side ASI:One planner diagnostics.

## Demo security and persistence boundary

This is an **isolated browser-local simulation**, not a shared coordination system. Data is versioned in localStorage and persists across reloads on the same browser and origin. Use one tab per workspace. There is no shared database or cross-tab concurrency guarantee. Client snapshots are intentionally editable by the browser owner and are never trusted as real incidents, credentials, approval records, or inventory.

Visitors can submit fictional reports and registrations. Entering the clearly labeled coordinator demo creates an HTTP-only, SameSite=Strict, HMAC-signed one-hour session. Privileged transitions require this session on the server and a same-origin request. This is a demonstration role anyone can intentionally enter; it is not production staff authentication. State transitions reject skipped review, ineligible assignments, over-allocation and repeat completion. All inventory checks apply within the submitted isolated snapshot.

Production use requires a durable transactional database, authenticated verified coordinator accounts, server-authoritative records, concurrency control, abuse prevention and operational validation. Medical or technical rescue credentials are never invented. General volunteers only receive safe-site logistics tasks.

## Fetch.ai integration

Relief Intake: `agent1qt5p95yy6rcr8ksjp7wa9p245muyq243dqtcrm4vs2tcx77at0cyk5uhl7z`

ReliefMatcher: `agent1qww9mn5yw9g0h9dg0qz53crz6fpm7cpvl3maa24u0r5vgjued0wfs83q9vr`

The addresses are already configured in `lib/domain.mjs`.

`lib/agents.ts` provides `analyzeIncident`, `matchResources` and `healthCheckAgents`. It uses the documented `POST https://api.asi1.ai/v1/chat/completions`, `planner_mode: true`, the selected address in `agents`, streaming responses and a fresh `x-session-id`. It has a 50-second timeout and a response-size cap.

**Live delivery is NOT verified and the live workflow stays disabled.** ASI's documentation says the supplied addresses are candidates, not a guarantee of invocation. The diagnostic retains metadata and labels its response as planner output; it never silently promotes it to an agent response, verifies an incident, or allocates stock. Explicit ordered direct-agent transport remains future work. No credentials were available during development, so no live agent tests were run.

Optional server variables: `ASI_ONE_API_KEY` for planner diagnostics and `LIVE_DIAGNOSTICS_PASSWORD` to restrict paid live calls independently of the open demo role. Never use NEXT_PUBLIC variables for these. Enter the diagnostics password only when testing; it is not saved in browser storage. Configure both on the host and redeploy. The command center displays the response and metadata. Delivery evidence must be verified before enabling a future live workflow.

Official transport reference: https://docs.asi1.ai/documentation/build-with-asi-one/planner

The website's twelve volunteer profiles are not synchronized to the hosted matcher. The local provider IDs align with its supplied six-record catalog, but allocations are not synchronized either.

## Deploy to Vercel

Import this GitHub repository in the intended Vercel team, choose Next.js, set `DEMO_SESSION_SECRET`, and deploy. Optional ASI credentials can be added later. No database or Supabase credentials are required for this isolated demo. The connected Vercel API rejected project creation with 403 for `sanskaris-projects` during implementation; no Vercel deployment was claimed.

## Source reference

Workflow inspiration: [StarkSoftwareDevelopment/reliefconnect](https://github.com/StarkSoftwareDevelopment/reliefconnect), an MIT-licensed project. Its source and coordinator-write approach were inspected. This implementation is independently written; no source files were copied from ReliefConnect.

## Verification

Production Next.js build and automated domain tests cover initial records, public approval rejection, review gates, medical exclusions, city/availability checks, eligibility, over-allocation, reservation, cancellation, delivery verification and repeat-completion prevention. Browser visual/interaction QA was unavailable in the authoring environment; map tile delivery depends on the browser's network access to OpenStreetMap.
