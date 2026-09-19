# GitHub Copilot Agent Command — HOMESeva Commerce Platform

Copy everything below this line into GitHub Copilot Chat in **Agent mode** at the root of a new repository.

---

You are a senior full-stack architect and implementation agent. Build a production-ready, mobile-first omnichannel commerce application named **HOMESeva Online** for web, Android, and iOS.

## 1. Product goal and reference behaviour

Use these existing pages only as business/catalogue references. Do not copy their source code, theme, copyrighted text, or visual design:

- Puja services: https://homesevaonline.in/puja-booking/
- Decoration services: https://homesevaonline.in/decoration/
- Dry-fruit products: https://homesevaonline.in/product-category/products/dry-fruits/
- Spice products: https://homesevaonline.in/product-category/products/spices/
- Detailed service-booking reference: https://homesevaonline.in/product/kali-puja-%e0%ac%95%e0%ac%be%e0%ac%b3%e0%ad%80-%e0%ac%aa%e0%ad%82%e0%ac%9c%e0%ac%be-premium/

Create a cleaner, faster, modern platform that supports:

1. Scheduled services: Puja Booking and Decoration.
2. Physical goods: Dry Fruits initially, with an extensible category hierarchy for Spices, Puja Items, Flowers, Prasad, and future products.
3. One customer account, cart, checkout, payment ledger, invoice centre, notification inbox, support experience, and order history.
4. A secure admin portal for catalogue, inventory, service slots, orders, assignments, payments, invoices, coupons, banners, users, delivery and reports.

The brand must support English and Odia content through data fields and i18n. Default currency is INR. Use Indian address, GST and invoice conventions, but keep tax rules configurable.

## 2. Mandatory technology stack

Use a TypeScript monorepo and functional programming style.

- Package manager/workspaces: pnpm + Turborepo.
- Customer app: React + Vite + TypeScript, responsive PWA.
- Mobile: Capacitor wrapping the same customer React application for Android and iOS.
- Admin portal: React + Vite + TypeScript as a separate app.
- Styling: Tailwind CSS and accessible headless components; create a reusable shared design-system package.
- State/data: TanStack Query for server state and Zustand only for small local UI/cart state.
- Forms/validation: React Hook Form + Zod.
- Backend: Firebase Functions 2nd gen on Node.js 22 with TypeScript.
- Database: Cloud Firestore.
- Authentication: Firebase Authentication (phone OTP and email/password; Google optional behind configuration).
- Media/documents: Firebase Storage.
- Push: Firebase Cloud Messaging for web, Android and iOS through Capacitor-compatible integration.
- Hosting: Firebase Hosting for customer web and admin.
- Background work: Cloud Tasks and scheduled Firebase Functions where appropriate.
- Local development/testing: Firebase Emulator Suite.
- Testing: Vitest, React Testing Library, Playwright and Firebase Rules unit tests.
- CI/CD: GitHub Actions for lint, type-check, test, build, emulator integration tests and deployment.

Avoid classes for domain logic. Prefer pure functions, immutable data, discriminated unions, Result-style error values, dependency injection through function arguments, small composable modules and explicit side-effect boundaries. React functional components and hooks only.

## 3. Repository structure

Create this monorepo structure:

```text
apps/
  customer/        # responsive web/PWA + Capacitor Android/iOS shell
  admin/           # role-protected admin/operations portal
  functions/       # Firebase callable/HTTP/event/scheduled functions
packages/
  domain/          # pure entities, value objects, pricing and state transitions
  firebase/        # typed Firebase clients, converters and repositories
  ui/              # accessible reusable components and tokens
  config/          # env parsing and shared constants
  i18n/            # English/Odia translations and helpers
  testing/         # fixtures, factories and emulator helpers
firebase.json
firestore.rules
firestore.indexes.json
storage.rules
```

Keep `firebase-admin` only in server code. Never expose privileged credentials in client bundles. Provide `.env.example` files without real secrets.

## 4. Roles and authorization

Implement Firebase custom claims and server-enforced RBAC:

