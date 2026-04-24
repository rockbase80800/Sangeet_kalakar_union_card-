# Shop Owner Landing Page System

> "We don’t just list barber shops — we give every barber their own professional website inside our platform."

This project implements a template-controlled, editable shop landing page system for a multi-vendor barber marketplace.

## What is implemented

- Auto-provisioned landing page on shop registration (`draft` state).
- Unique shop URL slug (`/api/public/shops/:slug`).
- Owner-only content editing (no raw HTML editing).
- Platform-controlled template with structured content blocks.
- Synced sections for services, bookings, ratings, and location metadata.
- Admin controls for `suspended/live` state.

## System behavior mapping to requirements

1. **Template-first website experience**: each shop gets `classic-barber-v1` and starts editing text/media only.
2. **Registration flow**: register → landing page created → editor redirect URL returned.
3. **Editable sections**:
   - Header/basic info
   - About
   - Services visibility
   - Media gallery (up to 5 photos, 2MB each; 1 video, 10MB)
   - Location
4. **Non-editable auto-sync sections**:
   - Ratings/reviews read-only
   - Booking CTA + slot/home-service sync
5. **Page states**: `draft`, `live`, `suspended`.
6. **Access control**:
   - Owner edits only through owner routes.
   - Customers can view live pages.
   - Admin can suspend/reactivate.
7. **Data model**: structured JSON object, no raw HTML persisted.

## API overview

### Register owner + shop
`POST /api/auth/register-shop`

Body:
```json
{
  "ownerName": "Aman",
  "shopName": "Aman Fade Studio",
  "address": "Sector 21, Noida",
  "phone": "+91-9999999999"
}
```

### Owner APIs (send `x-role: owner`, `x-user-id: <ownerId>`)
- `GET /api/owner/landing-page`
- `PATCH /api/owner/landing-page/content`
- `PATCH /api/owner/landing-page/media`
- `PATCH /api/owner/landing-page/services`
- `PATCH /api/owner/landing-page/state` (`draft/live` only)

### Public API
- `GET /api/public/shops/:slug`

### Admin API (send `x-role: admin`)
- `PATCH /api/admin/landing-pages/:shopId/state` (`live/suspended`)

## Security + reliability notes

- Content sanitization strips HTML tags from user text input.
- Owners cannot modify layout/template schema.
- Public view enforces state visibility rules.
- Media limits are validated at API layer.

## Run

```bash
npm install
npm run dev
```

