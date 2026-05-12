# Global Safety Header
- Working only in `D:\Pet Clinic\bala-g-public-web`.
- Working only in `D:\Pet Clinic\Larkon-Nextjs_v2.0.2`.
- Working only in `D:\Pet Clinic\Bala G Pet Clinic\Bala G Pet Clinic` (read-only).
- Never modify files outside these folders.
- Never touch unrelated opened applications/projects.
- Never delete existing systems unless explicitly instructed.
- Never perform global refactors outside task scope.
- Never rename root folders without approval.
- Only modify files directly related to the current task.
- Preserve scalable enterprise architecture and design consistency.
- Prefer reusable component architecture and avoid jQuery dependencies.
- Use TypeScript-safe patterns and maintain responsive behavior and SEO.
- Before coding: analyze dependencies and affected files.
- If conflicts or risks are detected, stop and explain first.
- Prefer minimal safe changes and keep code production-ready.

# Template Conversion Master Plan

## Scope and Source
- Source template (read-only): `D:\Pet Clinic\Bala G Pet Clinic\Bala G Pet Clinic`
- Target project: `D:\Pet Clinic\bala-g-public-web`
- Conversion target: Next.js App Router with Tailwind migration (TypeScript-safe)

## Dependencies and Affected Areas (Pre-Implementation Analysis)
- HTML pages: 35 static HTML pages in the template root.
- CSS: `assets/css/style.css` plus vendor/plugin CSS under `assets/css/vendor` and `assets/css/plugins`.
- JavaScript: `assets/js/main.js` plus vendor/plugin JS under `assets/js/vendor` and `assets/js/plugins`.
- Assets: images under `assets/images`, icons, fonts under `assets/fonts`.
- Pages with forms or dynamic behavior: contact form, newsletter signup, shop filters, cart/checkout UX.

## 1. Complete Page Inventory
- `index.html` (Home 1)
- `index-2.html` (Home 2)
- `about.html`
- `contact.html`
- `faq.html`
- `404-error.html`
- `blog.html`
- `blog-left-sidebar.html`
- `blog-right-sidebar.html`
- `blog-details.html`
- `blog-details-sidebar.html`
- `shop-grid.html`
- `shop-left-sidebar.html`
- `shop-right-sidebar.html`
- `shop-list-fullwidth.html`
- `shop-list-left-sidebar.html`
- `shop-list-right-sidebar.html`
- `single-product.html`
- `single-product-sale.html`
- `single-product-group.html`
- `single-product-normal.html`
- `single-product-affiliate.html`
- `single-product-slider.html`
- `single-product-gallery-left.html`
- `single-product-gallery-right.html`
- `single-product-tab-style-left.html`
- `single-product-tab-style-right.html`
- `single-product-sticky-left.html`
- `single-product-sticky-right.html`
- `cart.html`
- `checkout.html`
- `compare.html`
- `wishlist.html`
- `login-register.html`
- `my-account.html`

## 2. Reusable Section Mapping
- Global layout: header, footer, offcanvas search, cart offcanvas, mobile menu.
- Shared sections: breadcrumb area, section titles, CTA banners, newsletter block, product card grids.
- Home blocks: hero slider, banner grid, feature highlights, product carousels, product lists, brand carousel.
- Product detail blocks: image gallery, product tabs, sticky image/summary layouts, related products.
- Blog blocks: blog list cards, sidebar widgets, blog detail content with comments.
- Commerce blocks: cart table, checkout form, account/login, wishlist/compare tables.

## 3. Header/Footer Strategy
- Build shared `Header` and `Footer` components with slots for:
  - Header top (language/currency/contact) and header bottom (logo, primary nav, actions).
  - Offcanvas menus: mobile navigation, search panel, cart panel.
- Extract navigation data to a single data file for shared use in desktop and mobile menus.
- Implement header sticky behavior using CSS + lightweight JS (no jQuery).

## 4. CSS Dependency Analysis
- Primary stylesheet: `assets/css/style.css` (includes Bootstrap v5.2.3 base + custom styles).
- Vendor icon fonts: Font Awesome and Pe Icon 7 Stroke.
- Plugin CSS: Swiper, AOS, Animate.css, Nice Select, jQuery UI, Lightgallery.
- Risk: heavy reliance on Bootstrap utility and component styles within `style.css`.

## 5. JavaScript Plugin Analysis
- Core libraries: jQuery 3.6.0, jQuery Migrate, Bootstrap bundle, Modernizr.
- Plugins initialized in `assets/js/main.js`:
  - Swiper (hero, product, brand, gallery, modal sliders)
  - AOS (scroll animation)
  - Nice Select (custom select UI)
  - jQuery UI slider (price filter)
  - Lightgallery (gallery modal)
  - Theia Sticky Sidebar
  - Countdown
  - AjaxChimp (newsletter)
  - Contact form AJAX submission

