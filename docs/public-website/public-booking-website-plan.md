# Public booking website — Complete plan (Bala G Pet Clinic)

**Status:** Planning only — **no implementation** in this deliverable.  
**Scope:** `D:\Pet Clinic\bala-g-public-web` (Next.js App Router) and alignment with `D:\Pet Clinic\backend-api`.  
**Safety:** Aligns with `D:\Pet Clinic\IMPORTANT SAFETY RULES.txt` (approved projects only, original design, no cloning external sites, modular architecture, no `href=""`, semantic HTML, hydration-safe patterns, preserve route integrity, avoid duplicate architectures).

**Related documents:** `docs/public-website/cms-seo-complete-plan.md`, `docs/public-website/cms-seo-implementation-report.md` (CMS/SEO track; this plan extends the **public marketing + booking + reviews** surface).

---

## 1. Mandatory context

### 1.1 Safety and product boundaries

- All work stays under approved folders (`bala-g-public-web`, `backend-api` as agreed for API work).
- Admin dashboard may live in `Larkon-Nextjs_v2.0.2` per safety rules; **public** booking UX lives on the marketing site with clear separation from staff tools.
- “Original design” means bespoke UI composed from existing design tokens (`components/ui`, layout, motion) — not copying third-party clinic templates.

### 1.2 Current public website architecture (as-is summary)

| Layer | Current state |
|--------|----------------|
| **Routing** | App Router: `(public)` chrome (header/footer), `(auth)` for login/register/forgot/reset, static and dynamic routes for shop, services, doctors, blog, CMS pages, emergency, FAQs, legal, locations, appointment, contact. |
| **Data** | Mix of `src/config/site.ts`, `src/data/*` (homepage, doctors, services), **CMS public API** for blog/pages/banners where wired, ecommerce services for shop. |
| **Auth (web)** | `AuthProvider`, token storage, `middleware` redirect to `/login` when auth hint cookie missing for `/account` and `/admin`. `backendFetch` attaches Bearer token when present. |
| **SEO** | `defaultMetadata`, `generatePageMetadata`, `robots.ts`, `sitemap.ts`, JSON-LD on key routes (home, blog, CMS pages, doctors); local business schema from config. |
| **UI system** | `components/ui`, `components/shared`, `components/home`, `components/forms`, `components/ecommerce`, `components/motion`, `components/cms`. |
| **Performance** | `next/image`, optional ISR via `next.revalidate` on CMS fetches; fetcher avoids conflicting `cache` + `revalidate`. |

### 1.3 Backend reality check (booking-related)

| Module | Base path | Access today |
|--------|------------|----------------|
| **Appointments** | `/api/v1/appointments` | **Authenticated** + `APPOINTMENTS_READ` / `APPOINTMENTS_WRITE` / `APPOINTMENTS_MANAGE`. Create body expects **`petId`, `doctorId`, `scheduledAt`** (and optional duration/reason) — i.e. **internal clinical model**, not a guest “lead form”. |
| **Doctors** | `/api/v1/doctors` | **Authenticated** + branch-scoped listing; staff-oriented. |
| **Branches** | `/api/v1/branches` | **Authenticated** + org/branch permissions. |
| **Emergency** | `/api/v1/emergency` | **Authenticated** + emergency permissions. |
| **Auth** | `/api/v1/auth/*` | Register, login, refresh, password flows with rate limiting and device context patterns. |
| **CMS** | `/api/v1/cms/public/*` | **Unauthenticated reads** for published marketing content (pattern to mirror for **safe** public booking endpoints). |

**Implication:** A complete **public** booking flow requires **new** API contracts (e.g. `/public/bookings` or `/appointments/public`) with strict validation, rate limits, and optional auth — **without** exposing internal appointment admin routes or reusing staff-only payloads verbatim.

### 1.4 Current appointment UI (gap)

- `src/app/(public)/appointment/page.tsx` hosts `AppointmentForm`.
- `AppointmentForm` today: **client-side validation** + **simulated submit** (no backend integration). Fields (pet name, owner, phone, email, service slug, date, time) **do not map** to `createAppointmentSchema` (`petId`, `doctorId`, `scheduledAt`).

