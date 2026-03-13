"# e-commerce website with inventory management and business analysis"

# 🛒 MERN E-Commerce Platform

A full-stack **E-commerce website with inventory management and business analytics** built using the MERN stack.

## 🚀 Features

- User Authentication (Register / Login / Email Verification)
- Seller Panel
- Admin Dashboard
- Inventory Management
- Order Management
- Cart & Favorites
- Product Search
- Business Analytics
- Email Notifications

## 🧰 Tech Stack

Frontend

- React
- Tailwind CSS
- Vite

Backend

- Node.js
- Express.js

Database

- MongoDB

Authentication

- JWT

Email Service

- Twilio / Nodemailer

## 📂 Project Structure

backend/
controllers/
models/
routes/
middleware/
server.js

frontend/
src/
components/
pages/
contexts/

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/pritam-bairagi/e-commerce_website.git
cd e-commerce_website
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

## 📊 Future Improvements

- Payment Gateway Integration
- Real-time Order Tracking
- Product Recommendation System
- Advanced Business Analytics
- Multi-Vendor Marketplace

## 👨‍💻 Author

Pritam Bairagi

GitHub: https://github.com/pritam-bairagi
Contact: 01883558258
===================================================================================
ecommerce-platform
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Sale.js
│   │   └── Transaction.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils
│   │   ├── sendEmail.js
│   │   └── analytics.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
│
├── frontend
│   ├── public
│   │   ├── logo.png
│   │   └── icons
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── SearchBox.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── SellerPanel.jsx
│   │   │
│   │   ├── contexts
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
│
├── docs
│   └── API_DOCUMENTATION.md
│
├── .gitignore
├── README.md
└── package.json

