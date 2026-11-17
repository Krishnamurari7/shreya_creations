# Shreya Student Store

This store uses the site's existing Supabase project, Supabase Auth, `admins` membership, `courses`, `batches`, and `student_registrations`. The old boutique `/shop` and Razorpay endpoint are separate.

## Database

Migrations:

- `20261117132129_student_store_foundation.sql`
- `20261117132152_student_store_transactions.sql`
- `20261117134201_student_store_catalog_reports.sql`

All 22 `store_*` tables have RLS. Published catalog metadata is public read only. Carts and orders have owner scoped reads. Internal stock, payments, delivery rules and settings have no browser grants. Trusted server routes use `SUPABASE_SERVICE_ROLE_KEY` after checking the current Auth user or existing admin role. Private Storage buckets `store-images` and `store-documents` are accessed through short lived signed URLs.

## Admin setup

1. Open `/admin/student-store` with an existing admin account.
2. Review the five navigation categories. Add real products, variants, SKU, price in paise and an explicit tax rate. Stock starts at zero; record received stock in Inventory with a source note. Upload real product images and alt text.
3. Create a draft kit linked to a real course, add component variants and quantities, then publish it. Kit availability derives from each variant's shared stock.
4. The owner can link an Auth user to an admitted registration when their emails match. Admission records without a real course cannot be linked. Student discounts apply only to these verified links.
5. The owner enters an accurate pickup address and hours, or active PIN specific delivery rules with verified charges/tax. Then enable the corresponding offline payment and delivery flags in Store settings. Every flag starts off.
6. Test with real authorized accounts and approved sellable catalog records before accepting customer orders. Do not turn on public shopping or discounts without a reviewed policy.

Only institute pickup with payment on collection, or configured home delivery with cash on delivery, can place orders. The server transaction recomputes prices, discount, tax, delivery and stock, then deducts shared variant stock atomically. A repeat idempotency key returns the existing order. Fulfillment and payment states are separate. Owners can attest collected offline payment with a real reference and verification note. The store does not claim a payment was made until that attestation occurs.

Online gateway checkout is disabled. The site's older `/api/razorpay/create-order` accepts client supplied amounts and must not be used for this store. To enable online payment, add server created provider orders, signed webhook verification, amount/currency checks, idempotent event processing, expiring stock reservations, and a reviewed refund flow first.

Receipts are private PDF documents attached to a real order by the owner and downloaded through a user or admin authorization check. There is no automated invoice generator or refund automation. Sold product and kit rows are archived, not deleted; historical order item snapshots remain intact.

Catalog search, price sorting and pagination run in a server-only SQL function. Admin report totals use a server-only aggregate function with optional India-time date boundaries; they are not calculated from a capped list of visible orders.

## Verification

The migrations were exercised inside a rolled back SQL transaction: combined product and kit demand exceeding shared stock was rejected; an exact stock order succeeded with authoritative totals; replaying its idempotency key returned the same order; cancellation restored stock once. The transaction also confirmed anonymous users cannot read orders or call checkout and authenticated users cannot insert orders directly. No synthetic product, kit, order or stock was left in production.
After applying the schema, a separate rolled back test confirmed an authenticated user can read their own order and cannot read another user's order.