- `customer`: browse, book/buy, pay, review own history, download own invoices.
- `admin`: full system management.
- `catalog_manager`: catalogue, categories, images, variants, prices and inventory.
- `operations`: confirm bookings/orders, allocate staff/vendor, update fulfilment.
- `pandit`: see assigned pujas and update allowed service milestones.
- `decorator`: see assigned decoration jobs and update allowed milestones.
- `delivery_agent`: see assigned deliveries and update pickup/out-for-delivery/delivered with OTP or proof.
- `finance`: payment reconciliation, refunds, invoices and reports.
- `support`: read orders and add support notes without changing financial records.

Enforce authorization in Firestore Rules, Storage Rules and every backend function. Never rely only on hidden UI controls. Add audit logs for every privileged mutation, including actor UID, action, target, before/after summary, timestamp and request/correlation ID.

## 5. Catalogue model and mobile browsing

Create a unified `catalogItems` model with `itemType: 'SERVICE' | 'PRODUCT'` and hierarchical categories.

Each category supports: parent ID, slug, English/Odia name, icon/image, sort order, active state and SEO fields.

Each item supports: slug, SKU/service code, bilingual title and description, searchable keywords, category IDs, images, thumbnail, item type, active/published state, featured flag, tags, rating summary, configurable tax code/rate, cancellation/return policy, created/updated timestamps and optimistic version.

Service-specific fields:

- `serviceKind: 'PUJA' | 'DECORATION' | 'OTHER'`
- service area/pincodes, duration, lead time, capacity, blackout dates and available slots
- packages such as Basic, Premium and Custom with inclusions/exclusions
- optional materials, pandit/decorator requirement, venue details and customer instructions
- price or price range; configurable advance as percentage or fixed amount
- booking date, slot, address, occasion, language preference and special notes

### Detailed puja package and booking experience

Use the Kali Puja Premium page as the concrete reference for how one puja offering is configured, while improving its clarity and mobile usability. The reference includes a Premium badge, SKU, MRP/sale price and discount, bilingual title and description, package contents, selectable extras, date, hourly slot, serviceable pincode and checkout. Implement this as a reusable service-detail system for every puja rather than hard-coding Kali Puja.

The customer service-detail page must provide:

- image gallery, package badge, bilingual title, rating/review summary, SKU, category breadcrumbs and share/favourite actions
- transparent MRP, selling price, percentage saving, tax note and configurable advance due today
- short summary followed by expandable sections: significance, benefits, ideal occasions, rituals performed, preparation instructions, inclusions, exclusions, cancellation policy and FAQs
- package comparison cards or bottom sheet for Basic, Standard/Premium and Custom packages, with one clearly selected package
- an **Included in this package** section using non-interactive checkmarks; never make included items look like removable paid extras
- a separate **Optional add-ons** section using unchecked toggles/cards, each showing unit, quantity control, incremental price and details
- examples of configurable components: puja materials, pandit/purohit count and language, flowers, fruit, sweets, flower decoration, homam, Chandi Patha, Kali Yantra Puja, midnight/Amavasya surcharge and other ritual options
- instant, sticky price summary showing package price, add-ons, travel/service charge, discount, tax, grand total, advance payable and later balance; update accessibly after every choice
- `What's included` and `What you arrange` summaries before checkout
- date picker that disables blackout dates and enforces minimum lead time, followed by server-returned available slots with remaining-capacity indicators
- pincode serviceability check before enabling final booking; show supported areas or a callback/waitlist option when unavailable
- service address selector, landmark and optional map pin; do not ask for the same address again at checkout
- puja details form with devotee/customer name, gotra (optional), sankalpa/purpose (optional), preferred ritual language, participant count, venue type, accessibility notes and special instructions
- optional upload for venue/reference image with file type/size validation and explicit consent
- persistent mobile bottom bar showing total/advance and `Continue` rather than a disabled button with no explanation
- field-level validation, clear reason when Continue is disabled, preserved selections after login and safe back navigation
- a final review screen showing every selection, schedule, address, contact, cancellation terms and payable amount before payment
- post-payment confirmation with booking number, schedule, amount paid/balance, invoice/receipt, Add to Calendar, support and tracking actions

