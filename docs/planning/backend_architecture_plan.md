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

# Backend Architecture Plan (Planning Only)

## Scope and Stack
- Project: Bala G Pet Clinic unified platform backend (clinic + ecommerce + CMS).
- Stack:
  - Node.js (LTS)
  - Express
  - Prisma ORM
  - PostgreSQL
- Modules in scope:
  1. Authentication
  2. Users
  3. Pets
  4. Doctors
  5. Appointments
  6. Emergency
  7. Ecommerce
  8. Orders
  9. Inventory
  10. CMS
  11. Notifications

## 1) Enterprise Folder Structure
- Recommended backend root: `backend/`
- Proposed structure:
  - `src/`
    - `app.ts` (Express app composition)
    - `server.ts` (bootstrap, graceful shutdown)
    - `config/`
      - `env.ts` (validated env config)
      - `constants.ts`
      - `logger.ts`
      - `security.ts` (CORS, helmet, rate limits)
    - `core/`
      - `errors/` (AppError hierarchy)
      - `middlewares/` (auth, RBAC, validation, error handler)
      - `utils/` (pagination, slug, date)
      - `types/` (shared DTO/result types)
    - `database/`
      - `prisma.ts` (singleton client)
      - `seed/`
    - `modules/`
      - `auth/`
      - `users/`
      - `pets/`
      - `doctors/`
      - `appointments/`
      - `emergency/`
      - `ecommerce/`
      - `orders/`
      - `inventory/`
      - `cms/`
      - `notifications/`
      - each module:
        - `controller.ts`
        - `service.ts`
        - `repository.ts`
        - `routes.ts`
        - `schema.ts` (validation schemas)
        - `types.ts`
        - `mapper.ts` (DB <-> DTO mapping)
    - `routes/`
      - `index.ts` (api router registry)
      - `health.ts`
    - `jobs/` (optional background processing)
    - `events/` (domain events abstraction)
  - `prisma/`
    - `schema.prisma`
    - `migrations/`
    - `seed.ts`
  - `tests/`
    - `unit/`
    - `integration/`
    - `e2e/`
  - `docs/`
    - API contracts, ERD snapshots, runbooks

## 2) Database Architecture (PostgreSQL)
- Use modular but relational-first schema with strict foreign keys.
- Key relational domains:
  - **Identity**: users, roles, permissions, sessions, refresh tokens
  - **Clinic**: pets, doctors, doctor schedules, appointments, emergency requests
  - **Commerce**: products, categories, variants, carts, orders, order items, payments (future)
  - **Inventory**: stock ledgers, stock movements, supplier refs (future extensibility)
  - **CMS**: pages, banners, blogs, testimonials
  - **Notification**: notification templates, delivery logs, user notifications
