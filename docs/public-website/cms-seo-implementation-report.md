# CMS and SEO — Implementation report (Bala G Pet Clinic public website)

**Date:** 2026-05-12  
**Scope:** `D:\Pet Clinic\bala-g-public-web` (Next.js App Router) aligned with `D:\Pet Clinic\backend-api` CMS APIs.  
**Safety:** Changes follow `D:\Pet Clinic\IMPORTANT SAFETY RULES.txt` (approved folders only, no duplicate architectures beyond what the product requires, semantic routes, no empty `href`).

---

## Completed features

### CMS (public consumption)

- **Blogs:** Listing with pagination, search (`q`), category chips (`categorySlug`), tag filter (`tag`), published-only data from `GET /api/v1/cms/public/blogs`.
- **Blog article:** `generateMetadata`, canonical and Open Graph image resolution, `BlogPosting` JSON-LD, featured image via `next/image`, related posts strip, sanitized HTML body.
- **Dynamic CMS pages:** `/(public)/pages/[slug]` renders structured `sections` via `SectionRenderer` plus optional main HTML body via `CmsHtmlContent`; `WebPage` JSON-LD and per-route metadata.
- **Category and tag URLs:** `/(public)/blog/category/[slug]` and `/(public)/blog/tag/[slug]` redirect to the main blog index with query parameters (single implementation, SEO-friendly URLs preserved).
- **Reusable blocks:** Existing registry (`hero`, `richText`, `cta`) in `SectionRenderer` / `CmsContent`.
- **Draft vs publish:** Public routes only expose published entities (backend responsibility); admin UI edits drafts and published content through authenticated CMS endpoints.
- **Slugs:** Blog and page URLs use CMS slugs; pages use path `/pages/[slug]`.
- **Rich text:** Server-side sanitization (`sanitize-cms-html`) before `dangerouslySetInnerHTML`; admin forms accept HTML for blogs and pages.

### Admin CMS (in-app, public web)

- **`/admin/cms`** shell with role gate (`canUseCmsUi` in `src/lib/cms/access.ts`), noindex layout metadata, navigation between sections.
- **CRUD-style tools (client + API):** Blogs, pages, banners, and media library register/delete flows using `src/services/cms-admin.ts` and staff Bearer tokens.
- **SEO management:** Per-entity SEO fields on blog and page forms (title, description, canonical path, OG image, noindex); static **SEO guide** page at `/admin/cms/seo`.
- **`/admin` entry:** Staff with portal or CMS access see appropriate copy and a link to the CMS when applicable (`src/app/(public)/admin/page.tsx`).

### SEO (site-wide)

- **`src/app/robots.ts`:** Allows public marketing; disallows account, admin, auth, cart, checkout, wishlist, and `/system/` paths; references sitemap URL.
- **`src/app/sitemap.ts`:** Static marketing routes, doctor and service detail URLs from existing data modules, plus paginated CMS blogs and published page summaries from the public CMS API (errors during generation degrade to non-CMS URLs only).
- **Structured data:** `JsonLdScript` for `BlogPosting`, `WebPage` (CMS pages), `VeterinaryCare` on homepage (`generateLocalBusinessSchema`), `Physician` on doctor detail pages.
- **Canonical URLs:** `absoluteSiteUrl` / `absolutizeMediaUrl` helpers; blog, CMS page, and doctor metadata set canonicals where applicable.
- **Open Graph / Twitter:** Continue to flow through `generatePageMetadata` with CMS overrides for image, title, and description.

### Performance and caching

- **`backendFetch`:** When `next` (ISR/revalidate) is supplied, the default `cache: 'no-store'` is omitted so Next.js no longer combines conflicting options with CMS `revalidate` fetches.
- **Homepage:** Safely tries to load the latest three published posts for `BlogPreview`; on API failure falls back to static `blogPreviews` from `src/data/homepage.ts`.
- **Images:** Hero and article imagery use `next/image` with existing `remotePatterns`; below-the-fold patterns preserved for non-priority images.

---

## Modified files (existing)

| File | Change summary |
|------|----------------|
| `src/lib/api/fetcher.ts` | Omit default `no-store` when `init.next` is set so ISR `revalidate` works without conflicting cache options. |
| `src/types/seo.ts` | Widened `StructuredData['@context']` to `string` for JSON-LD builder compatibility. |
| `src/components/home/HomeSections.tsx` | Optional `blogPreviewPosts` prop; falls back to static previews. |
| `src/app/(public)/page.tsx` | Server fetch for CMS blog preview + `JsonLdScript` for local business; try/catch for build-time API absence. |
| `src/app/(public)/blog/page.tsx` | Blog index implementation; `searchParams` bracket access for TS; removed debug footer. |
| `src/app/(public)/blog/[slug]/page.tsx` | Metadata, image URLs, JSON-LD, `absoluteSiteUrl` usage. |
| `src/app/(public)/admin/page.tsx` | CMS-capable roles, link to `/admin/cms`, adjusted access gate copy. |
| `src/app/(public)/doctors/[slug]/page.tsx` | Canonical metadata and `Physician` JSON-LD. |
| `src/services/cms-public.ts` | `fetchPublishedPages` for sitemap pagination. |

---

## New files (high level)