**Planning principle:** Either (A) introduce a **public intake** resource (leads/requests) later promoted to appointments by staff, or (B) extend booking to create/find **User + Pet** then real **Appointment** — product decision documented in §6.

---

## 2. Public website — Target information architecture

### 2.1 Core pages (evolve from current routes)

| Area | Route(s) | Direction |
|------|-----------|-----------|
| **Homepage** | `/` | Continue hybrid: static hero/sections + CMS blocks where valuable + blog preview from CMS. |
| **About** | `/about` | Optional CMS sections for narrative; keep structured layout. |
| **Services** | `/services`, `/services/[slug]` | Service SEO; link each service to booking with preselected service intent. |
| **Clinic overview** | `/locations` (and/or new `/clinic`) | Single-clinic vs multi-branch: if multi-branch, **clinic hub** lists branches; if single, merge “clinic” into locations + hours. |
| **Branch pages** | **New:** `/branches` or `/locations/[slug]` | Per-branch hours, map, phone, doctors assigned, booking deep link `?branchId=`. |
| **Doctor profiles** | `/doctors`, `/doctors/[slug]` | Move from static `data/doctors` to **API-driven** when ready; preserve slug URLs for SEO. |
| **Emergency** | `/emergency` | Clear triage copy; **callback request** or prominent phone — not the same as authenticated `POST /emergency`. |
| **Contact** | `/contact` | Form + NAP consistency with structured data. |
| **FAQs** | `/faqs` | Optional CMS-driven FAQ blocks later. |
| **Testimonials** | Home + optional `/testimonials` | Today: static `homepage` data; target: **CMS Testimonials** or curated reviews feed. |
| **Blog** | `/blog`, `/blog/[slug]`, filters | Already aligned with CMS public API in implementation track. |
| **Shop** | `/shop/*` | Out of scope for booking plan except shared UI/reviews patterns. |

### 2.2 Navigation and IA principles

- **Primary CTA:** Book appointment (always visible on desktop + mobile sticky where appropriate).
- **Secondary:** Emergency phone, location, login/register.
- **Breadcrumbs** on deep pages (services, doctors, branches) for SEO + orientation.

---

## 3. Booking system — Target experience

### 3.1 High-level flows

1. **Standard booking:** Landing → (optional login) → branch (if multi) → service intent → doctor preference (optional or “any”) → date → **available slots** from API → contact details → confirmation.
2. **Authenticated booking:** Pre-fill owner profile, pets list from `/pets`; choose `petId` + `doctorId` + slot → maps cleanly to internal appointment schema **when** user and pet exist.
3. **Guest booking:** Collect minimum PII + pet summary; server creates **lead** or **guest user + pet** per policy — never trust client-only slot holds.
4. **Emergency booking:** Short form (symptom, species, weight class, phone, location) + **rate limit** + optional CAPTCHA; staff triage — separate from routine slots.

### 3.2 Step-by-step UX (recommended)

| Step | UI | Server |
|------|-----|--------|
| 1. Intent | Service + visit type (consult / follow-up / vaccine) | Validate against published service catalog |
| 2. Location | Branch picker or auto if single | Load branch time zone + hours |
| 3. Provider | Doctor list filtered by branch + service | Public read of assignable doctors only |
| 4. Schedule | Calendar + slot list | Slot engine: availability rules, buffers, double-book prevention |
| 5. Pet & owner | Pet select or quick-add; guest fields | Zod validation, dedupe phone/email |
| 6. Confirm | Summary + policies | Idempotency key, confirmation reference |
| 7. Post-submit | Email/SMS handoff (future) | Audit log, staff queue |

### 3.3 Validation and anti-spam

- **Zod** on all public booking DTOs; max lengths; datetime in branch TZ.
- **Rate limiting** at edge or API (reuse auth IP limiter patterns; stricter for anonymous).
- **CAPTCHA or proof-of-work** for guest flows after abuse signals (configurable).
- **Honeypot fields** (low weight, not sole defense).
- **Idempotency-Key** header on submit to prevent double bookings on double-tap.
- **Optional email verification** before confirming high-value slots (policy).

### 3.4 API strategy (conceptual — to implement later)

