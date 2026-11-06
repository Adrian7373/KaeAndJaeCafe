# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Locals in Cabanatuan City (Camp Tinio area) who open the site on a phone, often on mobile data, to order Korean snacks, fried chicken meals and sweet drinks for delivery or pickup. Admin staff (Owner, Admin, Cashier, Rider) use separate portals; they are secondary to the customer storefront.

## Product Purpose
Kae & Jae Cafe is a mobile kitchen selling Korean-style snacks and chicken meals. The web app lets customers browse the menu, order with delivery or scheduled pickup, pay online (Paymongo) and track the order live. It lets the owner and staff manage the menu, orders, delivery radius and the open/closed switch. Success is a customer completing an order quickly and the kitchen receiving it instantly.

## Positioning
Korean street snacks and fried chicken meals served together from one mobile kitchen in Camp Tinio, Cabanatuan City, cooked when ordered.

## Operating Context
Mobile kitchen at Zone 3, Camp Tinio, Cabanatuan City. Open Monday to Saturday, 10:00 AM to 6:00 PM, closed Sunday. Delivery priced by distance brackets with a geofenced maximum radius; pickup can be scheduled. Contact: kaeandjae@gmail.com, Facebook page and Messenger.

## Capabilities and Constraints
- Stack: Next.js (App Router), TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage, Realtime), Leaflet/OpenStreetMap, Paymongo.
- Customer flows: menu catalog with search and categories, global cart, add-on upsells, checkout with GPS check and map pin, live order tracking at /track/[id].
- Staff flows: role-based admin (menu CRUD, orders, history, settings, password reset), master open/closed toggle.
- The landing page has a light and a dark theme; dark uses only design-system colors.
- Copy is mostly English with Korean accents; Filipino/Tagalog is acceptable in customer reviews.
- Undecided: whether menu prices are shown on the landing page.

## Brand Commitments
- Name: Kae & Jae Cafe; logo wordmark stays in Pacifico.
- kae-pink (#ee9bc1) and kae-purple (#5c0a8a) are fixed brand colors. The design system lives at /designsystem.
- Editorial typography: multiple families inside a single sentence (Fraunces, Archivo, DM Mono, Black Han Sans for hangul).

## Evidence on Hand
- Real photos: public/gallery-1..7.jpg, public/about-photo.jpg, menu category illustrations in public/*.svg, logo at public/logo.svg.
- Hero images in public/hero/ are AI-generated (Higgsfield) cutouts made at the owner's request; they are not photographs of the actual dishes.
- Reviewer photos in public/reviews/ were supplied by the owner; the review texts on the landing page are invented placeholders and must be replaced with real customer quotes. No verified ratings or prices exist to cite.
- Do not fabricate customers, ratings, prices or testimonials.

## Product Principles
1. Ordering on a phone comes first: fast, light, thumb-friendly, usable on slow data.
2. Show real food and real people; mark anything generated or placeholder.
3. Korean snacks and chicken meals are equal stars of the menu.
4. Warm and playful in tone, plain in instructions (prices, hours, fees, status).
5. The kitchen's state (open, closed, out of stock) is always honest on screen.

## Accessibility & Inclusion
Mixed-language content (English, Filipino, Korean) must render correctly; text must stay legible on small phones in bright outdoor light.