| Path | Role |
|------|------|
| `src/lib/seo/absolute-url.ts` | `absoluteSiteUrl`, `absolutizeMediaUrl` for metadata and media. |
| `src/lib/cms/access.ts` | `canUseCmsUi` role set for CMS shell access. |
| `src/services/cms-admin.ts` | Typed wrappers for authenticated `/cms/*` endpoints. |
| `src/app/(public)/blog/layout.tsx` | Blog segment metadata. |
| `src/app/(public)/blog/category/[slug]/page.tsx` | Redirect to filtered blog index. |
| `src/app/(public)/blog/tag/[slug]/page.tsx` | Redirect to filtered blog index. |
| `src/app/(public)/pages/[slug]/page.tsx` | Published CMS page renderer. |
| `src/app/robots.ts` | Programmatic robots.txt. |
| `src/app/sitemap.ts` | Dynamic sitemap.xml. |
| `src/app/(public)/admin/cms/layout.tsx` | noindex + wraps shell. |
| `src/app/(public)/admin/cms/_components/CmsAdminShell.tsx` | Auth + nav chrome. |
| `src/app/(public)/admin/cms/page.tsx` | CMS overview. |
| `src/app/(public)/admin/cms/blogs/page.tsx` | Blog list + create/edit form. |
| `src/app/(public)/admin/cms/pages/page.tsx` | Page list + sections JSON + SEO. |
| `src/app/(public)/admin/cms/banners/page.tsx` | Banner list + form. |
| `src/app/(public)/admin/cms/media/page.tsx` | Media list + register URL. |
| `src/app/(public)/admin/cms/seo/page.tsx` | SEO documentation for editors. |
| `docs/public-website/cms-seo-implementation-report.md` | This document. |

---

## Route structure (new or noteworthy)

| Route | Rendering | Notes |
|-------|------------|--------|
| `/blog` | Dynamic (`ƒ`) | Filters, pagination, search. |
| `/blog/[slug]` | Dynamic | Article + related posts. |
| `/blog/category/[slug]` | Dynamic | Redirects to `/blog?categorySlug=…`. |
| `/blog/tag/[slug]` | Dynamic | Redirects to `/blog?tag=…`. |
| `/pages/[slug]` | Dynamic | CMS page + sections. |
| `/admin/cms/*` | Static shell routes | Client data loading; auth via cookie hint + Bearer token. |
| `/robots.txt` | Static | From `robots.ts`. |
| `/sitemap.xml` | Dynamic | Aggregates CMS + static catalog. |

---

## SEO features delivered

- Dynamic metadata for blog posts and CMS pages (title, description, keywords, canonical, OG image, `noIndex`).
- `robots.txt` and `sitemap.xml`.
- JSON-LD: `BlogPosting`, `WebPage`, `VeterinaryCare` (home), `Physician` (doctor profile).
- Doctor profiles: explicit canonical URL in metadata.

---

## Performance improvements

- Fixed fetch caching semantics for CMS ISR (`fetcher.ts` + `cms-public` `next.revalidate`).
- Homepage resilient to offline API during prerender; falls back to static previews when the API is unreachable.
- Article hero uses `priority` on the LCP image candidate; related posts and grids remain lazy-friendly.

---

## Remaining improvements (recommended backlog)

1. **Tighten `next.config.mjs` `images.remotePatterns`:** Replace `hostname: '**'` with explicit CDN hosts in production.
2. **Shop URLs in sitemap:** Add product and category URLs from the commerce API or static catalog when stable.
3. **On-demand revalidation:** Wire a secure backend webhook to call `revalidateTag` / path revalidation after CMS publish (requires Route Handler + secret).
4. **Banner-driven home hero:** Optional server merge of `fetchPublishedBanners('home-hero')` into `HomeHero` slides.
5. **Admin UX:** Split large client forms into smaller components; add optimistic toasts; surface API validation details inline.
6. **Full-text blog search:** Upgrade from basic `q` filtering to Postgres FTS on the API when volume grows.
7. **Category/tag index pages:** Dedicated marketing copy instead of redirect-only, if SEO depth is required for each taxonomy term.

---

## Risks and issues

| Risk | Mitigation / status |
|------|---------------------|
| **RBAC drift** | `canUseCmsUi` is a frontend convenience; the API still enforces `CMS_READ` / `CMS_WRITE`. Users without permission see API errors—surface clearer messaging if needed. |
| **Windows Prisma EPERM** | If `npx prisma generate` fails on Windows file locks, retry after closing processes; backend types may use temporary `any` casts until the client regenerates. |
| **Sitemap size** | Loops cap at 30 pages × 100 rows; raise limits or add sitemap indexes if the blog exceeds a few thousand URLs. |
| **HTML authoring in admin** | Trusted-staff model; malicious HTML is sanitized on read in public components—keep admin access tightly controlled. |
| **ESLint prop-sort warnings** | New admin pages trigger `react/jsx-sort-props` warnings; build passes; align with project lint preferences in a follow-up if desired. |

---

## Deployment checklist

1. Run and apply Prisma migrations on `backend-api`; resolve any local `prisma generate` lock issues.
2. Seed non-production CMS sample content if using `prisma/seeds/cmsContent.ts`.
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` correctly in production for canonical and sitemap URLs.
4. Confirm staff users intended to edit content have CMS permissions on the API.