## 6. jQuery Dependency Risks
- Many UI behaviors depend on jQuery selectors and plugins; direct migration requires rewriting.
- jQuery UI slider and AjaxChimp are hard dependencies in current UX.
- Sticky/offcanvas interactions must be re-implemented using React state + CSS.
- Risk of behavioral drift if plugin replacements do not match animation timings.

## 7. Asset Optimization Strategy
- Consolidate and re-export images into `public/` with Next.js Image usage for modern formats.
- Convert large PNG/JPG hero and product images to WebP where possible.
- Provide SVG for icons/logos and optimize with SVGO.
- Split icon font usage: replace with SVG sprite or React icon library to avoid font payload.
- Use `next/font` for Google Fonts instead of CSS `@import`.

## 8. Responsive Structure Analysis
- Layout uses Bootstrap grid classes (`col-*`, `row`, `container`, `container-fluid`).
- Responsive behavior depends on Bootstrap breakpoints and utility classes.
- Hero and product carousels adjust via Swiper breakpoints in JS.
- Mobile menu, offcanvas drawers, and sticky header are critical mobile interactions.

## 9. Animation Migration Strategy
- AOS data attributes drive most section animations.
- Use `framer-motion` or `@radix-ui/transition` (or CSS-only) replacements.
- Map each AOS animation type to a motion variant and enable optional disable on prefers-reduced-motion.
- Keep animation delays in data to preserve staging.

## 10. Next.js App Router Conversion Strategy
- Use `app/` with layout segments:
  - `app/(marketing)/` for home/about/contact/blog/faq
  - `app/(shop)/` for shop listings and product details
  - `app/(account)/` for login, account, wishlist, cart, checkout
- Create shared `app/layout.tsx` + nested layouts for shop/blog/account to include breadcrumb and sidebars.
- Use metadata exports for SEO and per-page titles.
- Migrate static HTML into React components with semantic markup and reusable section components.

## 11. Tailwind Migration Strategy
- Introduce Tailwind gradually: map the most repeated utilities first (spacing, typography, colors).
- Create a Tailwind theme with the template's palette and typography scale.
- Replace Bootstrap layout utilities with Tailwind grid/flex utilities.
- Use component classes for complex widgets (product card, banner, badge).
- Keep `style.css` in place during Phase 1, then remove once Tailwind coverage is complete.

## 12. SEO Architecture Recommendations
- Keep semantic headings and ARIA labels for navigation and forms.
- Implement `next/metadata` for title, description, OpenGraph, and canonical URLs.
- Use structured data for products and blog posts.
- Ensure proper sitemap and robots configuration early.
- Preserve accessible link text and alt tags for images.

## 13. Dynamic Component Opportunities
- Navigation and mega menus driven by JSON data.
- Product card grid with configurable variants (sale, list, carousel).
- Blog post list and sidebar widgets driven by content configuration.
- Reusable `SectionTitle` component with title/border/description.
- Form fields (contact, checkout, login) using shared input components.

## 14. Shared Component Strategy
- Base UI: `Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Drawer`.
- Layout: `Header`, `Footer`, `Breadcrumb`, `Section`, `Container`, `Grid`.
- Commerce: `ProductCard`, `ProductGallery`, `Price`, `Rating`.
- Blog: `PostCard`, `PostMeta`, `Author`.

## 15. Folder Architecture Recommendation
- `app/` for routes and layout.
- `components/` for shared UI and sections.
- `components/sections/` for page sections (Hero, Features, BannerGrid).
- `components/commerce/`, `components/blog/`.
- `data/` for navigation, footer, feature, banner, and product mock data.
- `public/assets/` for images and fonts (gradually move assets here).
- `styles/` for legacy CSS during migration.

## 16. Performance Optimization Plan
- Use `next/image` and static import of images.
- Code-split heavy widgets (carousels, galleries) with dynamic import.
- Replace jQuery plugins with lightweight React alternatives.
- Remove unused CSS via Tailwind purge after migration.
- Defer non-critical scripts and animations on first load.

## 17. Risk/Conflict Areas
- Bootstrap style collisions when Tailwind is introduced.
- jQuery plugin parity (Swiper, AOS, Lightgallery).
- Offcanvas and sticky header behavior differences.
- Large CSS file may cause long-term maintainability issues if not removed.
- HTML template includes hard-coded commerce logic that must be re-modeled.

## 18. Recommended Phased Implementation Order
1. Project scaffolding: App Router, base layout, global styles, fonts.
2. Shared layout: Header, Footer, mobile menu, offcanvas components.
3. Core sections: hero, banner, feature, product card, section title.
4. Home pages: `index`, `index-2` variants.
5. Static pages: About, FAQ, 404, Contact (without form handling).
6. Blog listing and details with sidebar components.
7. Shop listings with filters and product cards.
8. Product detail templates (gallery, tabs, sticky layouts).
9. Cart, checkout, account pages with form components.
10. Replace legacy JS behaviors with React components and remove jQuery.
11. Tailwind migration for remaining legacy styles and cleanup.
12. SEO validation and performance audit.
