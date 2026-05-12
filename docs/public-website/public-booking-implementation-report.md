# Public booking website — Implementation report

**Project:** Bala G Pet Clinic — `bala-g-public-web` + supporting `backend-api` public module  
**Date:** 2026-05-12  
**Scope:** Public marketing site with real booking/review/emergency intakes aligned to `docs/public-website/public-booking-website-plan.md` and `IMPORTANT SAFETY RULES.txt` (approved folders only, semantic HTML, no `href=""`, modular architecture).

---

## Completed features

### Public website

- **Homepage** — unchanged structure; navigation now surfaces Book, Clinic, and Testimonials.
- **Services** — service detail CTA deep-links to `/appointment?serviceSlug=…`.
- **Clinic** — new `/clinic` overview with branch discovery cards (API-driven when available).
- **Locations** — `/locations` lists API branches when published; retains HQ NAP + hours.
- **Branch pages** — `/locations/[slug]` with address, hours, optional Google Maps embed (`NEXT_PUBLIC_GOOGLE_MAPS_KEY`), doctor list, booking CTA, **branch reviews** + review form.
- **Doctor profiles** — `/doctors/[slug]` prefers **live API doctor** (`GET /public/doctors/slug/:slug`); falls back to static `src/data/doctors` when API has no match. Includes **approved reviews**, review submission (pending moderation), booking CTA with `?doctor=` preselect, JSON-LD `Physician` + optional `aggregateRating`.
- **Emergency** — public guest intake via `POST /public/emergency-intakes` (severity + symptoms folded into `description`); optional branch picker when multiple branches exist.
- **Contact / FAQ** — existing routes retained; testimonials cross-linked from new pages.
- **Testimonials** — curated page at `/testimonials` using `src/data/homepage` testimonials.
- **Review system** — list approved reviews + aggregates from `GET /public/reviews`; `POST /public/reviews` with honeypot; moderation is **server-side** (new rows default `PENDING` in API — staff approval workflow remains in admin/Larkon scope).

### Booking flow

- **Appointment hub** — `/appointment` uses **`BookingWizard`**: branch (if multi-branch) → doctor → slot (`GET /public/availability`) → guest **booking request** (`POST /public/booking-requests` with `Idempotency-Key`) or authenticated **`POST /public/appointments`** when user has pets.
- **Doctor / clinic / branch selection** — wired to public API; URL query params `branchId`, `doctor` (marketing slug), `serviceSlug`.
- **Date/time** — slot picker from availability API (MVP engine on backend).
- **Confirmation** — inline summary step; success shows reference / appointment id from API envelope.
- **Emergency booking** — guest `PublicEmergencyIntake` with reference number response.
- **Guest vs authenticated** — guest path uses booking request; signed-in path uses Bearer token and pet list from `GET /pets`.

### SEO

- **Metadata** — `generateMetadata` on branch pages; doctor page metadata prefers API profile.
- **Open Graph** — inherited via existing `generatePageMetadata` pattern.
- **Structured data** — `Physician` (+ optional `AggregateRating`) on API-backed doctor pages; `VeterinaryCare` + `OpeningHoursSpecification` on branch pages.
- **Local SEO** — branch NAP + hours in JSON-LD; sitemap includes `/clinic`, `/testimonials`, and **dynamic** `/locations/[slug]` from `GET /public/branches`.

### UI/UX

- Responsive step indicators, skeletons for branch loading and slot loading, accessible `aria-current="step"` on progress chips, honeypot fields on guest forms, `aria-label` on star ratings.

### Backend (supporting)

- **Typecheck clean** after fixing public review typing and `listReviews` query typing (`PublicReviewTargetType` removed from service in favor of string literals; `BranchStatus` for branch lookup).
- **Seed** — `prisma/seeds/publicClinic.ts` creates org/branch/settings/weekly hours, links seeded doctor with `marketingSlug` matching public site (`dr-veterinary-lead`), sample **approved** doctor review, demo **patient@balagpetclinic.com** + pet for authenticated booking smoke tests. Wired from `prisma/seed.ts` after development users.

---

## Implemented routes (web)

