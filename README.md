# Kae & Jae Cafe Web Application

A full-stack e-commerce and store management platform tailored for Kae & Jae Cafe in Cabanatuan City. This application provides a seamless ordering experience for customers, complete with dynamic delivery fee calculations, alongside a robust administrative dashboard for menu and store management.

## Tech Stack

* **Framework:** Next.js (App Router)


* **Language:** TypeScript


* **Backend / BaaS:** Supabase (PostgreSQL, Authentication, Storage)


* **Styling:** Tailwind CSS / PostCSS (`postcss.config.mjs`)


* **Maps & Geolocation:** Leaflet & OpenStreetMap (Nominatim API)
* **Linting:** ESLint (`eslint.config.mjs`)


* **Package Manager:** npm (`package.json`, `package-lock.json`)

* **Payment:** Paymongo
* **Realtime:** Supabase Realtime



---

## 🛒 Customer Storefront & Shopping

**Dynamic Menu Catalog:** Real-time text search and category filtering for seamless browsing.

**Global Cart State:** Persistent cart management utilizing React Context for instant cross-app updates.

**Strategic Upselling:** Automated "One-Click" checkout add-ons presented seamlessly before final purchase to increase Average Order Value.

**Live Order Tracking:** Dedicated tracking portals (/track/[id]) for customers to monitor their order status in real-time.

## 📍 Smart Geolocation Checkout

**Dual Fulfillment Modes:** Support for both Delivery and Pick-Up orders, featuring an interactive TimePicker for scheduling.

**Hardware GPS Enforcement:** Strict browser location verification to validate user presence and prevent spam orders.

**Precision Doorstep Pinning:** Interactive Leaflet Map integration allowing customers to drop a pin on their exact location.

**Automated Reverse Geocoding:** Integration with OpenStreetMap Nominatim to automatically translate map coordinates into pre-filled street, barangay, and city fields.

**Algorithmic Delivery Pricing:** Real-time distance calculation using the Haversine formula to map customer coordinates against store-defined pricing brackets.

**Geofence Blocking:** Automated "Out of Range" detection that disables checkout if the customer's pin falls outside the maximum delivery radius.

## 🧑‍🍳 Store Operations & Menu Management

**Live Radius Map Preview:** An interactive admin map that visually draws and scales delivery boundary circles in real-time as prices and distances are typed.

**Master Store Toggle:** An emergency "Open/Closed" switch allowing the owner to instantly block all incoming online orders during rush hours or closing time.

**Complete Menu CRUD:** Full administrative control to add, edit, archive, and delete products, categories, and pricing.

**Optimistic UI Availability Toggles:** Instant one-click switches to mark items as "Available" or "Out of Stock" without waiting for database loading screens.

**Direct Cloud Storage:** Integrated image uploading directly from the admin dashboard to Supabase Storage buckets.

## 🔐 Security & Staff Management

**Multi-Tier Role-Based Access Control (RBAC):** Distinct portals and permissions explicitly defined for Owner, Admin, Cashier, and Rider roles.

**Bulletproof Database Security:** Next.js Middleware combined with Supabase Row Level Security (RLS) policies to completely lock down unauthorized data reading, inserting, updating, or deleting.

**Server Actions:** Data mutations handled securely on the server-side to prevent client-side manipulation.

**Admin API Credential Management:** A dedicated password management dashboard utilizing the Supabase Service Role key, allowing the owner to instantly reset Cashier and Rider passwords without logging out.

## ⚡ Real-Time Sync & Live Updates

**Instant Order Dispatch:** Incoming orders instantly appear on the Cashier/Admin dashboard the exact second a customer checks out, requiring absolutely zero page refreshes.

**Live Customer Tracking:** The customer's tracking page (/track/[id]) and global ActiveOrderBanner subscribe to database changes via WebSockets (Supabase Realtime), instantly updating the UI when the store changes their order status (e.g., from "Pending" to "Preparing" to "Out for Delivery").

**Cross-Device Synchronization:** Ensures that if a cashier accepts an order on a tablet, the admin dashboard on a desktop reflects that accepted status immediately, preventing duplicate processing or missed orders.

## Snapshots

<img width="1919" height="912" alt="Screenshot 2026-10-15 213516" src="https://github.com/user-attachments/assets/adad41a2-fc25-4c8d-a2c7-52a9c28780a1" />
<img width="1916" height="914" alt="Screenshot 2026-10-15 213535" src="https://github.com/user-attachments/assets/77989a24-a475-40ca-b9de-ca8cb8b8835b" />
<img width="1919" height="912" alt="Screenshot 2026-10-15 213607" src="https://github.com/user-attachments/assets/ac657c93-92b0-4099-95ce-13ecb828e788" />
<img width="1919" height="910" alt="Screenshot 2026-10-15 213712" src="https://github.com/user-attachments/assets/0813ba57-47d5-4a55-9774-41ca23dc70ee" />
<img width="1919" height="911" alt="Screenshot 2026-10-15 213801" src="https://github.com/user-attachments/assets/e0d1133b-7d6b-407d-b740-a30a9ca7aca1" />
<img width="1919" height="912" alt="Screenshot 2026-10-15 214307" src="https://github.com/user-attachments/assets/f22aa632-2adf-4f23-b1c4-c586667b732a" />
<img width="1918" height="910" alt="Screenshot 2026-10-15 214329" src="https://github.com/user-attachments/assets/29575a8f-71e8-4b63-8abe-d6798ce99229" />
<img width="1919" height="908" alt="Screenshot 2026-10-15 214416" src="https://github.com/user-attachments/assets/4dd97034-8e5e-431b-9e99-c4478fdd225a" />
<img width="1919" height="911" alt="Screenshot 2026-10-15 214526" src="https://github.com/user-attachments/assets/a803a5cf-2382-455e-aa63-44ce37ccb358" />
<img width="1919" height="909" alt="Screenshot 2026-10-15 214550" src="https://github.com/user-attachments/assets/af9fdca0-9c04-4d9e-9db7-69e3db6dad71" />

---

*Developed by Adrian Gabriel Ablaza*