- **`GET /api/v1/public/branches`** — published branches only (or single org projection).
- **`GET /api/v1/public/doctors?branchId=&serviceSlug=`** — safe subset: name, slug, photo URL, specialties, next availability summary.
- **`GET /api/v1/public/availability?branchId=&doctorId=&from=&to=`** — slot list or ics-style windows.
- **`POST /api/v1/public/booking-requests`** — guest/intake payload OR
- **`POST /api/v1/public/appointments`** — authenticated only, maps to existing appointment create after server resolves `petId`/`doctorId`/`scheduledAt`.

**Rule:** Public routes **never** reuse staff `authorize(PERMISSIONS.APPOINTMENTS_WRITE)` without a separate, minimal, audited controller.

---

## 4. Doctor profiles — Target

### 4.1 Content

- Bio, title, qualifications, specialization, **branch assignment(s)**, availability summary, **review aggregate** (when reviews exist), primary CTA (book with this doctor).

### 4.2 SEO

- Per-doctor `generateMetadata`, canonical, OG image, **`Physician`** (or `Person` + `MedicalBusiness`) JSON-LD — extend current static doctor pages when data is API-backed.

### 4.3 Data source roadmap

| Phase | Source |
|-------|--------|
| Phase 1 | Static `src/data/doctors.ts` (current) |
| Phase 2 | Read-only **public doctor** projection from API |
| Phase 3 | CMS-enriched bios (optional) with sanitization |

---

## 5. Clinic and branch pages — Target

### 5.1 Clinic overview

- Mission, facilities, accreditation (as applicable), **hours**, **NAP** matching `contactInfo` / CMS, primary services grid, doctor highlights, emergency strip.

### 5.2 Branch pages

- Address, embedded map (lazy), parking, branch-specific hours/holidays, **doctors at this branch**, CTA to book at branch.

### 5.3 Maps and location SEO

- `LocalBusiness` / `VeterinaryCare` on appropriate hub page; **GeoCoordinates** when real lat/lng available (config or DB).

---

## 6. Reviews system — Target (clinic / doctor / services)

### 6.1 As-is reference

- **Product reviews:** Shop product page uses `ProductReviews` + ecommerce API — pattern for stars, list, empty state.
- **Testimonials:** Marketing testimonials from `homepage` data and/or CMS testimonials entity.

### 6.2 Target model (conceptual)

| Entity | Submission | Moderation | Display |
|--------|--------------|------------|---------|
| **Doctor review** | Logged-in user or verified visit token | Queue + spam score; staff approve | Doctor page aggregate + paginated list |
| **Clinic review** | Same | Same | Locations / clinic hub |
| **Service review** | Optional | Same | Service detail |

### 6.3 Moderation strategy

- Default **pending** visibility; only `APPROVED` on public site.
- Report/abuse endpoint; PII stripping in public text.
- **SEO:** `AggregateRating` only when minimum review count threshold met (avoid thin or misleading rich results).

### 6.4 Backend sketch (future)

- Tables: `Review`, `ReviewTarget` (polymorphic or typed FKs), `ReviewStatus`, optional `Booking` link for verified reviews.
- Public: `GET /public/reviews?targetType=&targetId=` paginated; `POST /public/reviews` throttled.
- Admin: moderation in staff app (Larkon) or `bala-g-public-web` `/admin` only if explicitly in scope.

---

## 7. UI/UX — Principles and reuse

### 7.1 Component reuse

- **Forms:** Extend `Input`, `Select`, `TextArea`, `Button`, `FormStatusMessage`; add **stepper** wrapper (`BookingStepper`) rather than one mega-form.
- **Layout:** `PageHeader`, `Section`, `Container`, `Card`.
- **Feedback:** Loading skeletons per step (`loading.tsx` route segments); **optimistic UI** only where safe (not for final booking confirm without server ack).
- **Motion:** Keep `framer-motion` for reveals; respect `prefers-reduced-motion`.

### 7.2 Accessibility

- Visible labels, error associations, keyboard path through stepper, focus management on step change, live region for submit status.

### 7.3 Mobile-first

- Single-column step flow; sticky bottom **Continue** on small screens; tap targets ≥ 44px.

---

