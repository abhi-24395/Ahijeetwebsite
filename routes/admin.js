const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const bcrypt = require('bcrypt');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
        // Create directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true }).then(() => {
            cb(null, uploadDir);
        }).catch(err => cb(err));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'));
        }
    }
});

// Data file paths
const dataFilePath = path.join(__dirname, '..', 'data', 'works.json');
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
const settingsFilePath = path.join(__dirname, '..', 'data', 'settings.json');

// Ensure data directory exists
async function ensureDataDir() {
    const dataDir = path.join(__dirname, '..', 'data');
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Initialize data files
async function initDataFiles() {
    await ensureDataDir();
    
    // Initialize works.json if it doesn't exist
    try {
        await fs.access(dataFilePath);
    } catch {
        await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
    }
    
    // Initialize users.json if it doesn't exist
    try {
        await fs.access(usersFilePath);
    } catch {
        const defaultPassword = await bcrypt.hash('Abjeeth1', 10);
        const defaultUser = {
            username: 'abhi24395',
            password: defaultPassword
        };
        await fs.writeFile(usersFilePath, JSON.stringify([defaultUser], null, 2));
    }
    // Initialize settings.json if it doesn't exist
    try {
        await fs.access(settingsFilePath);
    } catch {
        const defaultSettings = {
            status: 'available',
            availableFor: { freelance: true, collaboration: true, mentorship: true },
            statusMessage: 'Open for projects & conversations.',
            logoUrl: null,
            heroTagline: 'IoT Builder · Founder · Designer'
        };
        await fs.writeFile(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

// Admin login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'login.html'));
});

// Admin dashboard
router.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'dashboard.html'));
});

// Login API
router.post('/login', async (req, res) => {
    try {
        await initDataFiles();
        
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);
        
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.authenticated = true;
        req.session.username = username;
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout API
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get all works
router.get('/works', async (req, res) => {
    try {
        await initDataFiles();
        const data = await fs.readFile(dataFilePath, 'utf8');
        const works = JSON.parse(data);
        res.json({ success: true, works });
    } catch (error) {
        console.error('Error reading works:', error);
        res.status(500).json({ error: 'Failed to fetch works' });
    }
});

// Add new work
router.post('/works', requireAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        await initDataFiles();
        
        const { title, description, category, tags, link } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
        
        const data = await fs.readFile(dataFilePath, 'utf8');
        const works = JSON.parse(data);
        
        const newWork = {
            id: Date.now().toString(),
            title,
            description,
            category: category || 'General',
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            link: link || '',
            image: req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : null,
            video: req.files && req.files.video ? `/uploads/${req.files.video[0].filename}` : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        works.unshift(newWork); // Add to beginning
        
        await fs.writeFile(dataFilePath, JSON.stringify(works, null, 2));
        
        res.json({ success: true, work: newWork });
    } catch (error) {
        console.error('Error adding work:', error);
        res.status(500).json({ error: 'Failed to add work' });
    }
});

// Update work
router.put('/works/:id', requireAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        await initDataFiles();
        
        const { id } = req.params;
        const { title, description, category, tags, link } = req.body;
        
        const data = await fs.readFile(dataFilePath, 'utf8');
        const works = JSON.parse(data);
        
        const workIndex = works.findIndex(w => w.id === id);
        
        if (workIndex === -1) {
            return res.status(404).json({ error: 'Work not found' });
        }
        
        const work = works[workIndex];
        
        // Update fields
        if (title) work.title = title;
        if (description) work.description = description;
        if (category) work.category = category;
        if (tags) work.tags = tags.split(',').map(t => t.trim());
        if (link !== undefined) work.link = link;
        
        // Update media files if new ones are uploaded
        if (req.files && req.files.image) {
            // Delete old image if exists
            if (work.image) {
                const oldImagePath = path.join(__dirname, '..', 'public', work.image);
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            work.image = `/uploads/${req.files.image[0].filename}`;
        }
        
        if (req.files && req.files.video) {
            // Delete old video if exists
            if (work.video) {
                const oldVideoPath = path.join(__dirname, '..', 'public', work.video);
                try {
                    await fs.unlink(oldVideoPath);
                } catch (err) {
                    console.error('Error deleting old video:', err);
                }
            }
            work.video = `/uploads/${req.files.video[0].filename}`;
        }
        
        work.updatedAt = new Date().toISOString();
        
        await fs.writeFile(dataFilePath, JSON.stringify(works, null, 2));
        
        res.json({ success: true, work });
    } catch (error) {
        console.error('Error updating work:', error);
        res.status(500).json({ error: 'Failed to update work' });
    }
});

// Get site settings (admin)
router.get('/settings', requireAuth, async (req, res) => {
    try {
        await initDataFiles();
        const data = await fs.readFile(settingsFilePath, 'utf8');
        const settings = JSON.parse(data);
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error reading settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update site settings (admin) + optional logo
router.post('/settings', requireAuth, upload.single('logo'), async (req, res) => {
    try {
        await initDataFiles();
        let settings = {};
        try {
            const data = await fs.readFile(settingsFilePath, 'utf8');
            settings = JSON.parse(data);
        } catch {
            settings = {
                status: 'available',
                availableFor: { freelance: true, collaboration: true, mentorship: true },
                statusMessage: 'Open for projects & conversations.',
                logoUrl: null,
                heroTagline: 'IoT Builder · Founder · Designer'
            };
        }
        if (req.body.status) settings.status = req.body.status;
        if (req.body.statusMessage !== undefined) settings.statusMessage = req.body.statusMessage;
        if (req.body.heroTagline !== undefined) settings.heroTagline = req.body.heroTagline;
        if (req.body.availableFor !== undefined) {
            try {
                settings.availableFor = typeof req.body.availableFor === 'string' ? JSON.parse(req.body.availableFor) : req.body.availableFor;
            } catch (e) {}
        }
        if (req.file) {
            if (settings.logoUrl) {
                const oldPath = path.join(__dirname, '..', 'public', settings.logoUrl);
                try { await fs.unlink(oldPath); } catch (err) {}
            }
            settings.logoUrl = '/uploads/' + req.file.filename;
        }
        await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Delete work
router.delete('/works/:id', requireAuth, async (req, res) => {
    try {
        await initDataFiles();
        
        const { id } = req.params;
        
        const data = await fs.readFile(dataFilePath, 'utf8');
        const works = JSON.parse(data);
        
        const workIndex = works.findIndex(w => w.id === id);
        
        if (workIndex === -1) {
            return res.status(404).json({ error: 'Work not found' });
        }
        
        const work = works[workIndex];
        
        // Delete associated files
        if (work.image) {
            const imagePath = path.join(__dirname, '..', 'public', work.image);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }
        
        if (work.video) {
            const videoPath = path.join(__dirname, '..', 'public', work.video);
            try {
                await fs.unlink(videoPath);
            } catch (err) {
                console.error('Error deleting video:', err);
            }
        }
        
        works.splice(workIndex, 1);
        
        await fs.writeFile(dataFilePath, JSON.stringify(works, null, 2));
        
        res.json({ success: true, message: 'Work deleted successfully' });
    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ error: 'Failed to delete work' });
    }
});

module.exports = router;

