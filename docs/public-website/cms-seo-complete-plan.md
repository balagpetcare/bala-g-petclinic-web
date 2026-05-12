# CMS & SEO — Complete planning document (Bala G Pet Clinic public website)

**Status:** Planning only — no implementation in this deliverable.  
**Scope:** Bala G Pet Clinic platform with focus on **`D:\Pet Clinic\bala-g-public-web`** (Next.js App Router public site), aligned with **`D:\Pet Clinic\backend-api`** (CMS domain + APIs).  
**Safety:** Aligns with `D:\Pet Clinic\IMPORTANT SAFETY_RULES.txt` (no duplicate architectures, preserve route integrity, hydration-safe patterns, semantic HTML, no `href=""`, App Router discipline).

---

## 1. Current architecture (as-is analysis)

### 1.1 Public website (`bala-g-public-web`)

| Area | Current state |
|------|----------------|
| **App Router** | Route groups: `(public)` (Header/Footer chrome), `(auth)` (minimal shell), root `layout.tsx` with fonts, theme bootstrap script, `AppProviders`. |
| **Metadata** | Root `defaultMetadata` in `src/config/seo.ts` (`metadataBase`, title template, keywords, Open Graph, Twitter, robots, icons, manifest, default canonical). Per-route: static `metadata` or `generatePageMetadata(PageSEO)`; shop/doctors/services use `generateMetadata` for slugs. |
| **SEO types** | `src/types/seo.ts`: `PageSEO` (title, description, keywords, image, noIndex, canonical), `LocalBusinessSchema`, generic `StructuredData`. |
| **Structured data** | `generateLocalBusinessSchema()` in `src/config/seo.ts` (VeterinaryCare) — not yet wired as JSON-LD on every page (implementation TBD). |
| **Homepage** | `src/app/(public)/page.tsx` — light metadata; body is `HomeSections` (client) pulling **static** data from `src/data/homepage.ts` (hero, services, doctors, products, testimonials, **blog preview**). |
| **Blog (UI)** | `BlogPreview` links to `/blog` and post `href`s from static data — **no `src/app/.../blog` routes** found; risk of 404 until blog segment exists. |
| **Reusable UI** | `components/ui` (Container, Heading, Text, Button, Input, etc.), `components/layout` (Header, Footer, MobileNav), `components/home/*`, `components/motion`, ecommerce blocks under `components/ecommerce`. |
| **Images** | `next.config.mjs`: `remotePatterns` https `**`, AVIF/WebP, deviceSizes/imageSizes — ready for CMS/CDN URLs once constrained for production. |
| **Security headers** | `X-DNS-Prefetch-Control`, `X-Content-Type-Options`, `Referrer-Policy` on all routes. |
| **Middleware** | Auth hint redirect for `/account`, `/admin` only — no CMS-specific rules. |
| **API layer** | Centralized `src/lib/api/http.ts` + `backendFetch` — pattern established for shop/health; **no dedicated CMS service module** in public web yet. |

### 1.2 Backend (`backend-api`)

| Area | Current state |
|------|----------------|
| **Prisma CMS models** | `CmsPage`, `Banner`, `BlogPost`, `Testimonial` — `ContentStatus` (DRAFT / PUBLISHED / ARCHIVED). `BlogPost`: title, slug, content, excerpt, coverImage, **author (string)**, **tags (string[])** — no separate Category/Tag tables yet. |
| **HTTP API** | `GET/PATCH` under `/api/v1/cms/...` — list + get by **`:id`** for pages/blogs/banners/testimonials; writes require `authenticate` + `authorize(CMS_WRITE)`. **Public reads are unauthenticated** for GET list/detail today — suitable for server-side public fetches if filtered to `PUBLISHED` only. |
| **Slug** | Created server-side via `generateSlug(title)` on create; updates should define policy for slug stability (plan below). |

### 1.3 Admin CMS UI

- **Separate project:** `D:\Pet Clinic\Larkon-Nextjs_v2.0.2` (per safety rules) — admin dashboard, media, and draft/publish UX should live there or in a dedicated admin surface, **not** duplicated inside the public marketing app beyond read-only previews if needed.

### 1.4 Gaps (drivers for this plan)

