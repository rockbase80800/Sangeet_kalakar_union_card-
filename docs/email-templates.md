# Notification Templates

## 1) Payment Received – Pending Approval
**Subject:** Payment Received – Order Under Review

Hi {{name}},

We have received your payment proof for **₹365**.
Your card request is now in the admin verification queue.

Current Status: **Payment Received – Pending Approval**

You will receive another message as soon as verification is complete.

Thanks,  
Meri Pahal Fast Help Artists Welfare Association (TRUST)

---

## 2) Approval Success – Card Ready
**Subject:** Your Card is Ready for Download ✅

Hi {{name}},

Great news! Your payment has been verified and your card is approved.

Use the links below:
- Download Image: {{imageUrl}}
- Download PDF: {{pdfUrl}}
- Share Link: {{publicLink}}
- Share via WhatsApp: {{whatsappUrl}}

Thank you for your support.

Regards,  
Meri Pahal Fast Help Artists Welfare Association (TRUST)

---

## 3) Rejection – Retry Payment Proof
**Subject:** Payment Verification Failed – Action Required

Hi {{name}},

We were unable to verify your payment proof for order **{{orderReference}}**.

Reason: {{reason}}

Please retry with these steps:
1. Open your UPI app.
2. Ensure payment is made to the correct UPI ID.
3. Verify amount is exactly ₹365.
4. Upload a clear screenshot or PDF showing transaction details.

Need help? Contact support: +91 7073741421

Regards,  
Meri Pahal Fast Help Artists Welfare Association (TRUST)

---

## 4) Internal Admin Alert
**Subject:** New Card Order Awaiting Approval

A new order requires review.

Order ID: {{orderId}}
User: {{name}} ({{email}})
Submitted: {{createdAt}}

Please open the admin queue to approve or reject.
