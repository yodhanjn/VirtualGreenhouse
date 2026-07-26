# 🌿 Virtual Greenhouse — SaaS E-Commerce Platform

A next-generation multi-tenant **SaaS E-Commerce Platform** designed to revolutionize how plants are bought and sold online. Built with a modern, nature-inspired **soft light aesthetic**, **interactive 3D plant viewing**, **360° virtual nursery tours**, and **multi-shop checkout partitioning**.

---

## ✨ Key Features & Architecture

### 🪴 Interactive 3D Plant Models
- Preview plants in 3D directly in your browser using `@google/model-viewer` and WebGL.
- Orbit 360°, inspect leaf textures, and zoom in/out before making a purchase.

### 🌐 360° Virtual Nursery Tours
- Take panoramic virtual tours of partner nurseries to explore physical greenhouse layouts and plant health.

### 🎨 Soft Light Aesthetic Design
- Nature-inspired color palette: **Sage Green** (`#3A6B4E`), **Warm Cream** (`#F9FBF8`), **Mint Accent** (`#EAF2ED`), and **Soft Graphite** (`#1E293B`).
- Glassmorphism header, card depth shadows, and micro-animations with **zero neon colors**.

### 👥 Dual Multi-Tenant Roles
- **Buyer Role**: Browse catalog, filter by category (Indoor, Outdoor, Succulents, Herbs, Air-Purifying), add to cart, check out, track order status in real time, and cancel orders before shipment.
- **Seller / Nursery Role**: Dedicated seller dashboard, inventory management (Add/Edit/Delete plant listings, upload images, set 3D model paths, control stock quantity), and order management board (status updates: `Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`).

### 🛒 Multi-Shop Order Partitioning
- Checkouts containing plants from multiple nurseries are automatically partitioned into distinct, trackable orders for each seller.

### 🚚 Real-Time Order Tracking & Pre-Shipment Cancellation
- **Visual Progress Stepper**: Track order milestones from `Order Placed` to `Delivered`.
- **Pre-Shipment Cancellation**: Buyers can cancel orders while in `Pending` or `Confirmed` status. Cancelling an order automatically restores item stock to the nursery catalog.

---

## 🛠️ Technology Stack

### Backend API (`/backend`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS password hashing
- **File Uploads**: Multer middleware
- **Environment**: Dotenv & CORS

### Frontend Application (`/frontend`)
- **Framework**: React 18
- **Build Tool**: Vite (Lightning fast HMR & optimized production bundling)
- **Routing**: React Router v6
- **3D Engine**: `@google/model-viewer`
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with custom CSS variables

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yodhanjn/VirtualGreenhouse.git
cd VirtualGreenhouse
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual-greenhouse-saas
JWT_SECRET=super_secret_jwt_key_virtual_greenhouse_2026_saas
```

#### Seed Demo Data (Shops, Plants, 3D Models, & Accounts)
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```
*(Backend API will run on `http://localhost:5000`)*

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
*(Frontend application will open at `http://localhost:5173`)*

---

## 🔐 Pre-Seeded Demo Credentials

After running `npm run seed`, you can instantly log in with these test accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Buyer** | `user@example.com` | `password123` | Jane Gardener (Buyer Account) |
| **Nursery 1** | `nandanam@example.com` | `password123` | Nandanam Nursery (Seller Account) |
| **Nursery 2** | `nurserymen@example.com` | `password123` | The Nurserymen Co-op (Seller Account) |

---

## 📡 REST API Endpoint Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register new buyer account |
| `POST` | `/api/users/login` | Public | Login buyer account |
| `POST` | `/api/shops/register` | Public | Register new seller nursery |
| `POST` | `/api/shops/login` | Public | Login seller account |
| `GET` | `/api/plants` | Public | Fetch plant catalog with filters & search |
| `POST` | `/api/plants` | Seller | Add new plant listing with image upload |
| `PUT` | `/api/plants/:id` | Seller | Edit plant listing & stock |
| `DELETE` | `/api/plants/:id` | Seller | Delete plant listing |
| `GET` | `/api/cart` | Buyer | Get user cart |
| `POST` | `/api/cart/add` | Buyer | Add item to cart |
| `POST` | `/api/orders/checkout` | Buyer | Process multi-shop checkout |
| `PUT` | `/api/orders/:id/cancel` | Buyer | Cancel order prior to shipment |
| `PUT` | `/api/orders/:id/status` | Seller | Update order status (`Pending` ➔ `Delivered`) |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