1. **Data source split:** Marketing pages mix config + local TS data; CMS DB/API is not yet the source of truth for homepage sections, blog, or dynamic pages.  
2. **Blog route missing** vs UI linking to `/blog`.  
3. **No `robots.ts` / `sitemap.ts`** (or equivalent) observed in `src/app` for programmatic SEO files.  
4. **Public consumption by slug:** Backend get-by-id is awkward for public URLs; prefer **`GET .../by-slug/:slug`** or query param with strict `PUBLISHED` filter and caching headers.  
5. **Rich content:** DB `content` is string — HTML vs MD vs JSON blocks should be decided with sanitization and XSS policy.  
6. **Categories:** Not in Prisma for blogs — only `tags[]`; categories require schema + API + UI plan.

---

## 2. CMS system (target architecture)

### 2.1 Blog architecture

- **Content model (evolution):** Keep `BlogPost` as core; add optional **`BlogCategory`** (or `categoryId` + join) and **`BlogTag`** many-to-many if filtering and SEO landing pages need first-class tags (vs string array only).  
- **API:** Public: list published posts (paginated, sort by `publishedAt`), single post by **slug**. Admin: full CRUD under existing permission model (`CMS_WRITE` / future `CMS_PUBLISH`).  
- **Rendering:** Next.js routes `/(public)/blog`, `/(public)/blog/[slug]` — server component data fetch + MDX/HTML sanitizer pipeline (see §7).  
- **Author:** Phase 1: string field; Phase 2: optional `User` / `Author` FK for byline + `Person` schema.org.

### 2.2 Page builder structure (pragmatic phases)

- **Phase A (structured sections):** Define a **JSON schema** for “page sections” (hero, rich text, CTA, testimonial strip, FAQ accordion, banner slot) stored in `CmsPage` (new column e.g. `sections Json?`) **or** separate `CmsSection` table with `pageId`, `type`, `payload`, `sortOrder`. Renders through a **registry** of React section components (type-safe map).  
- **Phase B (visual builder):** Admin-only UI in admin project outputs the same JSON — public site never embeds an authoring iframe (security + simplicity).  
- **Avoid:** Full freeform DOM from untrusted users without sanitization.

### 2.3 Dynamic pages

- **Route:** `/(public)/p/[slug]` or `/(public)/pages/[slug]` — single dynamic segment resolving `CmsPage` where `status === PUBLISHED`.  
- **Draft:** Never routable on public hostname; preview uses **short-lived signed token** or admin-only preview route in admin app (recommended), not public guessable URLs.

### 2.4 Reusable section blocks

- Map block types to existing primitives: `Container`, `Heading`, `Text`, `Button`, `Accordion` (FAQs), `Image` (next/image).  
- New folder proposal: `src/components/cms/sections/*` — one file per block type + shared `SectionRenderer.tsx`.

### 2.5 Banner management

- Fetch `Banner` where `status === PUBLISHED` and `startsAt`/`endsAt` window valid; expose **slot** concept (e.g. `slot: 'home-hero' | 'home-top'`) — requires **DB migration** adding `slot` (or reuse `sortOrder` + naming convention initially).  
- **Carousel:** Compose multiple banners in homepage data loader vs single image hero.

### 2.6 Hero sections & homepage management

- **Short term:** Server loader in `page.tsx` (or small server component wrapper) fetches homepage payload: hero slides (from CMS or hybrid fallback to `data/homepage` during migration).  
- **Long term:** Homepage becomes **ordered block list** from CMS; static `homepage.ts` deprecated or used as fallback only when API empty.

### 2.7 Media handling

- **Storage:** S3-compatible or existing CDN URLs stored as strings in DB; **never** store binary in Postgres for scale.  
- **Next.js:** Use `next/image` with **`images.remotePatterns`** tightened to known hostnames (replace `**` in production).  
- **Upload:** Admin API (separate upload service or presigned URL) — out of scope for public-only doc but listed as dependency.

### 2.8 Image optimization

- Enforce width/height or aspect ratio on section schema; use `priority` only for LCP hero; lazy load below-fold.  
- Blur placeholders: optional `blurDataURL` in section payloads for hero.

### 2.9 Draft / publish workflow

- Align with `ContentStatus`: public API returns **only `PUBLISHED`** for anonymous callers; admin uses PATCH to transition DRAFT → PUBLISHED, sets `publishedAt` (already partially implemented in `cms.service.ts`).  
- **Cache:** On publish, revalidate Next tags or ISR paths (see §7).

### 2.10 Slug generation

