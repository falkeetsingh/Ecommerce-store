# E-Commerce Platform

A full-stack e-commerce platform built with React, Node.js, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure login/signup
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with quantity management
- **Wishlist**: Save favorite products for later
- **Order Management**: Complete checkout process with order history
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Redux state management for seamless UX

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Material-UI components
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for emails
- Helmet for security
- Rate limiting and CORS

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd E-Commerce_Website
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/ecommerce_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── features/          # Redux slices
│   ├── pages/             # Page components
│   ├── routes/            # Routing configuration
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
└── public/                # Static assets
```

## 🔧 Environment Variables

### Backend (.env)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: Email for sending notifications
- `EMAIL_PASS`: Email password/app password
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure email credentials
5. Set `FRONTEND_URL` to production domain

### Frontend Deployment
1. Set `VITE_API_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- File upload restrictions

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.
