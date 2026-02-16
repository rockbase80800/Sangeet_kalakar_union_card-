# Personalized Card Creation Web App – Implementation Plan

## 1) Product Overview
This platform enables users to create a personalized card, pay a fixed fee of **₹365 via UPI**, upload payment proof, and receive final downloadable outputs (**image + PDF**) after admin approval.

It supports:
- Optional authentication (signup/login) or guest checkout with unique tracking ID.
- Step-based card creation with live preview.
- Admin moderation queue with approve/reject actions.
- Automated email notifications.
- Final delivery and sharing (WhatsApp, email, unique link).

---

## 2) End-to-End User Journey

### A. Onboarding (Optional)
1. User chooses:
   - **Sign up / Log in**, or
   - **Continue as Guest**.
2. System issues:
   - `userId` for authenticated user, or
   - `guestToken` + unique `orderReference` for guest tracking.

### B. Card Creation Wizard

#### Step 1: Data Entry
Fields:
- Full Name
- Card Title
- Message
- Designation
- Artist Work
- Mobile No.
- Address Line 1
- Address Line 2

UX principles:
- Clear labels and placeholders.
- Inline validation and helper text.

#### Step 2: Image Upload & Live Design Preview
- Button: **Choose Image**
- Supported formats: JPG, PNG
- Tip text: *Recommended 300 DPI for print quality.*
- Real-time card preview updates as user edits text/image.

#### Step 3: Review Screen
- Shows summary of all entered details.
- Shows card preview thumbnail.
- CTA: **Proceed to Payment**.

### C. Payment Submission
- Fixed amount: **₹365**
- Shows:
  - UPI ID
  - QR code(s) for common UPI apps
- Numbered instructions:
  1. Open UPI app (Google Pay, PhonePe, etc.)
  2. Scan QR code or enter UPI ID
  3. Pay ₹365
  4. Upload payment screenshot or PDF
- Required proof upload field.
- Confirmation state: **Payment Received – Pending Approval**.

### D. Post-Approval Delivery
When admin approves:
- User gets status update + notification.
- Download actions enabled:
  - Download Image
  - Download PDF
- Share actions enabled:
  - Share via WhatsApp
  - Share via Email
  - Copy Share Link

---

## 3) Admin Workflow

### Admin Dashboard Features
- Pending order queue list.
- Filters: Pending / Approved / Rejected.
- Per order:
  - User details
  - Card preview
  - Payment proof preview/download
  - Approve / Reject actions

### Approve Flow
1. Validate payment proof.
2. Generate final card assets:
   - Print-ready image
   - PDF document
3. Persist generated file paths.
4. Trigger “approval success” notification.

### Reject Flow
1. Provide reject reason (optional but recommended).
2. Set status to `rejected`.
3. Trigger rejection notification with retry instructions.

---

## 4) Data & State Model

### Order statuses
- `draft`
- `payment_submitted`
- `pending_approval`
- `approved`
- `rejected`

### Key transitions
- `draft` -> `payment_submitted`
- `payment_submitted` -> `pending_approval`
- `pending_approval` -> `approved` OR `rejected`

---

## 5) Suggested Tech Stack
- **Frontend:** React + TypeScript + Tailwind (or Material UI)
- **Backend:** Node.js (Express/NestJS)
- **Database:** PostgreSQL
- **File storage:** S3-compatible object storage
- **Background jobs:** BullMQ / RabbitMQ / Celery equivalent
- **Auth:** JWT + role-based authorization
- **Email:** SES/SendGrid/SMTP provider
- **Card/PDF rendering:** node-canvas + pdf-lib (or headless Chromium)

---

## 6) Security & Compliance
- Auth middleware on sensitive routes.
- RBAC roles: `user`, `admin`.
- Signed URLs for private files.
- Validation for all uploads (type, size, malware scanning if available).
- Rate limiting and audit logging for admin actions.
- Encrypt sensitive data at rest where applicable.

---

## 7) Accessibility & Responsiveness
- Mobile-first responsive wizard.
- WCAG-friendly contrast and focus states.
- Label/input associations for form fields.
- Keyboard navigable stepper and action buttons.

---

## 8) CR80 ID Card Visual Design Spec (Print Ready)

### Dimensions and Output
- **Card standard:** CR80 (85.6mm × 54mm)
- **Orientation:** Landscape
- **Print resolution:** 300 DPI
- **Color mode:** CMYK
- **Rounded corners** and subtle soft-shadow for on-screen preview.

### Theme
- Modern corporate look in **navy + gold** palette.
- Soft cream textured body background.
- Subtle golden wave design in bottom-right area.

### Layout Details
1. **Top Header**
   - Dark royal blue gradient bar.
   - Golden spark decorative accents at both corners.
   - White bold uppercase organization title:
     - MERI PAHAL FAST HELP ARTISTS WELFARE ASSOCIATION (TRUST)
   - Left: circular logo (Hindi “मेरी”, torch with saffron/white/green flame, supporting text).

2. **Registration + Office Info line**
   - “Reg. by Govt. of India - 4186/2022-23”
   - “Registered Office: 43-B, Govind Watika, Jhotwara, Jaipur, Rajasthan, India - 302012”
   - Phone icon + `7073741421`

3. **Right-side QR block**
   - Square QR placeholder with premium gold border.
   - Label: **SCAN QR CODE**.

4. **Left-bottom photo area**
   - Gold-bordered rectangular frame.
   - Placeholder text: **PHOTO**.
   - Below: **DIRECTOR - VIJAY K. TIWARI**.

5. **Center detail fields**
   - ID NO: ______
   - Artist Name:
   - Designation:
   - Artist Work:
   - Mobile No.:
   - Address:
   - (Line 1)
   - (Address Line 2)

6. **Bottom strip**
   - Dark royal blue strip + golden accent line.
   - Center text: **VALID FOR 1 YEAR**.

7. **Footer note**
   - Small text: “Report Lost ID Card To: +91 7073741421”

---

## 9) Delivery Checklist
- [ ] User wizard with live preview
- [ ] UPI payment screen + required proof upload
- [ ] Admin approval queue
- [ ] Card image/PDF generation pipeline
- [ ] Download + sharing UI
- [ ] Notification templates integrated
- [ ] Full API docs and error schema
- [ ] Auth + RBAC middleware in place
