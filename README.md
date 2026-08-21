# Kigali Coffee Lab (KCL): Frontend

React + Vite + Tailwind storefront and admin panel for the Kigali Coffee Lab
e-commerce platform (coffee machines, drinks menu, and barista training).

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

The dev server proxies `/api` and `/uploads` to `http://localhost:5050` (the backend),
see `vite.config.js`. Make sure the backend is running and seeded (`node seed.js`
in the backend folder) before you start.

## Default logins (from backend seed script)

| Role    | Email                          | Password     |
|---------|---------------------------------|--------------|
| Admin   | admin@kigalicoffeelab.rw        | Admin@123    |
| Manager | manager@kigalicoffeelab.rw      | Manager@123  |

## Structure

- `src/context`: Auth, Cart, Settings, Theme (global state via React Context)
- `src/pages`: storefront pages, Home, Shop, Product, Services (drinks and barista
  training), Barista Apply, Mission and Vision, Contact, Cart, Checkout, Auth, My
  Orders, Wishlist
- `src/pages/admin`: role-gated admin/manager panel, Dashboard, Products, Drinks,
  Orders, Barista Training, Users and Roles, Settings
- `src/components`: shared UI, Navbar (with search modal and theme toggle), Footer,
  ProductCard (auto-rotating photo carousel), DrinkCard, Pagination, CategoryDropdown,
  route guards
- `src/utils/idHash.js`: mirrors `backend/utils/idHash.js` exactly, so the storefront
  can build obfuscated `/product/<hash>` links locally without a round trip to the API

## Roles in the UI

- **Admin** sees every admin nav item and can create Manager/Admin accounts with
  fine-grained permissions.
- **Manager** only sees the admin sections they've been granted (`viewDashboard`,
  `manageProducts`, `manageDrinks`, `manageOrders`, `manageBarista`, `manageUsers`,
  `manageSettings`).
- **Guest/Client** shops, adds to wishlist/cart, checks out (COD, manual proof of
  payment, MTN Mobile Money, or Visa/Card once enabled), uploads payment proof, cancels
  their own pending orders from My Orders, applies for barista training, and leaves
  product reviews.

## Search and pagination

The navbar search icon opens a live search modal (machines, categories) that redirects
straight to the matching product's hashed detail page. Every admin listing, Products,
Drinks, Orders, Users and Roles, and Barista applications, has its own search field,
category filter where relevant, and a rounded pagination control.

## Themes

A theme toggle (moon/sun icon) in the navbar switches between the default coffee
palette and a cool blue/light theme, powered entirely by CSS variables, so both the
guest storefront and the logged-in admin panel always look consistent with each other.
The choice is remembered across visits.

## Payments

MTN Mobile Money (with a real MoMo Pay number and merchant code) and Visa/Credit Card
(Stripe) are fully wired into the Checkout UI, but stay hidden until an Admin turns them
on from Admin, Settings, Payment Method. Until then, clients use Cash on Delivery or
"call, pay, then upload proof".

## Build for production

```bash
npm run build   # outputs to dist/
```

This build was verified to complete with zero errors during development of this project.
