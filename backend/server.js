const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

//load env variables
dotenv.config();

// Check required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

//Cookie parser
app.use(cookieParser());

//enable cors with environment variable
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//connect to database
connectDB();

require('./config/cloudinary');

// // Serve static files from uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});