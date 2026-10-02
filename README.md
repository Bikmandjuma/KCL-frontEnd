# Kigali Coffee Lab (KCL): Frontend

React + Vite + Tailwind storefront and admin panel for Kigali Coffee Lab - order
coffee, food, or a coffee machine, and apply for barista training, all with **no
customer registration**. Staff/Admin sign in separately to run the shop.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

The dev server proxies `/api` and `/uploads` to `http://localhost:4000` (the backend's
default port, see `backend/.env_example`), see `vite.config.js`. Make sure the backend
is running and seeded (`npm run seed` in the backend folder) before you start. If your
backend runs on a different port, update the proxy `target` in `vite.config.js`.

## Default staff logins (from backend seed script)

| Role    | Email                          | Password     |
|---------|---------------------------------|--------------|
| Admin   | admin@kigalicoffeelab.com        | Admin@12345   |
| Manager | manager@kigalicoffeelab.rw      | Manager@123  |

Customers never see or need this - only staff running the shop sign in, via the
small gold floating button in the bottom-right corner (or `/login` directly).

## How ordering works (no account, ever)

1. Browse Coffee, Food, or Machines - a cart and wishlist are kept in the browser's
   local storage (`src/context/CartContext.jsx`, `src/context/WishlistContext.jsx`),
   no server round-trip until checkout.
2. At Checkout, coffee/food orders ask "I'm at the shop" (pick a table, live from
   `GET /tables`) or "Ordering from home" (pickup, no table). A machine-only cart
   asks for a delivery address instead - the backend never allows food/coffee to be
   delivered, only picked up or eaten in.
3. Payment is Cash, MoMo Pay, or MoMo Code (whichever an Admin has enabled in
   Admin, Settings) - MoMo orders can upload a screenshot as proof right after
   checkout, or later from Track Order.
4. Placing an order returns a public **order code** (e.g. `KCL-482131`) - that's
   the whole "account" a customer needs. `src/pages/TrackOrder.jsx` looks any order
   up by that code and polls for status - nothing here requires a login.

## The app shell

- **Bottom tab bar** (`src/components/BottomNav.jsx`), fixed on every screen size so
  the web app behaves like the mobile app: **Menu** (home), **Coffee**, **Food**,
  **Machine** (the coffee-machine shop), **Barista** (training info + apply).
- **Admin/Staff button** (`src/components/AdminFab.jsx`), a small floating button in
  the bottom-right corner, above the tab bar - deliberately out of the way of the
  customer flow, but always there for staff.
- **Top bar** (`src/components/Navbar.jsx`) carries branding, search, the theme
  toggle, and cart/wishlist icons; a "More" menu covers About/Mission & Vision/Contact.

## Structure

- `src/context`: Auth (staff-only), Cart (guest, local), Wishlist (guest, local),
  Settings, Theme
- `src/pages`: Home, Coffee/Food (`MenuCategory.jsx`, one component, two categories),
  Shop + ProductDetail (machines), Barista + BaristaApply, Cart, Checkout, TrackOrder,
  Wishlist, About, MissionVision, Contact, Login (staff only)
- `src/pages/admin`: role-gated admin/manager panel - Dashboard, Products, Drinks
  (with a Coffee/Food type selector), Orders, Barista Training, Users and Roles,
  Settings (Cash/MoMo Pay/MoMo Code toggles)
- `src/components`: BottomNav, AdminFab, Navbar, Footer, ProductCard (auto-rotating
  photo carousel), DrinkCard (with its own add-to-cart), Pagination, CategoryDropdown,
  admin route guards
- `src/utils/idHash.js`: mirrors `backend/utils/idHash.js` exactly, so the storefront
  can build obfuscated `/product/<hash>` links locally without a round trip to the API

## Roles in the UI

- **Admin** sees every admin nav item and can create Manager/Admin accounts with
  fine-grained permissions.
- **Manager** only sees the admin sections they've been granted (`viewDashboard`,
  `manageProducts`, `manageDrinks`, `manageOrders`, `manageBarista`, `manageUsers`,
  `manageSettings`, `manageTables`).
- **Guest/Customer** has no account at all - browses, adds to a local cart/wishlist,
  checks out, tracks their order by code, and applies for barista training.

## Search and pagination

The navbar search icon opens a live search modal (machines, categories) that redirects
straight to the matching product's hashed detail page. Every admin listing has its own
search field, category filter where relevant, and a rounded pagination control.

## Themes

A theme toggle (moon/sun icon) in the navbar switches between the default coffee
theme (espresso browns + gold) and a cool blue theme, persisted in local storage
and applied via CSS variables (`src/index.css`) - so every background across the
app stays a deliberate, on-theme color rather than plain white.

## Verified this session

Booted a live backend (MariaDB + Prisma) alongside this frontend and exercised the
full guest flow through the actual Vite proxy: browsed the Coffee and Food menus,
loaded the table list, placed a dine-in coffee order (no login), tracked it by its
order code, had a logged-in Admin advance its status, and confirmed the guest saw
the update. Also verified a food pickup order (no table), a machine delivery order,
and that forcing a coffee/food order to `delivery` is correctly rejected by the
backend. `npm run build` completes cleanly.
