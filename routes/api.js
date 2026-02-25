const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const settingsFilePath = path.join(__dirname, '..', 'data', 'settings.json');

async function getSettings() {
    try {
        const data = await fs.readFile(settingsFilePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return {
            status: 'available',
            availableFor: { freelance: true, collaboration: true, mentorship: true },
            statusMessage: 'Open for projects & conversations.',
            logoUrl: null,
            heroTagline: 'IoT Builder · Founder · Designer'
        };
    }
}

// Public site settings (for nav, hero, availability)
router.get('/settings', async (req, res) => {
    try {
        const settings = await getSettings();
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Get public works (for main website)
router.get('/works', async (req, res) => {
    try {
        const fs = require('fs').promises;
        const path = require('path');
        const dataFilePath = path.join(__dirname, '..', 'data', 'works.json');
        
        try {
            const data = await fs.readFile(dataFilePath, 'utf8');
            const works = JSON.parse(data);
            res.json({ success: true, works });
        } catch (error) {
            // If file doesn't exist, return empty array
            res.json({ success: true, works: [] });
        }
    } catch (error) {
        console.error('Error fetching works:', error);
        res.status(500).json({ error: 'Failed to fetch works' });
    }
});

// Contact form endpoint (supports both legacy and new form: name or firstName+lastName, optional phone, intent)
router.post('/contact', (req, res) => {
    const { name, firstName, lastName, email, phone, intent, message } = req.body;
    const fullName = name || [firstName, lastName].filter(Boolean).join(' ');
    
    if (!fullName || !email || !message) {
        return res.status(400).json({ 
            error: 'Name and email and message are required' 
        });
    }
    
    const payload = { name: fullName, email, message, phone: phone || '', intent: intent || '' };
    console.log('Contact form submission:', payload);
    
    res.json({ 
        success: true, 
        message: 'Thank you for your message. I\'ll get back to you soon.' 
    });
});

module.exports = router;