- **Rules:** Unique globally per entity; on title change, **optional** slug update with redirect table for SEO (future `SlugRedirect` model) or “lock slug after publish” policy.  
- **Collision:** API returns validation error; admin UI surfaces conflict.

### 2.11 Content validation

- **Zod** on API (extend existing `cms/schema`); max lengths for title/excerpt; HTML allowlist if storing HTML.  
- **Client:** Mirror critical checks in admin forms only; public site trusts API output shape.

### 2.12 SEO content support

- Extend models or section JSON with: `seoTitle`, `seoDescription`, `ogImageOverride`, `canonicalPath`, `noIndex` — either columns on `CmsPage` / `BlogPost` or nested `seo` object in JSON with migration path.

---

## 3. SEO system (target architecture)

### 3.1 Metadata architecture

- **Layering:** Keep `defaultMetadata` as global fallback; **merge** per-route `generateMetadata` with CMS-provided fields where applicable.  
- **Helpers:** Extend `generatePageMetadata` or add `mergeSeo(base, cmsSeo)` to avoid duplicated OG/Twitter shapes.

### 3.2 Dynamic SEO metadata

- **Blog post / CMS page:** `generateMetadata` async: fetch by slug, map to `Metadata` + defaults when fields missing.

### 3.3 Open Graph & Twitter

- Already centralized patterns in `seo.ts` — ensure every dynamic route supplies `openGraph.url` as **absolute** URL using `metadataBase` + path.

### 3.4 Canonical URLs

- `PageSEO.canonical` supported — enforce construction `${siteConfig.url}${path}` for dynamic routes to avoid duplicates (www/non-www handled at DNS + single canonical policy).

### 3.5 `robots.txt`

- Add `src/app/robots.ts` (Next metadata API): allow public marketing; **disallow** `/account`, `/admin`, `/login`, `/register`, `/system/connectivity` (or similar non-indexable paths) consistent with existing `robots: { index: false }` on those layouts.

### 3.6 `sitemap.xml`

- Add `src/app/sitemap.ts` — static paths (home, about, contact, services index, etc.) + **dynamic** entries from CMS (published pages, blogs) and from existing catalog routes (products, doctors) if stable URLs exist.

### 3.7 Dynamic sitemap generation

- Segment sitemaps if URL count > 50k (future): `sitemap/[id].xml` pattern or single sitemap with pagination per Google guidelines.

### 3.8 Schema.org

- **LocalBusiness / VeterinaryCare:** Emit JSON-LD on homepage or `locations` using `generateLocalBusinessSchema()` + opening hours from `site.ts`.  
- **Physician:** Doctor detail pages — `Physician` or `Person` + `MedicalBusiness` linkage where accurate.  
- **BlogPosting:** Article schema on blog posts with headline, image, datePublished, author.  
- **BreadcrumbList:** For nested routes (services, shop, blog).

### 3.9 Local business & clinic SEO

- NAP consistency: `contactInfo` vs CMS — single source of truth decision (config vs CMS `BranchSettings` from backend) to avoid drift.

### 3.10 Doctor SEO

- Already have `doctors/[slug]/generateMetadata` — extend with doctor-specific OG image, bio excerpt, and `Physician` JSON-LD when data comes from API instead of static files.

### 3.11 Blog SEO

- Article meta, reading time (optional), tag pages `noIndex` or index based on thin-content policy.

### 3.12 Performance SEO & Core Web Vitals

- **LCP:** Hero image priority, font `display: 'swap'` (already).  
- **CLS:** explicit dimensions on images in CMS payloads.  
- **INP:** minimize client JS on content pages; prefer RSC for blog/page bodies.

### 3.13 Lazy loading

- `next/image` lazy by default; below-fold galleries and related posts lazy; **no** lazy for LCP candidate.

### 3.14 Structured data strategy

- Central `src/lib/seo/jsonLd.ts` builders + `JsonLd` server component injecting `<script type="application/ld+json">` with safe serialization.

---

## 4. Blog system (target features)

