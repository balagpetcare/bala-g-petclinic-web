# SEO implementation report — Bala G Pet Clinic

## Summary

This iteration implements an enterprise-style SEO layer on the Next.js 14 App Router frontend: centralized local business facts, enriched `generatePageMetadata`, sitewide JSON-LD `@graph`, page-level breadcrumbs and type-specific schema, FAQ rich snippets, improved sitemap coverage, `noIndex` on transactional pages, Google Maps embed on contact, Search Console verification hooks, and performance-related image caching.

## Files added

| Path | Purpose |
|------|---------|
| `src/config/seo-entity.ts` | Maps URLs, coordinates, rating/review counts, primary keywords, embed URL. |
| `src/lib/seo/schemas.ts` | JSON-LD builders: root graph, breadcrumbs, FAQ, emergency service, service, product; legacy `generateLocalBusinessSchema`. |
| `src/lib/seo/index.ts` | Barrel exports for SEO utilities. |
| `src/app/(public)/faqs/FaqsPageClient.tsx` | Client UI for FAQs (split from server `page.tsx` for metadata + JSON-LD). |
| `public/google0c09069bfa4c207e.html` | HTML file verification stub (replace with GSC download if required). |
| `src/components/seo/index.ts` | Thin re-export of `JsonLdScript` for UI-level imports. |

## Files materially changed

- **`src/config/seo.ts`** — Richer `generatePageMetadata` (OG URL, locale, siteName, image dimensions, Googlebot snippet hints, canonical from `path`); default keywords merge with `localSeoEntity.primaryKeywords`; optional `verification.google` from env; re-exports schema helpers.
- **`src/config/site.ts`** — Copy and `locale: en_BD` for Bangladesh-oriented Open Graph.
- **`src/types/seo.ts`** — `PageSEO.path`, `openGraphType`; relaxed `LocalBusinessSchema['@type']`.
- **`src/lib/seo/json-ld.tsx`** — Wider prop typing for `@graph` payloads.
- **`src/app/layout.tsx`** — Injects `JsonLdScript` with `buildRootJsonLdGraph()`.
- **`src/app/sitemap.ts`** — Shop category routes; CMS blog category query URLs; fixed `collectPublishedBlogEntries` wrapper.
- **`src/app/(public)/page.tsx`** — Metadata via `generatePageMetadata`; removed duplicate local-business script (handled in root graph).
- **Public marketing routes** — `path` (and where relevant `noIndex`, `openGraphType`, or JSON-LD) on home, services, doctors, appointment, emergency, contact, about, clinic, testimonials, locations, shop, shop PDP/category, blog article, CMS pages, legal pages, cart/checkout/wishlist.
- **`src/components/contact/ContactDetailsPanel.tsx`** — Google Maps iframe + outbound Maps link.
- **`src/data/faqs.ts`** — Hours answer aligned with 24-hour emergency positioning.
- **`next.config.mjs`** — `images.minimumCacheTTL`.
- **`.env.example`** — `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

## Removed

- `src/app/(public)/faqs/layout.tsx` — redundant with server `faqs/page.tsx` metadata.

## `next-sitemap`

Not added as an npm dependency. **`src/app/sitemap.ts`** remains the single generator to avoid duplicate or conflicting `sitemap.xml` with `public/`. Rationale is documented in `docs/SEO_MASTER_PLAN.md`.

## Environment

- `NEXT_PUBLIC_SITE_URL` — canonical base.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — populates `metadata.verification.google`.

## Build verification

- `npm run type-check` — pass.
- `npm run build` — pass (Next.js 14.2.x).
