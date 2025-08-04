/**
 * API Helper Functions
 * Simplified AJAX-based CRUD operations for content management
 */

// API Configuration
const API_CONFIG = {
    dataPath: 'data/',
    backupPrefix: 'huaytuengthao_backup_',
    storagePrefix: 'huaytuengthao_'
};

/**
 * Content API Functions
 */
const ContentAPI = {
    
    /**
     * Get content by type
     */
    get: function(type, section = null) {
        return new Promise((resolve, reject) => {
            let url;
            
            if (type === 'homepage' && section) {
                url = `${API_CONFIG.dataPath}homepage-${section}.json`;
            } else if (type === 'homepage') {
                // For homepage, we need to load multiple files
                this.getHomepageContent().then(resolve).catch(reject);
                return;
            } else {
                const fileMap = {
                    'history': 'history-content.json',
                    'services': 'services-content.json',
                    'contact': 'contact-content.json',
                    'about': 'about-content.json',
                    'navigation': 'navigation.json',
                    'footer': 'footer.json'
                };
                
                url = `${API_CONFIG.dataPath}${fileMap[type]}`;
            }
            
            if (!url) {
                reject(new Error(`Content type '${type}' not found`));
                return;
            }
            
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    resolve({
                        success: true,
                        message: `${type}${section ? '/' + section : ''} content retrieved successfully`,
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                },
                error: function(xhr, status, error) {
                    reject({
                        success: false,
                        message: `Failed to load ${type} content`,
                        error: error,
                        statusCode: xhr.status,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });
    },
    
    /**
     * Get all homepage content
     */
    getHomepageContent: function() {
        const homepageTypes = ['carousel', 'featured', 'gallery', 'news', 'services', 'updates'];
        const promises = homepageTypes.map(type => {
            return new Promise((resolve) => {
                $.ajax({
                    url: `${API_CONFIG.dataPath}homepage-${type}.json`,
                    method: 'GET',
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        resolve({ type, data });
                    },
                    error: function() {
                        resolve({ type, data: null });
                    }
                });
            });
        });
        
        return Promise.all(promises).then(results => {
            const homepageData = {};
            results.forEach(result => {
                homepageData[result.type] = result.data;
            });
            
            return {
                success: true,
                message: 'Homepage content retrieved successfully',
                data: homepageData,
                timestamp: new Date().toISOString()
            };
        });
    }
};

/**
 * Admin API Functions
 */
const AdminAPI = {
    
    /**
     * Update content
     */
    update: function(type, data) {
        return new Promise((resolve, reject) => {
            try {
                // Validate data
                const validation = this.validateContent(type, data);
                if (!validation.valid) {
                    reject({
                        success: false,
                        message: 'Validation failed',
                        errors: validation.errors,
                        statusCode: 422,
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                
                // Sanitize data
                const sanitizedData = this.sanitizeInput(data);
                
                // Create backup
                this.createBackup(type, sanitizedData);
                
                // Save to localStorage (in real app, this would be sent to server)
                const fileName = this.getFileName(type);
                const storageKey = `${API_CONFIG.storagePrefix}${fileName}`;
                localStorage.setItem(storageKey, JSON.stringify(sanitizedData, null, 2));
                
                resolve({
                    success: true,
                    message: `${type} content updated successfully`,
                    data: {
                        type: type,
                        fileName: fileName,
                        updatedAt: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                reject({
                    success: false,
                    message: 'Failed to update content',
                    error: error.message,
                    statusCode: 500,
                    timestamp: new Date().toISOString()
                });
            }
        });
    },
    
    /**
     * Upload image
     */
    uploadImage: function(imageFile) {
        return new Promise((resolve, reject) => {
            try {
                // Validate file
                if (!imageFile || !imageFile.type.startsWith('image/')) {
                    reject({
                        success: false,
                        message: 'Invalid image file',
                        statusCode: 400,
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                
                if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
                    reject({
                        success: false,
                        message: 'File too large. Maximum size is 5MB',
                        statusCode: 400,
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                
                // Convert to base64
                const reader = new FileReader();
                reader.onload = function(e) {
                    const timestamp = Date.now();
                    const extension = imageFile.name.split('.').pop();
                    const newFileName = `${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                    
                    // Store in localStorage (in real app, upload to server)
                    const imageData = {
                        fileName: newFileName,
                        originalName: imageFile.name,
                        size: imageFile.size,
                        mimetype: imageFile.type,
                        base64Data: e.target.result,
                        uploadedAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem(`${API_CONFIG.storagePrefix}image_${newFileName}`, JSON.stringify(imageData));
                    
                    resolve({
                        success: true,
                        message: 'Image uploaded successfully',
                        data: {
                            ...imageData,
                            uploadPath: `/uploads/${newFileName}`
                        },
                        timestamp: new Date().toISOString()
                    });
                };
                
                reader.onerror = function() {
                    reject({
                        success: false,
                        message: 'Failed to read image file',
                        statusCode: 500,
                        timestamp: new Date().toISOString()
                    });
                };
                
                reader.readAsDataURL(imageFile);
                
            } catch (error) {
                reject({
                    success: false,
                    message: 'Failed to upload image',
                    error: error.message,
                    statusCode: 500,
                    timestamp: new Date().toISOString()
                });
            }
        });
    },
    
    /**
     * Get backup history
     */
    getBackupHistory: function(type) {
        return new Promise((resolve) => {
            const backups = [];
            const fileName = this.getFileName(type);
            
            // Search localStorage for backups
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`${API_CONFIG.backupPrefix}`) && key.includes(fileName)) {
                    const timestamp = key.split('_')[2];
                    backups.push({
                        fileName: key,
                        timestamp: timestamp,
                        createdAt: new Date(timestamp.replace(/-/g, ':')).toISOString()
                    });
                }
            }
            
            // Sort by creation date (newest first)
            backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            resolve({
                success: true,
                message: 'Backup history retrieved successfully',
                data: backups,
                timestamp: new Date().toISOString()
            });
        });
    },
    
    /**
     * Restore from backup
     */
    restoreFromBackup: function(type, backupKey) {
        return new Promise((resolve, reject) => {
            try {
                const backupData = localStorage.getItem(backupKey);
                if (!backupData) {
                    reject({
                        success: false,
                        message: 'Backup not found',
                        statusCode: 404,
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                
                // Create backup of current data before restore
                this.createBackup(type);
                
                // Restore data
                const fileName = this.getFileName(type);
                const storageKey = `${API_CONFIG.storagePrefix}${fileName}`;
                localStorage.setItem(storageKey, backupData);
                
                resolve({
                    success: true,
                    message: 'Content restored from backup successfully',
                    data: {
                        type: type,
                        restoredFrom: backupKey,
                        restoredAt: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                reject({
                    success: false,
                    message: 'Failed to restore from backup',
                    error: error.message,
                    statusCode: 500,
                    timestamp: new Date().toISOString()
                });
            }
        });
    },
    
    /**
     * Helper: Get filename for content type
     */
    getFileName: function(type) {
        const fileMap = {
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
        
        return fileMap[type] || `${type}.json`;
    },
    
    /**
     * Helper: Create backup
     */
    createBackup: function(type, currentData = null) {
        try {
            const fileName = this.getFileName(type);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupKey = `${API_CONFIG.backupPrefix}${timestamp}_${fileName}`;
            
            if (currentData) {
                localStorage.setItem(backupKey, JSON.stringify(currentData, null, 2));
            } else {
                // Try to get current data from storage
                const storageKey = `${API_CONFIG.storagePrefix}${fileName}`;
                const existingData = localStorage.getItem(storageKey);
                if (existingData) {
                    localStorage.setItem(backupKey, existingData);
                }
            }
            
            console.log(`Backup created: ${backupKey}`);
        } catch (error) {
            console.warn('Backup creation failed:', error.message);
        }
    },
    
    /**
     * Helper: Validate content
     */
    validateContent: function(type, data) {
        if (!data || typeof data !== 'object') {
            return { valid: false, errors: ['Invalid data format'] };
        }
        
        switch (type) {
            case 'homepage-carousel':
                if (!data.slides || !Array.isArray(data.slides)) {
                    return { valid: false, errors: ['Slides array is required'] };
                }
                break;
                
            case 'contact':
                if (!data.contact) {
                    return { valid: false, errors: ['Contact object is required'] };
                }
                break;
                
            case 'history':
                if (!data.history) {
                    return { valid: false, errors: ['History object is required'] };
                }
                break;
        }
        
        return { valid: true, errors: [] };
    },
    
    /**
     * Helper: Sanitize input
     */
    sanitizeInput: function(data) {
        if (typeof data === 'string') {
            return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        
        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeInput(item));
        }
        
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeInput(value);
            }
            return sanitized;
        }
        
        return data;
    }
};

// Make APIs globally available
window.ContentAPI = ContentAPI;
window.AdminAPI = AdminAPI;