For the seeded Kali Puja example, create a Premium package with demonstration MRP ₹18,000 and selling price ₹15,000, SKU `KP-PRM`, bilingual English/Odia display, package inclusions and configurable extras inspired by the reference. Mark all values as editable seed/demo data; do not embed them as business constants.

Product-specific fields:

- variants such as 100 g, 250 g, 500 g and 1 kg
- MRP, selling price, discount display, inventory quantity, low-stock threshold, weight and dimensions
- batch/expiry fields where applicable, shipping eligibility and return eligibility

Build fast mobile-first discovery:

- home page with search, banners, featured items, popular pujas and category shortcuts
- sticky search/header and mobile bottom navigation: Home, Categories, Cart, Orders, Account
- category chips and nested category screen
- separate service and product cards, skeleton loaders, lazy images and infinite pagination
- filters for category, price, occasion, availability and rating; sort by relevance, popularity, newest, price low/high
- search suggestions and recent searches
- item detail gallery, share, favourites, package/variant selection, availability and related items
- accessible 44px minimum touch targets, keyboard support, semantic HTML, WCAG AA contrast and responsive layouts
- preserve cart locally for guests and merge safely after login

Use Firestore-friendly search for an MVP with normalized keyword/prefix fields. Encapsulate search behind an interface so Algolia/Typesense can be added later without rewriting UI.

## 6. Authentication and customer profile

Implement:

- phone OTP and email/password registration/login
- email verification, forgot password, logout-all-sessions guidance and account deletion flow
- profile with name, phone, email, language and notification preferences
- multiple saved addresses with label, recipient, phone, address lines, landmark, city, district, state, pincode and optional coordinates
- server-side role/claim synchronization
- route guards and auth-loading states without UI flicker
- optional guest browsing; require authentication before final checkout

## 7. Cart and checkout

Support product-only, service-only and mixed carts, but split fulfilment internally into fulfilment groups.

Cart requirements:

- variants/packages, quantity, add-ons, slot/date and service address
- pricing summary: items, add-ons, delivery, discount, tax, rounding and grand total
- coupon validation on the server
- server recalculation at checkout; never trust client prices
- detect stale price, inactive item, unavailable slot and insufficient inventory

Checkout flow:

1. Contact and address/venue.
2. Date/slot for every service.
3. Delivery method for products.
4. Coupon and notes.
5. Payment choice.
6. Review and place order.

Create an idempotent server-side checkout command that reserves slots/inventory in a Firestore transaction and creates one immutable order-price snapshot.

## 8. Advance and full payments

Create a payment-provider abstraction and implement Razorpay first for Indian payments. Keep Cash on Delivery configurable for eligible product orders. Do not store card details.

Support:

- full payment
- configurable service advance: percentage or fixed amount
- remaining balance with due date and `Pay balance` action
- multiple payment attempts against one order
- payment statuses: `CREATED`, `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED`, `REFUND_PENDING`, `PARTIALLY_REFUNDED`, `REFUNDED`
- server-created payment orders
- server-side signature verification
- verified, idempotent webhooks as the source of payment truth
- replay protection and raw webhook-event storage with processing status
- partial/full refunds controlled by authorization and policy
- reconciliation report and mismatch queue

Represent money as integer paise, never floating point. Store snapshots for item price, tax, discount, paid amount, balance due and refund totals.

## 9. Order, booking and delivery lifecycle

Use explicit, validated state machines. Invalid transitions must fail server-side.

Overall order states:

`DRAFT -> PENDING_PAYMENT -> CONFIRMED -> IN_PROGRESS -> COMPLETED`

Terminal/exception states: `CANCELLED`, `REFUND_PENDING`, `REFUNDED`, `PAYMENT_FAILED`.

Service fulfilment states:

`REQUESTED -> SLOT_HELD -> CONFIRMED -> ASSIGNED -> TEAM_EN_ROUTE -> SERVICE_STARTED -> SERVICE_COMPLETED`

Product fulfilment states:

`PLACED -> CONFIRMED -> PACKING -> READY_TO_SHIP -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED`

Also support `DELIVERY_FAILED`, `RETURN_REQUESTED`, `RETURN_APPROVED`, `RETURN_PICKED`, `RETURNED` where policy permits.

Requirements:

