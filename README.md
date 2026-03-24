# 🛒 E-Commerce Admin Dashboard (Full MVP)

A high-performance, aesthetically pleasing **Business Intelligence & Management Suite** built for modern e-commerce. This project features a robust **Laravel 11 API** and a stunning, **Glassmorphism-inspired React Frontend**.

[![Laravel](https://img.shields.io/badge/Laravel-11+-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## ✨ Features (Standard MVP)

### 📊 Dashboard & Analytics
- **Sales KPIs**: Real-time revenue, total orders, current customers, and low-stock alerts.
- **Dynamic Charts**: Interactive area charts for revenue trends and bar charts for top-selling products.
- **Recent Activity**: Quick view of the latest orders and new customer signups.

### 📦 Product Management
- **Full CRUD**: Create, view, edit, and delete products with a streamlined interface.
- **Media Handling**: Support for multiple image uploads with drag-and-drop capability.
- **Smart Filtering**: Filter by category, status (active/draft/inactive), and global search.
- **SEO & Organization**: Slug generation, SKU tracking, and "Featured" product toggles.

### 📁 Category & Brand Systems
- **Hierarchical Categories**: Parent/Child nested structures for complex catalogs.
- **Brand Identity**: Manage manufacturer logos and brand-specific filtering.

### 🛒 Sales & Orders
- **Order Tracking**: Comprehensive lifecycle management from *Pending* to *Delivered*.
- **Detailed Invoicing**: High-detail view of order line items, tax, discounts, and shipping addresses.
- **Moderation**: Review moderation system to approve or reject customer feedback with star ratings.

### ⚡ Inventory & Marketing
- **Stock Management**: Centralized inventory tracking with rapid stock updates and low-stock threshold alerts.
- **Coupon System**: Create percentage or fixed-amount discounts with usage limits and expiration dates.
- **Banners**: Manage hero sliders and promotional banners with active status and sorting.

---

## 🏗️ Technical Architecture

### **Backend (Laravel)**
- **Filament PHP**: Highly customizable admin panel for power users.
- **Sanctum Auth**: Secure, stateful API authentication for the React frontend.
- **Service-Repository Pattern**: Clean, testable code architecture separating business logic from direct DB access.
- **Migrations & Seeders**: Fully reproducible database state with one command.

### **Frontend (React)**
- **Tailwind Glassmorphism**: A modern, premium UI aesthetic with blur effects and sleek transitions.
- **TanStack Query (v5)**: Automated data fetching, caching, and background synchronization.
- **Zustand**: Lightweight, reactive state management for authentication and UI states.
- **Lucide Icons**: Crisp, professional iconography across all modules.
- **PWA**: PWA-ready with manifest and service worker support for an "App-like" feel.

---

## 🔮 Roadmap (Future Plans)
- [ ] **Real-time Notifications**: WebSockets (Pusher/Reverb) for instant order alerts.
- [ ] **Advanced Analytics**: Export sales reports to PDF/CSV/Excel.
- [ ] **Multi-language**: i18n support for global market expansion.
- [ ] **Role-Based Access (RBAC)**: Fine-grained permission controls in the React UI.
- [ ] **Customer Storefront**: A matching customer-facing React frontend (in progress).
- [ ] **Payment Gateway Integration**: Direct Stripe/PayPal integration for automated status updates.

---

## 🛠️ Local Setup

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 2. Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## ☁️ Deployment
- **API**: Deploy to Render/DigitalOcean/Forge with a managed PostgreSQL DB.
- **SPA**: Deploy to Vercel/Netlify/Cloudflare (set `VITE_API_URL` to your backend).

---

## 📄 License
MIT License - Created for High-Performance E-Commerce.