| Feature | Approach |
|---------|----------|
| **Categories** | New Prisma model + FK on `BlogPost` + category landing `/(public)/blog/category/[slug]`. |
| **Tags** | Normalize tags table or keep `tags[]` with generated slug pages — decide for deduplication and SEO. |
| **Author** | String now; optional Author profile later. |
| **Featured image** | `coverImage` + `next/image`. |
| **Related posts** | API query: same category/tags, exclude current, limit N. |
| **Search** | Phase 1: query param `?q=` + server search on title/excerpt; Phase 2: Postgres full-text or external search. |
| **Pagination** | Cursor or offset — align with backend `pagination` types already used elsewhere. |
| **SEO rendering** | RSC + `generateMetadata` + `Article` JSON-LD. |
| **Rich text** | MDX with allowlist, or sanitized HTML (DOMPurify on server); **never** raw `dangerouslySetInnerHTML` from CMS without pipeline. |

---

## 5. Page management

- **Dynamic CMS pages:** Single catch-all or dedicated `[slug]` under `pages` or `p` prefix.  
- **SEO fields:** As in §2.12.  
- **Banners / CTA / testimonials / FAQs:** Section blocks or dedicated models already partially exist (`Banner`, `Testimonial`); FAQs currently static under `/(public)/faqs` — optional migration to CMS-driven FAQ model later.  
- **Reusable layout sections:** Compose with `(public)/layout.tsx` + optional per-route `layout.tsx` for blog index sidebars.

---

## 6. Admin CMS (outside public web)

- **Dashboard:** Larkon / admin app — metrics, queues, publish queue.  
- **CRUD:** Already backed by `/cms/*` writes — extend with publish-only permission (`CMS_PUBLISH`) if separation needed between author and publisher.  
- **Media library:** New module (upload, list, delete) with storage backend — RBAC permissions `CMS_WRITE` or finer.  
- **Banner manager / SEO manager:** Admin UI forms bound to same API + validation.  
- **Draft/publish:** Status transitions + optional scheduled publish (`publishedAt` in future).

---

## 7. Technical architecture (Next.js App Router)

### 7.1 Rendering strategy

| Content type | Strategy |
|--------------|----------|
| **Homepage (CMS-driven)** | **ISR** (e.g. `revalidate: 300`) or on-demand `revalidateTag('homepage')` after publish. |
| **Blog list / posts** | ISR or SSR with cache headers; high-traffic posts can be ISR with tag per slug. |
| **CMS static pages** | ISR by slug + tag `cms-page-${slug}`. |
| **Shop / doctors** | Existing patterns extended — avoid regressing ecommerce. |

### 7.2 Caching

- **Next:** `fetch` with `next: { tags, revalidate }` wrapping public CMS fetches.  
- **CDN:** Cache-Control for immutable assets; short TTL for HTML if needed.  
- **Backend:** Optional ETag on public CMS GET endpoints.

### 7.3 Route structure (proposal)

```
src/app/(public)/
  page.tsx                    # Home — optional RSC data loader
  blog/
    page.tsx                  # Listing + pagination
    [slug]/page.tsx           # Article
    category/[slug]/page.tsx  # If categories exist
  pages/[slug]/page.tsx       # OR p/[slug] — CMS pages
  ...existing static routes...
  robots.ts
  sitemap.ts
```

Preserve **existing** `(auth)`, `(public)`, `shop`, `doctors`, etc. — **additive** routes only.

### 7.4 Reusable components

- `components/cms/` — `SectionRenderer`, `BlogCard`, `BlogProse`, `BannerSlot`, `JsonLd`.  
- `services/cms.service.ts` (or `lib/api/cms.ts`) — typed wrappers using `http.get` only for public-safe endpoints.

### 7.5 API architecture

- **Public site:** Server-only fetch for CMS (no secrets); filter `PUBLISHED`.  
- **New backend endpoints (recommended):** `GET /cms/pages/slug/:slug`, `GET /cms/blogs/slug/:slug`, optional `GET /cms/home` aggregated payload — keeps public web simple and cacheable.  
- **Versioning:** Stay under `/api/v1`.

### 7.6 Validation & permissions

- Public reads: **read-only**, rate-limited at edge or API gateway if abuse appears.  
- Writes: existing `authenticate` + `authorize` — add publish audit log entries (optional).

### 7.7 Security

- **HTML injection:** Sanitize all rich text at render or store time.  
- **Preview tokens:** Signed JWT or opaque token with short TTL.  
- **CORS:** Backend already restricts origins — ensure public site origin allowed for client-side calls if any; prefer server fetch to avoid exposing CMS to browser.  
- **Do not** expose draft content on anonymous list endpoints — enforce `where: { status: 'PUBLISHED' }` in repository for public-facing service layer.

---

