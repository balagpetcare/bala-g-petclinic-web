# SEO master plan — Bala G Pet Clinic (`balagpetclinic.com`)

## Goals

- Establish a **single source of truth** for business facts, coordinates, review links, and primary keywords (`src/config/seo-entity.ts`, `src/config/site.ts`).
- Ship **consistent metadata** (title, description, keywords, canonical, Open Graph, Twitter) via `generatePageMetadata` in `src/config/seo.ts`.
- Emit **production JSON-LD** from reusable builders in `src/lib/seo/schemas.ts`, injected with `JsonLdScript` (`src/lib/seo/json-ld.tsx`).
- Keep **App Router** primitives as the indexing backbone: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`.

## Technical strategy

### Metadata

- `metadataBase` and defaults live in `defaultMetadata` (`src/config/seo.ts`).
- Per-route metadata uses `generatePageMetadata`, supporting:
  - `path` for canonical and `openGraph.url` when `canonical` is omitted.
  - `openGraphType: 'article'` for blog posts.
  - `noIndex` for cart, checkout, and wishlist (aligned with `robots.txt` disallow, but reinforced in HTML).

### Structured data (@graph)

- **Root layout** (`src/app/layout.tsx`): one JSON-LD script with `@graph` containing **Organization**, **WebSite** (with `SearchAction` → `/blog?q={search_term_string}`), and **VeterinaryCare** + **LocalBusiness** + **MedicalClinic** (geo, `AggregateRating`, `hasMap`, 24-hour `openingHoursSpecification`, emergency-oriented `availableService`).
- **Per page**: breadcrumbs (`BreadcrumbList`), **FAQPage** on `/faqs`, **BlogPosting** + breadcrumb on articles, **Service** + breadcrumb on service detail, **Product** + breadcrumb on shop PDP, **EmergencyService** + breadcrumb on `/emergency`, **Physician** + breadcrumb on doctor detail, **WebPage** + breadcrumb on CMS pages.

### Local SEO

- Address and phone remain in `contactInfo`; schema uses **E.164** via `toBangladeshInternationalTel`.
- **Maps**: lazy-loaded iframe embed (`localSeoEntity.mapsEmbedUrl`) plus “Open in Google Maps” (`googleMapsShareUrl`) in `ContactDetailsPanel`.
- **Reviews**: `AggregateRating` + `googleReviewUrl` in `sameAs` on Organization.

### Sitemap and robots

- **`sitemap.xml`**: static marketing routes, doctors, services, **shop categories**, CMS blogs/pages, branch locations, and **blog category query URLs** (`/blog?categorySlug=…`) when the CMS responds.
- **`robots.txt`**: allow public marketing; disallow account, admin, auth recovery, cart, checkout, wishlist, and `/system/` (see `src/app/robots.ts`).

### `next-sitemap` decision

- The project uses **Next.js MetadataRoute** (`src/app/sitemap.ts`) so dynamic CMS and branch URLs stay in one TypeScript pipeline without conflicting with a second generator.
- If you later prefer `next-sitemap`, migrate by moving the async collectors into `additionalPaths` and **remove** `src/app/sitemap.ts` to avoid duplicate `sitemap.xml` behavior on hosts where static files override routes.

### Google Search Console

1. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in production to the **meta tag** token from Search Console (see `.env.example`).
2. Keep `public/google0c09069bfa4c207e.html` if you use the **HTML file** method; if Google serves different file contents, replace the file body with the exact download from GSC.

### Performance (SEO-adjacent)

- `next.config.mjs`: `images.minimumCacheTTL` for CDN/browser caching hints on optimized images.
- Contact map: `loading="lazy"` on iframe; blog hero images keep `sizes` tuned for layout.

## Rollout checklist

- [ ] Confirm production `NEXT_PUBLIC_SITE_URL` is `https://balagpetclinic.com` (no trailing slash mismatch in canonicals).
- [ ] Submit sitemap URL in Search Console: `https://balagpetclinic.com/sitemap.xml`.
- [ ] Complete ownership verification (meta and/or HTML file).
- [ ] Validate rich results with Google’s Rich Results Test on `/`, `/faqs`, `/blog/{slug}`, `/services/{slug}`, `/shop/{slug}`.

## Risk register

| Risk | Mitigation |
|------|------------|
| CMS/API down at build time | Sitemap still emits static + catalog URLs; dynamic lists may be partial. |
| Duplicate JSON-LD types | Root graph is authoritative; page-level nodes add breadcrumbs or type-specific entities only. |
| Verification file mismatch | Replace `public/google0c09069bfa4c207e.html` with the exact file from GSC if validation fails. |