| Route | Purpose |
|--------|---------|
| `/` | Home |
| `/clinic` | Clinic overview + branch cards |
| `/locations` | HQ + branch index |
| `/locations/[slug]` | Branch detail, map, hours, doctors, reviews |
| `/appointment` | Booking wizard (query: `branchId`, `doctor`, `serviceSlug`) |
| `/doctors` | API “live” directory + deduped static profiles |
| `/doctors/[slug]` | API-first or static doctor profile + reviews |
| `/services`, `/services/[slug]` | Services; CTA passes `serviceSlug` |
| `/emergency` | Phone hero + public intake form |
| `/contact`, `/faqs`, `/testimonials` | Support / curated testimonials |
| `/blog/*`, `/shop/*`, CMS pages | Unchanged from prior CMS/ecommerce work |

---

## New / updated components

| Path | Role |
|------|------|
| `src/components/booking/BookingWizard.tsx` | Multi-step booking (guest + auth) |
| `src/components/booking/index.ts` | Barrel export |
| `src/components/reviews/PublicReviewSection.tsx` | Server: list + aggregates + embed `ReviewForm` |
| `src/components/reviews/ReviewForm.tsx` | Client: submit review |
| `src/components/reviews/StarRatingDisplay.tsx` | Accessible star row |
| `src/components/reviews/index.ts` | Barrel export |
| `src/components/maps/BranchMapEmbed.tsx` | Maps embed or fallback link |
| `src/components/ui/Skeleton.tsx` | Loading skeleton primitive |
| `src/services/public-data.ts` | Server-side `http.get` helpers for RSC |
| `src/services/public-booking-client.ts` | Client `backendFetch` helpers |
| `src/types/public-booking.ts` | Shared DTO shapes for public API |

**Updated:** `EmergencyForm`, `locations/page.tsx`, `doctors/page.tsx`, `doctors/[slug]/page.tsx`, `appointment/page.tsx`, `services/[slug]/page.tsx`, `sitemap.ts`, `config/navigation.ts`, `components/ui/index.ts`.

---

## APIs used (from web)

| Method | Path | Use |
|--------|------|-----|
| GET | `/public/branches` | Branch lists, sitemap, emergency branch picker |
| GET | `/public/branches/slug/:slug` | Branch page |
| GET | `/public/doctors` | Doctors list + wizard |
| GET | `/public/doctors/slug/:slug` | Doctor profile |
| GET | `/public/availability` | Slot picker |
| POST | `/public/booking-requests` | Guest booking (Idempotency-Key) |
| POST | `/public/emergency-intakes` | Guest emergency intake |
| GET | `/public/reviews` | Review list + aggregates |
| POST | `/public/reviews` | Submit review (pending) |
| POST | `/public/appointments` | Authenticated real appointment |
| GET | `/pets` | Authenticated pet picker |

---

## Performance optimizations

- `next: { revalidate: 60 | 120 }` on safe public GETs in `public-data.ts`; availability and doctor-by-slug use `no-store` / client fetch where freshness matters.
- Lazy map iframe (`loading="lazy"`).
- Booking wizard code-splits naturally (client-only heavy step UI).

---

## Remaining improvements

- **Staff moderation UI** for `PublicReview` (`PENDING` → `APPROVED`) in Larkon or dedicated admin (not built on public site per safety boundaries).
- **Pet list scoping** — `GET /pets` should be strictly owner-scoped server-side for all roles (security hardening).
- **Availability engine** — replace MVP weekday UTC grid with branch timezone + real `BranchSchedule` / doctor schedules + holidays.
- **Notifications** — email/SMS confirmations for booking requests and emergency intakes.
- **CAPTCHA** on high-risk anonymous POSTs if abuse appears.
- **Single branch UX** — when API returns one branch, consider hiding “branch” language entirely (partially done in wizard).

---

## Issues / risks

- **Prisma generate on Windows** — EPERM on engine binary can leave generated client stale; public repository uses a typed `db` shim for new models until `prisma generate` succeeds.
- **AggregateRating in JSON-LD** — Google prefers sufficient trusted reviews; demo seed may use a low count; tune thresholds before production rich results.
- **Authenticated booking permissions** — only roles with `appointments.write` can hit `POST /public/appointments`; demo **patient@balagpetclinic.com** is intended for CUSTOMER testing.
- **Duplicate doctor content** — `/doctors` hides static card when an API profile shares the same marketing slug to reduce duplication.

---

## Dev seed quick reference

After `npx prisma migrate deploy` and `npx prisma db seed` (when DB available):

- Branch slug: `main-clinic` (see `publicClinic.ts`).
- Doctor marketing slug: `dr-veterinary-lead`.
- Demo patient: `patient@balagpetclinic.com` / password aligned with other dev seeds in `developmentUsers` + `publicClinic` (`bg13051049` in seed file for patient).

---

*End of report.*