- human-friendly unique order number generated server-side
- timeline with timestamps and actor
- assignment to pandit, decorator, vendor and delivery agent
- customer-visible tracking status with private internal notes separated
- delivery OTP or proof-of-delivery image, securely stored
- estimated service/delivery time
- cancellation/refund eligibility computed by pure domain functions
- inventory decrement/reservation release and slot release implemented idempotently
- event/outbox collection so notifications and invoice work can safely retry

## 10. Invoice and documents

Generate a professional PDF invoice/receipt on the backend only after verified payment/confirmation. Store it in Firebase Storage and save metadata in Firestore.

Invoice must include configurable legal seller profile, invoice number, financial year sequence, order number, invoice date, customer/billing and service/shipping address, line items, HSN/SAC, quantity, taxable value, discount, CGST/SGST or IGST, delivery fees, total, payment history, advance received, balance due, GSTIN if configured and terms.

Requirements:

- immutable invoice snapshot and versioning for credit notes/refunds
- secure authenticated download using an authorized backend endpoint or short-lived signed URL
- never expose the Storage bucket publicly
- invoice list in customer order history and admin finance portal
- HTML email receipt and printable order summary

## 11. Notifications with FCM

Implement notification preferences and FCM token registration per user/device/platform. Store token metadata and remove invalid tokens.

Send push notifications for:

- order placed and payment success/failure
- booking confirmed or rescheduled
- staff assigned and team en route
- order packed, shipped, out for delivery and delivered
- balance payment reminder
- cancellation/refund updates
- admin low-stock alert

Also create an in-app notification inbox with read/unread state and deep links. Use Cloud Tasks/scheduled functions for retries and reminders. Do not place sensitive information in push payloads. Add an adapter interface for future email/SMS/WhatsApp providers.

## 12. Order history and account experience

Customer screens must include:

- Active Orders and Past Orders tabs
- type/status/date filters and search by order number/item
- order details, item snapshots, timeline, address, booking slot, assigned staff public details, payment ledger and balance due
- download invoice, pay remaining balance, cancel/request refund, reorder/rebook, contact support and submit review
- favourites and recently viewed
- notification inbox and preference centre

## 13. Admin and operations portal

Build a responsive desktop/tablet admin portal with dashboard metrics and role-specific navigation.

Features:

- category and catalogue CRUD, drag/sort ordering, publish/unpublish and bulk import/export CSV
- media upload with validation, progress, alt text, responsive image metadata and delete protection
- product variants, pricing, inventory ledger and low-stock warnings
- service packages, coverage areas, blackout dates, slot capacity and scheduling calendar
- order table with filters, search, details and controlled status actions
- assignment board for pandits, decorators, vendors and delivery agents
- payment attempts, webhook events, refunds, balance dues and reconciliation
- invoice view/download and credit-note workflow
- coupons/promotions with date, usage, eligibility and limit rules
- banners and featured sections
- customer/user directory and role management restricted to admin
- notification composer limited to authorized roles and explicit audience selection
- reports for sales, tax, payments, categories, cancellations, fulfilment time and inventory
- audit log viewer

### Service and puja administration

Add a dedicated visual service-package editor so non-technical administrators can manage the detailed customer experience without code changes:

- create a puja/service and bilingual SEO/content sections, image gallery, SKU, badges and category relationships
- create, clone, reorder, archive and schedule Basic/Standard/Premium/Custom packages
- package builder with base price, MRP, sale window, tax, advance rule, balance due rule, duration, lead time and cancellation policy
- inclusion builder where each row has bilingual label, description, internal cost, customer-visible status, quantity/unit and whether it is mandatory
- add-on builder with fixed/per-unit price, min/max/default quantity, dependencies, incompatibilities, capacity impact, tax and active dates
- explicitly preview which elements appear as included checkmarks versus optional paid add-ons
- content blocks for significance, benefits, ideal-for, rituals, customer preparations, exclusions and FAQs, with mobile preview
- pandit requirements: number, skill/tradition, language, gender preference only where legally and operationally appropriate, duration and internal payout
- calendar controls for weekly schedules, hourly/custom slots, slot capacity, holidays, blackout dates, festival-specific hours and midnight slots
- service-area manager supporting pincodes, zones, travel fees, minimum order, provider coverage and unavailable-area waitlist
- live price simulator that lets admin choose package/add-ons/date/pincode and verify the exact customer total, advance and balance before publishing
- draft/published/scheduled versioning with preview, maker-checker approval for price or payment-rule changes and rollback history
- prevent editing historical order snapshots when package configuration changes
- booking operations calendar/list with date, slot, location, package, add-ons, payment state, balance, assigned pandit/team and SLA alerts
- assignment suggestions based on coverage, availability, language/skills and conflicts; require human confirmation
- booking detail checklist for material procurement, flowers/fruit/sweets, staff assignment, customer confirmation, dispatch, arrival and completion
- controlled reschedule flow that rechecks slot/provider capacity, recalculates any fee, records consent and notifies the customer
- customer-contact log, internal notes, uploaded proof, incident flag and refund/cancellation decision history
- bulk actions must be limited to safe operational changes; financial, assignment and cancellation actions require individual review

