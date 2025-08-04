/**
 * Huay Tueng Thao Website API Server
 * Content Management API for JSON file operations
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API modules
const ContentAPI = require('./modules/ContentAPI');
const AdminAPI = require('./modules/AdminAPI');

// Initialize API modules
const contentAPI = new ContentAPI();
const adminAPI = new AdminAPI();

// Content update status endpoint for real-time synchronization (must be before general content routes)
app.get('/api/content/update-status/:type', adminAPI.getContentUpdateStatus.bind(adminAPI));

// Content retrieval endpoints (GET)
app.get('/api/content/:type', contentAPI.getContent.bind(contentAPI));
app.get('/api/content/:type/:section', contentAPI.getContentSection.bind(contentAPI));
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is running', 
        timestamp: new Date().toISOString() 
    });
});

// Admin authentication endpoints
app.post('/api/admin/auth/login', adminAPI.authenticate.bind(adminAPI));
app.post('/api/admin/auth/logout', adminAPI.validateSession.bind(adminAPI), adminAPI.logout.bind(adminAPI));
app.get('/api/admin/auth/session', adminAPI.validateSession.bind(adminAPI), adminAPI.getSessionInfo.bind(adminAPI));
app.post('/api/admin/auth/change-password', adminAPI.validateSession.bind(adminAPI), adminAPI.changePassword.bind(adminAPI));

// Admin dashboard endpoints
app.get('/api/admin/stats', adminAPI.validateSession.bind(adminAPI), adminAPI.getAdminStats.bind(adminAPI));
app.get('/api/admin/activity', adminAPI.validateSession.bind(adminAPI), adminAPI.getRecentActivity.bind(adminAPI));

// Admin content update endpoints (POST) - Protected
app.post('/api/admin/content/:type', adminAPI.validateSession.bind(adminAPI), adminAPI.updateContent.bind(adminAPI));
app.post('/api/admin/upload', adminAPI.validateSession.bind(adminAPI), adminAPI.uploadImage.bind(adminAPI));

// Admin backup management endpoints - Protected
app.get('/api/admin/backups/:type', adminAPI.validateSession.bind(adminAPI), adminAPI.getBackupHistory.bind(adminAPI));
app.post('/api/admin/restore/:type/:backupFile', adminAPI.validateSession.bind(adminAPI), adminAPI.restoreFromBackup.bind(adminAPI));



// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Huay Tueng Thao API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;