- Multi-tenancy approach (future-ready): add `clinicId` in all business tables if multi-branch is planned.
- Auditing:
  - `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on core mutable entities.
  - optional soft delete (`deletedAt`) for compliance-sensitive modules.
- Performance indexes:
  - unique: `email`, slugs, order numbers, appointment references.
  - composite: `(doctorId, appointmentDate)`, `(petId, createdAt)`, `(orderId, status)`.
  - JSON search (optional): for CMS metadata fields via `jsonb` + GIN.

## 3) Prisma Schema Strategy
- Single `schema.prisma` with bounded module sections and clear naming conventions.
- Naming standards:
  - model names singular PascalCase.
  - table mappings via `@@map` if legacy naming is needed.
  - enum usage for status/state fields.
- Recommended base model strategy:
  - shared fields copied consistently (Prisma has no inheritance).
  - helper generators for repetitive DTO typing in app layer.
- Migration discipline:
  - one migration per bounded change.
  - never edit applied migrations.
  - seed idempotent and environment-aware.
- Data consistency:
  - prefer explicit relation fields with `onDelete` behavior defined.
  - use transactions for appointment booking, order placement, stock deduction.

## 4) API Modularization Strategy (Express)
- API versioning:
  - `/api/v1/...`
- Route decomposition:
  - `modules/<module>/routes.ts` mounted centrally in `routes/index.ts`.
- Layered flow:
  - Route -> Validation middleware -> Controller -> Service -> Repository -> Prisma.
- Keep controllers thin:
  - parse request, call service, shape response.
- Services own business rules:
  - collision checks, authorization policies, transactional orchestration.
- Repository layer:
  - Prisma-only DB access, no business decisions.
- Response contract:
  - consistent envelope:
    - `success`, `data`, `error`, `meta` (pagination/tracing).

## 5) RBAC Structure
- Role models:
  - `SUPER_ADMIN`, `CLINIC_ADMIN`, `DOCTOR`, `STAFF`, `CUSTOMER`.
- Permission granularity:
  - module + action pattern (e.g. `appointments.read`, `appointments.update`).
- Authorization levels:
  - route-level (quick denial)
  - resource-level (owner/assigned-doctor checks)
- Policy examples:
  - Doctors can read/update only assigned appointments.
  - Staff can manage inventory and orders but cannot manage roles.
  - Customers can read/update only own pets/appointments/orders.
- Middleware pattern:
  - `authenticate()` -> `authorize(requiredPermissions[])` -> handler.

## 6) Validation Strategy
- Use schema-based validation (recommended: Zod or Yup) per module request DTOs.
- Validate at boundaries:
  - params, query, body.
- Validation files:
  - `modules/<module>/schema.ts`.
- Enforce:
  - strict unknown key rejection.
  - enum validation for statuses.
  - date and numeric coercion safety.
- Domain rules in service layer:
  - e.g., appointment cannot be booked in past.
  - order cannot be marked shipped if unpaid.

## 7) Scaling Strategy
- Horizontal scalability:
  - stateless API instances behind load balancer.
- Caching:
  - Redis for hot reads (catalog, CMS pages, doctor profiles), token/session lookups.
- Async processing:
  - queue for notifications, email/SMS, low-priority CMS indexing.
- Database scaling:
  - start with vertical scale, later read replicas for analytics/reporting.
- Observability:
  - structured logs + trace IDs + metrics endpoints.
- Pagination everywhere for lists:
  - cursor-based for high-volume modules (orders, notifications).

## 8) Security Strategy
- Authentication:
  - JWT access token + rotating refresh token strategy.
  - refresh token storage hashed in DB.
- Transport and HTTP security:
  - HTTPS mandatory, helmet, CORS allowlist, secure cookies for admin sessions.
- Abuse controls:
  - rate limits per route group (`auth`, `emergency`, `public APIs`).
- Input and output hardening:
  - validation, output escaping in CMS content contexts.
- Secrets:
  - env-managed, never committed.
- Audit and compliance:
  - admin action logs for sensitive changes (roles, orders, emergency status).
- Data protection:
  - encrypt sensitive fields where required (PII contact fields if policy mandates).

## 9) Module-by-Module API Surface (High-Level)
- **Authentication**
  - sign-in, refresh, sign-out, forgot/reset password, session introspection.
- **Users**
  - profile CRUD, role assignment (admin only), status management.
- **Pets**
  - pet profile CRUD, owner linkage, medical notes pointers.
- **Doctors**
  - profile CRUD, schedule management, specialization metadata.
- **Appointments**
  - booking, reschedule/cancel, status transitions, doctor assignment.
- **Emergency**
  - create urgent request, triage update, dispatch status.
- **Ecommerce**
  - categories/products listing, filters, product detail.
- **Orders**
  - cart-to-order flow, order tracking, status lifecycle.
- **Inventory**
  - stock levels, stock movements, adjustment audit trail.
- **CMS**
  - pages, banners, blog posts, testimonials moderation/publish.
- **Notifications**
  - template management, event-triggered notifications, delivery logs.

## 10) Cross-Cutting Standards
- Pagination standard:
  - `page`, `limit`, `total`, `totalPages` or cursor metadata.
- Error standard:
  - code-based errors with user-safe messages.
- Idempotency:
  - idempotency key for payment/order-like critical endpoints.
- Time handling:
  - store all timestamps UTC; convert in client.
- Slug strategy:
  - deterministic slug generation with uniqueness suffixing.

## 11) Delivery Phases (Planning Roadmap)
1. Core foundation:
   - Express app skeleton, Prisma setup, env validation, error middleware.
2. Security + auth baseline:
   - JWT + refresh flow, RBAC middleware, role/permission seed.
3. Clinic core:
   - users, pets, doctors, appointments, emergency.
4. Commerce core:
   - products, categories, orders, inventory.
5. CMS + notifications:
   - blogs/banners/testimonials/pages + notification pipeline.
6. Hardening and scale:
   - caching, queues, observability, load/perf tests.

## 12) Risk Areas and Mitigations
- Appointment race conditions -> DB transactions + unique constraints.
- Order/inventory consistency -> transaction boundaries + stock lock strategy.
- Permission leakage -> centralized policy middleware + integration tests.
- CMS misuse/XSS risk -> sanitize rich content and enforce trusted rendering.
- Schema drift -> strict migration process and CI schema checks.

## 13) Recommended Next Step (Still Planning)
- Create a follow-up document: `docs/planning/backend_prisma_entity_matrix.md` with:
  - entity list
  - field-level schema definitions
  - relation maps
  - index plan
  - enum catalog

