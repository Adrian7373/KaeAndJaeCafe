# Kae & Jae Cafe - Ordering System

A modern, full-stack web application built to streamline online ordering, delivery, and secure payments for a local cafe. This project serves as a comprehensive e-commerce solution for the business.

## 🌐 Live Application

You can view the live production site here: [Kae and Jae Cafe](https://kaeandjaecafe.vercel.app/)

## 🚀 Tech Stack

* **Framework:** Next.js (App Router) & React


* **Styling:** Tailwind CSS & PostCSS


* **Backend & Database:** Supabase (PostgreSQL) & Next.js Server Actions


* **State Management:** React Context API (`CartContext.tsx`)


* **Payment Gateway:** PayMongo API (GCash & Cash on Delivery)

## ✨ Key Features

* **Interactive Digital Menu:** Dynamic rendering of cafe offerings including Rice Meals, Burgers, Sandwiches, Corndogs, and Nachos with high-quality visual assets.


* **Real-time Cart Management:** Utilizes a custom global `CartContext` to handle complex order logic, quantity adjustments, and pricing calculations.


* **Geolocation Verification:** Integrates browser Geolocation APIs to verify customer coordinates, ensuring delivery accuracy and fraud prevention.
* **Secure Payment Routing:** Implements server-side payment generation via PayMongo for secure, streamlined GCash transactions.
* **Webhook Integration:** Automatically synchronizes payment statuses between PayMongo and the Supabase database to track order fulfillment.

## 👨‍💻 Author

**Made with ❤️ by Adrian Ablaza**