Protect destructive actions with confirmation, reason capture and audit events. Prefer archive/deactivate over hard delete for referenced records.

## 14. Firestore data design

Create typed schemas, converters, repository interfaces, indexes and rules for at least:

```text
users/{uid}
users/{uid}/addresses/{addressId}
users/{uid}/devices/{deviceId}
users/{uid}/notifications/{notificationId}
categories/{categoryId}
catalogItems/{itemId}
catalogItems/{itemId}/reviews/{reviewId}
inventory/{variantId}
inventory/{variantId}/movements/{movementId}
serviceSlots/{slotId}
carts/{uid}
orders/{orderId}
orders/{orderId}/events/{eventId}
orders/{orderId}/payments/{paymentId}
invoices/{invoiceId}
coupons/{couponId}
assignments/{assignmentId}
paymentWebhookEvents/{eventId}
outbox/{eventId}
auditLogs/{logId}
appConfig/{documentId}
```

Denormalize intentionally for read performance, but make the canonical owner clear. Add composite indexes for catalogue/category/status/sort, customer orders, operations queues, assignment queries and payment reconciliation. Document query patterns and why each index exists.

Rules must enforce ownership, role permissions, immutable financial snapshots, allowed editable fields and server-only collections. Add emulator tests proving cross-user reads/writes, price tampering, role escalation, invoice access and admin-only mutations are blocked.

## 15. Backend API and functions

Implement versioned callable/HTTP functions with Zod request/response validation and structured errors. Include at least:

- `createCheckout`
- `createPaymentAttempt`
- `verifyPaymentReturn`
- `razorpayWebhook`
- `payOrderBalance`
- `cancelOrder`
- `requestRefund`
- `transitionOrder`
- `assignFulfilmentAgent`
- `registerFcmToken`
- `markNotificationRead`
- `createInvoice`
- `getInvoiceDownload`
- `submitReview`
- admin catalogue, inventory, slot, coupon and user-role commands

Use Firebase App Check for supported client calls, rate limiting for abuse-prone endpoints, idempotency keys for checkout/payment/refund operations, structured logging with correlation IDs, and secret storage through Firebase/Google Secret Manager.

## 16. UX, reliability and quality requirements

- Installable PWA with offline app shell; show cached catalogue read-only when offline and never pretend a payment/order succeeded offline.
- Capacitor configuration for Android/iOS, deep links, push permissions, app icons/splash placeholders and safe-area handling.
- Responsive images, lazy loading, pagination, code splitting and performance budgets.
- SEO for web: unique metadata, Open Graph, product/service JSON-LD, sitemap and canonical URLs.
- Error boundaries, retry UI, empty states and actionable validation messages.
- India timezone/date display configurable; store timestamps in UTC.
- No secrets, PII or payment data in logs.
- Consent-based analytics adapter with no-op default.
- Accessibility checks and meaningful test IDs only where semantic selectors are insufficient.

## 17. Seed data

Provide an idempotent emulator seed script with sample categories and items inspired by the reference business, without scraping/copying protected content:

