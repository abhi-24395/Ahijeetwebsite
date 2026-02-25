const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const initDataFiles = adminRoutes.initDataFiles;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Ensure data and uploads dirs exist, then start server
async function start() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        await fs.mkdir(path.join(__dirname, 'public', 'uploads'), { recursive: true });
        if (typeof initDataFiles === 'function') await initDataFiles();
    } catch (err) {
        console.error('Startup init:', err.message);
    }
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
start();