## 8. UI/UX

- **Responsive / mobile-first:** Continue tokenized Tailwind patterns; section blocks must be tested at 320px+.  
- **Accessibility:** Landmark regions (`main`, `article`, `nav`), heading hierarchy from CMS rules, focus states on interactive cards, reduced-motion respect for Framer Motion (`prefers-reduced-motion`).  
- **Loading / error:** `loading.tsx` and `error.tsx` for `blog` segment; skeletons for listing.  
- **Animation:** Keep motion subtle on content pages; prefer CSS for above-fold to reduce JS.

---

## 9. Deliverables summary

### 9.1 Implementation phases

| Phase | Scope |
|-------|--------|
| **0 — Foundation** | `robots.ts`, `sitemap.ts`, JSON-LD for homepage; tighten `remotePatterns`; fix `/blog` dead link (stub or real listing). |
| **1 — Read API & types** | Backend public-safe slug endpoints + published-only service; public `cms` API client + types. |
| **2 — Blog** | Routes, RSC data, pagination, basic SEO + Article schema. |
| **3 — CMS pages** | Dynamic `[slug]`, section renderer v1 (hero + rich text + CTA). |
| **4 — Homepage CMS** | Migrate `HomeSections` data sources to API with ISR + fallback. |
| **5 — Banners & testimonials** | Wire to API; homepage slots. |
| **6 — Categories / tags / search** | Schema migrations + index pages + search. |
| **7 — Admin parity** | Larkon: media library, SEO forms, preview, publish workflow. |

### 9.2 Affected folders (public web)

- `src/app/(public)/` — new `blog`, optional `pages` or `p`, `robots.ts`, `sitemap.ts`.  
- `src/components/cms/` — **new**.  
- `src/services/` or `src/lib/api/` — CMS fetch helpers — **new or extend**.  
- `src/types/` — CMS DTOs + SEO extensions.  
- `src/config/seo.ts` — merge helpers, optional JSON-LD export helpers.

### 9.3 New folders

- `docs/public-website/` — this document (ongoing specs).  
- `src/components/cms/`  
- Optionally `src/lib/seo/` for json-ld + sitemap builders.

### 9.4 Reusable components

- `SectionRenderer`, block components, `BlogCard`, `ProseContent`, `JsonLd`, `ContentStatusBadge` (admin), `Pagination`.

### 9.5 Database changes (backend)

- Optional: `CmsPage.seoTitle`, `seoDescription`, `ogImage`, `noIndex`, `sections` JSON.  
- `BlogPost.categoryId` + `BlogCategory` table; optional `BlogTag` M2M.  
- `Banner.slot`, `Banner.branchId` (if multi-branch).  
- `SlugRedirect` (oldSlug, newSlug, entityType) — SEO preservation.  
- Media table (id, url, mime, size, altText, createdBy) — if not using pure object storage keys only.

### 9.6 Migration requirements

- Prisma migrations for any new columns/tables; backfill scripts for slug uniqueness; reindex sitemap after migration.

### 9.7 Risks

| Risk | Mitigation |
|------|------------|
| XSS via CMS HTML | Strict sanitize + CSP headers (future). |
| SEO duplicate content | Canonical + single slug policy. |
| ISR stale content | Webhook or admin “Purge cache” → `revalidatePath`. |
| `remotePatterns` `**` | Lock down before production. |
| Tight coupling public↔admin | Contract-first types shared or OpenAPI-generated types. |

### 9.8 Performance considerations

- Minimize client components on blog/CMS pages.  
- Tag-based revalidation over long `revalidate` for fresher content.  
- Image CDN + correct sizes; avoid huge inline JSON in sections.

---

## 10. Sign-off criteria (for a future implementation epic)

- [ ] All public CMS content is `PUBLISHED`-only for anonymous access.  
- [ ] `/blog` and `/blog/[slug]` render with correct metadata and JSON-LD.  
- [ ] `robots.txt` and `sitemap.xml` reflect real routes.  
- [ ] No hydration warnings on CMS-driven pages.  
- [ ] Lighthouse SEO score targets met on homepage + sample blog (team-defined threshold).  
- [ ] Admin workflows documented and RBAC-tested (`CMS_READ` / `CMS_WRITE` / `CMS_PUBLISH` as designed).

---

*Document version: 1.0 — planning only, aligned with existing Bala G Pet Clinic repositories as analyzed.*