- Puja Booking: Ganesh Puja, Satyanarayan Puja, Gruha Pravesh, Rudrabhishek
- Decoration: Marriage, Birthday, Temple, Home, Office and Car Decoration
- Dry Fruits: Cashews, Raisins, Melon Seeds and Poppy Seeds, each with sample weight variants
- Spices: Black Cardamom, Black Pepper, Nutmeg, Cumin, Carom Seeds, Green Cardamom and Cloves, each with sample weight variants

Use clearly marked demonstration prices and placeholder images. Include demo users for every role only in emulator mode.

## 18. Tests and acceptance criteria

Write unit, integration and E2E tests for critical paths:

1. Customer signs in, finds a category, selects a service package/date/slot, pays an advance and receives confirmation.
2. Customer buys a dry-fruit variant, applies a valid coupon, pays in full and tracks delivery.
3. Mixed cart creates correct fulfilment groups and immutable totals.
4. Razorpay webhook verifies signature, is idempotent and updates payment/order exactly once.
5. Customer pays the service balance and downloads the authorized invoice.
6. Operations assigns a provider; allowed roles move fulfilment through valid states only.
7. FCM/in-app notification is created from an outbox event and retry is safe.
8. Unauthorized user cannot see another customer's order/invoice or change a price/status/role.
9. Inventory and service-slot concurrency cannot oversell/overbook.
10. Cancellation/refund and invoice credit-note totals remain consistent.
11. Kali Puja Premium clearly separates included components from paid add-ons and recalculates package, advance and balance for every selection.
12. Pincode, lead-time, blackout-date and slot-capacity rules prevent an invalid service booking before payment.
13. Admin package edits require permission, price simulation matches customer checkout and existing order snapshots remain unchanged.

Set minimum coverage thresholds for domain and backend modules. Make `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:rules`, `pnpm test:e2e` and `pnpm build` available.

## 19. Required documentation

Create:

- root `README.md` with prerequisites, setup, emulator start, seed, tests, Firebase project setup, web deploy, Android build and iOS build
- `docs/architecture.md` with Mermaid context/container and checkout/order event-flow diagrams
- `docs/data-model.md` with collections, ownership, indexes and retention
- `docs/security.md` with threat model, RBAC matrix, App Check, rules, secrets and payment webhook verification
- `docs/order-state-machine.md`
- `docs/payment-and-invoice.md`
- `docs/push-notifications.md` including APNs/FCM setup for iOS
- `docs/release-checklist.md` for Play Store, App Store and web production
- Architecture Decision Records for monorepo, payment abstraction, event outbox and unified catalogue

## 20. Execution protocol

Work autonomously but incrementally:

1. Inspect the repository first and preserve existing work.
2. If empty, scaffold the monorepo and commit-ready configuration.
3. Write a short implementation plan in `docs/implementation-plan.md` with phases and checkboxes.
4. Implement a complete vertical slice before broad placeholders: auth -> catalogue -> detail -> cart -> checkout -> payment abstraction/mock -> order -> history -> admin processing -> notification -> invoice.
5. Use the Firebase emulator and a mock payment provider for automated/local tests; keep real Razorpay behind environment configuration.
6. Run formatting, lint, type-check, unit tests, rules tests, E2E smoke tests and production builds after each phase; fix failures before moving on.
7. Never claim a feature is complete if it is only a stub. Mark unfinished work explicitly in the implementation plan.
8. Do not ask routine questions. Choose secure, maintainable defaults and document them. Ask only if blocked by a business decision that changes money, tax/legal identity, payment credentials or production Firebase ownership.
9. Do not deploy, create paid cloud resources, publish mobile apps or use real payment credentials without explicit approval.

## 21. First response and first implementation milestone

In your first response:

1. Summarize the detected repository state.
2. List the architecture and milestone plan in no more than 15 bullets.
3. Identify only genuine blockers; otherwise start implementation immediately.

The first runnable milestone must include:

- monorepo, customer app, admin app and Firebase Functions app
- shared design system and functional domain package
- Firebase emulator configuration and restrictive baseline rules
- bilingual seeded categories/items
- mobile-first category catalogue and detail pages
- authentication shell
- cart supporting a service package and a product variant
- tests and setup documentation

Continue until that milestone builds and tests successfully. Then report exact commands run, results, files changed, remaining phases and any configuration values the repository owner must provide.