## 8. SEO — Unified strategy

### 8.1 Layers

1. **Global:** `metadataBase`, title template, `robots.ts`, `sitemap.ts`.
2. **Template pages:** about, contact, FAQs — static or CMS-merge metadata.
3. **Catalog:** services, doctors, branches — `generateMetadata` + JSON-LD.
4. **Editorial:** blog/CMS pages — already planned in CMS doc.
5. **Utility:** noindex for account, admin, auth recovery, checkout if required by policy.

### 8.2 Local / clinic / doctor / service

- **Local:** NAP consistency, `LocalBusiness` / `VeterinaryCare`, hours in schema where accurate.
- **Doctor:** `Physician`, canonical `/doctors/[slug]`.
- **Service:** `Service` or `MedicalWebPage` style JSON-LD when content supports it.
- **Reviews:** `AggregateRating` + `Review` snippets only when compliant with Google guidelines.

---

## 9. Technical plan (Next.js + API)

### 9.1 Route strategy (public web)

| Concern | Approach |
|---------|----------|
| **Booking** | `/appointment` as hub; optional nested routes `/appointment/schedule`, etc., **or** query-step single URL — pick one pattern to avoid duplicate URLs (SEO). |
| **Branches** | `/locations/[slug]` preferred over parallel `/branches` unless marketing wants both (then canonical one). |
| **Data fetching** | RSC for SEO-critical reads; client for stepper and slot polling; **TanStack Query** optional later for cache UX. |
| **Caching** | ISR for doctor/branch/service listings; **short revalidate** or no-store for availability; on-demand revalidation after CMS/staff changes. |

### 9.2 API integrations

- New **public** read/write modules in `backend-api` with **strict** DTOs, **no** internal Prisma leaks in responses.
- Web: thin `src/services/public-booking.ts` (or feature folder) using existing `http` / `backendFetch` patterns.

### 9.3 Security

- CSRF strategy for cookie-based sessions if introduced; today Bearer from storage — document threat model.
- **CORS** and **origin** checks on public POSTs.
- **PII minimization** on guest bookings; retention policy text in UI.

### 9.4 Performance

- Code-split heavy booking step components; lazy map iframe; image priority only on LCP hero.
- Server components for doctor/branch lists; paginate reviews.

---

## 10. Phased delivery (recommended)

| Phase | Outcome |
|-------|---------|
| **P0** | Replace simulated `AppointmentForm` with **real public intake API** (simplest: booking request stored for staff callback) + rate limit. |
| **P1** | Branch public reads + branch pages + booking branch selection. |
| **P2** | Availability endpoint + slot-based UI; authenticated path creates real `Appointment` when pet/doctor exist. |
| **P3** | Doctor data from API; reviews submission + moderation + aggregates on profiles. |
| **P4** | Emergency public intake; SMS/email notifications; staff queue integration. |

---

## 11. Risks and open decisions

| Topic | Decision needed |
|-------|-----------------|
| **Lead vs real appointment** | Guest flow almost certainly starts as **lead/request** unless you auto-provision users. |
| **Single vs multi-branch** | Drives IA and sitemap structure. |
| **Slot source of truth** | Prisma models for schedules vs external calendar — align with `doctor` schedule modules already in API. |
| **HIPAA / privacy** | Regional rules affect what can be collected on public forms; legal copy on appointment flow. |
| **Larkon vs public admin** | Moderation UI placement per safety rules. |

---

## 12. Out of scope (this plan document)

- Implementation of any route, API, or schema change.
- Third-party scheduling SaaS integration (optional future add-on).
- Payment for booking deposits (future commerce bridge).

---

## 13. Self-review checklist (before implementation)

- [ ] Architecture consistent with existing App Router and `backendFetch` patterns  
- [ ] No duplicate booking architecture (one public module, one staff module)  
- [ ] Type safety end-to-end for new DTOs  
- [ ] Responsive + accessible step flow  
- [ ] Route integrity preserved (no accidental parallel URLs)  
- [ ] SEO and structured data reviewed for new templates  
- [ ] Rate limits and abuse controls specified for every anonymous POST  

---

*End of plan — implementation begins only after explicit approval of phased scope and API contracts.*
