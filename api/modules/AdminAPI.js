/**
 * Admin API Module
 * Handles POST requests for content updates and file management
 */

const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const DataValidator = require('../utils/DataValidator');
const APIResponse = require('../utils/APIResponse');

class AdminAPI {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data');
        this.backupPath = path.join(__dirname, '../../data/backups');
        this.uploadPath = path.join(__dirname, '../../uploads');

        // Admin credentials (in production, use proper authentication)
        this.adminCredentials = {
            'admin': 'huaytueng2024!',
            'manager': 'manager2024!'
        };

        // Active sessions storage
        this.activeSessions = new Map();

        // Ensure directories exist
        this.ensureDirectories();

        // Configure multer for file uploads
        this.upload = multer({
            dest: this.uploadPath,
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB limit
            },
            fileFilter: (req, file, cb) => {
                // Allow only image files
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(new Error('Only image files are allowed'), false);
                }
            }
        });

        this.contentTypeFiles = {
            'homepage-carousel': 'homepage-carousel.json',
            'homepage-featured': 'homepage-featured.json',
            'homepage-gallery': 'homepage-gallery.json',
            'homepage-news': 'homepage-news.json',
            'homepage-services': 'homepage-services.json',
            'homepage-updates': 'homepage-updates.json',
            'history': 'history-content.json',
            'services': 'services-content.json',
            'contact': 'contact-content.json',
            'about': 'about-content.json',
            'navigation': 'navigation.json',
            'footer': 'footer.json'
        };
    }

    /**
     * Ensure required directories exist
     */
    async ensureDirectories() {
        try {
            await fs.mkdir(this.backupPath, { recursive: true });
            await fs.mkdir(this.uploadPath, { recursive: true });
        } catch (error) {
            console.error('Error creating directories:', error);
        }
    }

    /**
     * Update content in JSON files
     */
    async updateContent(req, res) {
        try {
            const { type } = req.params;
            const updateData = req.body;

            // Validate content type
            if (!this.contentTypeFiles[type]) {
                return APIResponse.notFound(res, `Content type '${type}' not found`);
            }

            // Validate input data
            const sanitizedData = DataValidator.sanitizeInput(updateData);
            const validation = DataValidator.validateContentByType(type, sanitizedData);

            if (!validation.valid) {
                return APIResponse.validationError(res, validation.errors);
            }

            const fileName = this.contentTypeFiles[type];
            const filePath = path.join(this.dataPath, fileName);

            // Create backup before updating
            await this.createBackup(fileName);

            // Write updated content
            await fs.writeFile(filePath, JSON.stringify(sanitizedData, null, 2), 'utf8');

            // Log the update
            console.log(`Content updated: ${type} at ${new Date().toISOString()}`);

            // Trigger cache invalidation and real-time update
            await this.triggerContentUpdate(type, sanitizedData);

            APIResponse.success(res, {
                type: type,
                fileName: fileName,
                updatedAt: new Date().toISOString(),
                cacheInvalidated: true
            }, `${type} content updated successfully`);

        } catch (error) {
            console.error('Content update error:', error);
            APIResponse.error(res, 'Failed to update content', 500);
        }
    }

    /**
     * Trigger content update and cache invalidation
     */
    async triggerContentUpdate(contentType, data) {
        try {
            // Store the update timestamp for cache invalidation
            const updateInfo = {
                contentType: contentType,
                timestamp: Date.now(),
                data: data
            };

            // Store in memory for immediate access
            if (!this.contentUpdates) {
                this.contentUpdates = new Map();
            }
            this.contentUpdates.set(contentType, updateInfo);

            // Log the cache invalidation
            console.log(`Cache invalidated for content type: ${contentType}`);

            return true;
        } catch (error) {
            console.error('Error triggering content update:', error);
            return false;
        }
    }

    /**
     * Get content update status
     */
    async getContentUpdateStatus(req, res) {
        try {
            const { type } = req.params;
            const lastUpdate = req.query.lastUpdate ? parseInt(req.query.lastUpdate) : 0;

            if (!this.contentUpdates) {
                this.contentUpdates = new Map();
            }

            const updateInfo = this.contentUpdates.get(type);
            
            if (updateInfo && updateInfo.timestamp > lastUpdate) {
                APIResponse.success(res, {
                    hasUpdate: true,
                    timestamp: updateInfo.timestamp,
                    contentType: type
                }, 'Content update available');
            } else {
                APIResponse.success(res, {
                    hasUpdate: false,
                    timestamp: lastUpdate,
                    contentType: type
                }, 'No content update available');
            }

        } catch (error) {
            console.error('Content update status error:', error);
            APIResponse.error(res, 'Failed to get content update status', 500);
        }
    }

    /**
     * Handle image upload for content management
     */
    async uploadImage(req, res) {
        try {
            // Use multer middleware
            this.upload.single('image')(req, res, async (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return APIResponse.error(res, 'File too large. Maximum size is 5MB', 400);
                        }
                    }
                    return APIResponse.error(res, err.message, 400);
                }

                if (!req.file) {
                    return APIResponse.error(res, 'No image file provided', 400);
                }

                try {
                    // Generate unique filename
                    const timestamp = Date.now();
                    const originalName = req.file.originalname;
                    const extension = path.extname(originalName);
                    const newFileName = `${timestamp}_${path.basename(originalName, extension)}${extension}`;

                    // Move file to proper location
                    const finalPath = path.join(this.uploadPath, newFileName);
                    await fs.rename(req.file.path, finalPath);

                    // Return file information
                    APIResponse.success(res, {
                        fileName: newFileName,
                        originalName: originalName,
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                        uploadPath: `/uploads/${newFileName}`,
                        uploadedAt: new Date().toISOString()
                    }, 'Image uploaded successfully');

                } catch (uploadError) {
                    console.error('File upload error:', uploadError);
                    APIResponse.error(res, 'Failed to process uploaded file', 500);
                }
            });

        } catch (error) {
            console.error('Upload handler error:', error);
            APIResponse.error(res, 'Upload failed', 500);
        }
    }

    /**
     * Create backup of existing file
     */
    async createBackup(fileName) {
        try {
            const sourcePath = path.join(this.dataPath, fileName);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `${timestamp}_${fileName}`;
            const backupFilePath = path.join(this.backupPath, backupFileName);

            // Check if source file exists
            try {
                await fs.access(sourcePath);
                await fs.copyFile(sourcePath, backupFilePath);
                console.log(`Backup created: ${backupFileName}`);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
                // File doesn't exist, no backup needed
            }

            // Clean old backups (keep only last 10)
            await this.cleanOldBackups(fileName);

        } catch (error) {
            console.error('Backup creation error:', error);
            // Don't fail the main operation if backup fails
        }
    }

    /**
     * Clean old backup files
     */
    async cleanOldBackups(fileName) {
        try {
            const files = await fs.readdir(this.backupPath);
            const backupFiles = files
                .filter(file => file.endsWith(`_${fileName}`))
                .sort()
                .reverse();

            // Keep only the 10 most recent backups
            if (backupFiles.length > 10) {
                const filesToDelete = backupFiles.slice(10);
                for (const file of filesToDelete) {
                    await fs.unlink(path.join(this.backupPath, file));
                }
            }
        } catch (error) {
            console.error('Backup cleanup error:', error);
        }
    }

    /**
     * Get backup history for a file
     */
    async getBackupHistory(req, res) {
        try {
            const { type } = req.params;

            if (!this.contentTypeFiles[type]) {
                return APIResponse.notFound(res, `Content type '${type}' not found`);
            }

            const fileName = this.contentTypeFiles[type];
            const files = await fs.readdir(this.backupPath);
            const backupFiles = files
                .filter(file => file.endsWith(`_${fileName}`))
                .map(file => {
                    const timestamp = file.split('_')[0];
                    return {
                        fileName: file,
                        timestamp: timestamp,
                        createdAt: new Date(timestamp.replace(/-/g, ':')).toISOString()
                    };
                })
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            APIResponse.success(res, backupFiles, 'Backup history retrieved successfully');

        } catch (error) {
            console.error('Backup history error:', error);
            APIResponse.error(res, 'Failed to retrieve backup history', 500);
        }
    }

    /**
     * Restore from backup
     */
    async restoreFromBackup(req, res) {
        try {
            const { type, backupFile } = req.params;

            if (!this.contentTypeFiles[type]) {
                return APIResponse.notFound(res, `Content type '${type}' not found`);
            }

            const fileName = this.contentTypeFiles[type];
            const backupPath = path.join(this.backupPath, backupFile);
            const targetPath = path.join(this.dataPath, fileName);

            // Verify backup file exists and is valid
            try {
                await fs.access(backupPath);
                const backupContent = await fs.readFile(backupPath, 'utf8');
                JSON.parse(backupContent); // Validate JSON
            } catch (error) {
                return APIResponse.error(res, 'Invalid or missing backup file', 400);
            }

            // Create backup of current file before restore
            await this.createBackup(fileName);

            // Restore from backup
            await fs.copyFile(backupPath, targetPath);

            APIResponse.success(res, {
                type: type,
                restoredFrom: backupFile,
                restoredAt: new Date().toISOString()
            }, 'Content restored from backup successfully');

        } catch (error) {
            console.error('Restore error:', error);
            APIResponse.error(res, 'Failed to restore from backup', 500);
        }
    }

    /**
     * Admin authentication
     */
    async authenticate(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return APIResponse.error(res, 'Username and password are required', 400);
            }

            // Check credentials
            if (this.adminCredentials[username] === password) {
                // Generate session token
                const sessionToken = this.generateSessionToken();
                const sessionData = {
                    username: username,
                    loginTime: Date.now(),
                    lastActivity: Date.now(),
                    token: sessionToken
                };

                // Store session
                this.activeSessions.set(sessionToken, sessionData);

                // Log successful login
                console.log(`Admin login successful: ${username} at ${new Date().toISOString()}`);

                APIResponse.success(res, {
                    token: sessionToken,
                    username: username,
                    loginTime: sessionData.loginTime
                }, 'Authentication successful');

            } else {
                // Log failed login attempt
                console.log(`Admin login failed: ${username} at ${new Date().toISOString()}`);
                APIResponse.error(res, 'Invalid credentials', 401);
            }

        } catch (error) {
            console.error('Authentication error:', error);
            APIResponse.error(res, 'Authentication failed', 500);
        }
    }


    /**
     * Validate session token
     */
    validateSession(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return APIResponse.error(res, 'No authentication token provided', 401);
            }

            const session = this.activeSessions.get(token);

            if (!session) {
                return APIResponse.error(res, 'Invalid or expired session', 401);
            }

            // Check session timeout (30 minutes)
            const now = Date.now();
            const timeSinceActivity = now - session.lastActivity;
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

            if (timeSinceActivity > SESSION_TIMEOUT) {
                this.activeSessions.delete(token);
                return APIResponse.error(res, 'Session expired', 401);
            }

            // Update last activity
            session.lastActivity = now;
            this.activeSessions.set(token, session);

            // Add user info to request
            req.user = {
                username: session.username,
                token: token
            };

            next();

        } catch (error) {
            console.error('Session validation error:', error);
            APIResponse.error(res, 'Session validation failed', 500);
        }
    }

    /**
     * Admin logout
     */
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (token && this.activeSessions.has(token)) {
                const session = this.activeSessions.get(token);
                console.log(`Admin logout: ${session.username} at ${new Date().toISOString()}`);
                this.activeSessions.delete(token);
            }

            APIResponse.success(res, null, 'Logout successful');

        } catch (error) {
            console.error('Logout error:', error);
            APIResponse.error(res, 'Logout failed', 500);
        }
    }

    /**
     * Get session info
     */
    async getSessionInfo(req, res) {
        try {
            const session = this.activeSessions.get(req.user.token);

            if (!session) {
                return APIResponse.error(res, 'Session not found', 404);
            }

            APIResponse.success(res, {
                username: session.username,
                loginTime: session.loginTime,
                lastActivity: session.lastActivity,
                sessionDuration: Date.now() - session.loginTime
            }, 'Session info retrieved');

        } catch (error) {
            console.error('Session info error:', error);
            APIResponse.error(res, 'Failed to get session info', 500);
        }
    }

    /**
     * Change password
     */
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const username = req.user.username;

            if (!currentPassword || !newPassword) {
                return APIResponse.error(res, 'Current and new passwords are required', 400);
            }

            // Verify current password
            if (this.adminCredentials[username] !== currentPassword) {
                return APIResponse.error(res, 'Current password is incorrect', 400);
            }

            // Validate new password
            if (newPassword.length < 8) {
                return APIResponse.error(res, 'New password must be at least 8 characters long', 400);
            }

            // Update password (in production, this should be stored securely)
            this.adminCredentials[username] = newPassword;

            // Log password change
            console.log(`Password changed for user: ${username} at ${new Date().toISOString()}`);

            APIResponse.success(res, null, 'Password changed successfully');

        } catch (error) {
            console.error('Password change error:', error);
            APIResponse.error(res, 'Failed to change password', 500);
        }
    }

    /**
     * Generate session token
     */
    generateSessionToken() {
        return require('crypto').randomBytes(32).toString('hex');
    }

    /**
     * Get admin statistics
     */
    async getAdminStats(req, res) {
        try {
            const stats = {
                totalPages: 6,
                totalJsonFiles: Object.keys(this.contentTypeFiles).length,
                totalMediaFiles: await this.countMediaFiles(),
                activeSessions: this.activeSessions.size,
                lastUpdate: await this.getLastUpdateTime(),
                systemStatus: {
                    api: 'online',
                    jsonFiles: 'valid',
                    backupSystem: 'active',
                    storage: await this.getStorageInfo()
                }
            };

            APIResponse.success(res, stats, 'Admin statistics retrieved');

        } catch (error) {
            console.error('Admin stats error:', error);
            APIResponse.error(res, 'Failed to get admin statistics', 500);
        }
    }

    /**
     * Count media files
     */
    async countMediaFiles() {
        try {
            const files = await fs.readdir(this.uploadPath);
            return files.filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get last update time
     */
    async getLastUpdateTime() {
        try {
            const files = await fs.readdir(this.dataPath);
            let lastModified = 0;

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.dataPath, file);
                    const stats = await fs.stat(filePath);
                    if (stats.mtime.getTime() > lastModified) {
                        lastModified = stats.mtime.getTime();
                    }
                }
            }

            return lastModified || Date.now();
        } catch (error) {
            return Date.now();
        }
    }

    /**
     * Get storage information
     */
    async getStorageInfo() {
        try {
            // Simplified storage info (in production, use proper disk usage calculation)
            return {
                used: '85%',
                status: 'warning'
            };
        } catch (error) {
            return {
                used: 'unknown',
                status: 'offline'
            };
        }
    }

    /**
     * Get recent activity log
     */
    async getRecentActivity(req, res) {
        try {
            // In production, this would read from a proper activity log
            const activities = [
                {
                    timestamp: Date.now() - 30 * 60 * 1000,
                    action: 'อัปเดตเนื้อหา',
                    file: 'homepage-carousel.json',
                    user: req.user.username,
                    status: 'success'
                },
                {
                    timestamp: Date.now() - 60 * 60 * 1000,
                    action: 'อัปโหลดรูปภาพ',
                    file: 'gallery-image-01.jpg',
                    user: req.user.username,
                    status: 'success'
                },
                {
                    timestamp: Date.now() - 90 * 60 * 1000,
                    action: 'แก้ไขข้อมูลติดต่อ',
                    file: 'contact-content.json',
                    user: req.user.username,
                    status: 'success'
                }
            ];

            APIResponse.success(res, activities, 'Recent activity retrieved');

        } catch (error) {
            console.error('Recent activity error:', error);
            APIResponse.error(res, 'Failed to get recent activity', 500);
        }
    }
}

module.exports = AdminAPI;