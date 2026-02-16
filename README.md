# Meri Pahal Card Creation – Product Blueprint + UI Prototype

This repository now includes a complete implementation blueprint and a responsive prototype page for:
- user card creation flow,
- UPI proof-based payment submission,
- admin approval/rejection workflow,
- final download/share delivery.

## Files added
- `docs/implementation-plan.md` – full UX + workflow plan and print-ready ID card design brief.
- `docs/api-spec.md` – endpoint-by-endpoint REST API documentation with request/response/error samples.
- `docs/database-schema.sql` – PostgreSQL schema for users, orders, payments, generated files, notifications.
- `docs/email-templates.md` – email templates for payment received, approval, rejection, and admin alerts.
- `web/index.html`, `web/styles.css`, `web/app.js` – responsive visual prototype with live card detail preview.

## Run prototype
```bash
cd web
python3 -m http.server 4173
```
Then open: `http://localhost:4173`

Note: The prototype intentionally uses neutral placeholders (no cloned/real artist personal data) so only the design system is showcased.
