/**
 * Huay Tueng Thao Website AJAX API
 * Client-side CRUD operations for JSON content management
 */

class HuayTuengThaoAPI {
    constructor() {
        this.dataPath = 'data/';
        this.backupPath = 'data/backups/';
        
        // Content type to file mapping
        this.contentFiles = {
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
     * GET - Retrieve content by type
     */
    async getContent(type, section = null) {
        try {
            if (type === 'homepage' && !section) {
                // Get all homepage content
                const homepageData = {};
                const homepageTypes = ['carousel', 'featured', 'gallery', 'news', 'services', 'updates'];
                
                for (const subType of homepageTypes) {
                    try {
                        const data = await this._loadJSONFile(`homepage-${subType}.json`);
                        homepageData[subType] = data;
                    } catch (error) {
                        console.warn(`Failed to load homepage-${subType}.json:`, error.message);
                        homepageData[subType] = null;
                    }
                }
                
                return this._formatResponse(true, 'Homepage content retrieved successfully', homepageData);
            }
            
            if (type === 'homepage' && section) {
                // Get specific homepage section
                const fileName = `homepage-${section}.json`;
                const data = await this._loadJSONFile(fileName);
                return this._formatResponse(true, `Homepage ${section} content retrieved successfully`, data);
            }
            
            // Get other content types
            const fileName = this.contentFiles[type];
            if (!fileName) {
                return this._formatResponse(false, `Content type '${type}' not found`, null, 404);
            }
            
            const data = await this._loadJSONFile(fileName);
            return this._formatResponse(true, `${type} content retrieved successfully`, data);
            
        } catch (error) {
            console.error('Content retrieval error:', error);
            return this._formatResponse(false, 'Failed to retrieve content', null, 500);
        }
    }

    /**
     * POST - Update content (Admin function)
     */
    async updateContent(type, newData) {
        try {
            const fileName = this.contentFiles[type];
            if (!fileName) {
                return this._formatResponse(false, `Content type '${type}' not found`, null, 404);
            }

            // Validate data
            const validation = this._validateContent(type, newData);
            if (!validation.valid) {
                return this._formatResponse(false, 'Validation failed', validation.errors, 422);
            }

            // Sanitize input
            const sanitizedData = this._sanitizeInput(newData);

            // Create backup before updating
            await this._createBackup(fileName);

            // Save updated content
            await this._saveJSONFile(fileName, sanitizedData);

            return this._formatResponse(true, `${type} content updated successfully`, {
                type: type,
                fileName: fileName,
                updatedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error('Content update error:', error);
            return this._formatResponse(false, 'Failed to update content', null, 500);
        }
    }

    /**
     * DELETE - Delete content (Admin function)
     */
    async deleteContent(type) {
        try {
            const fileName = this.contentFiles[type];
            if (!fileName) {
                return this._formatResponse(false, `Content type '${type}' not found`, null, 404);
            }

            // Create backup before deleting
            await this._createBackup(fileName);

            // Note: In a real implementation, you'd need server-side support for file deletion
            // For now, we'll just return a success message
            return this._formatResponse(true, `${type} content marked for deletion`, {
                type: type,
                fileName: fileName,
                deletedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error('Content deletion error:', error);
            return this._formatResponse(false, 'Failed to delete content', null, 500);
        }
    }

    /**
     * Upload image file
     */
    async uploadImage(imageFile) {
        try {
            if (!imageFile || !imageFile.type.startsWith('image/')) {
                return this._formatResponse(false, 'Invalid image file', null, 400);
            }

            if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
                return this._formatResponse(false, 'File too large. Maximum size is 5MB', null, 400);
            }

            // Create a unique filename
            const timestamp = Date.now();
            const extension = imageFile.name.split('.').pop();
            const newFileName = `${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            // Convert to base64 for storage (in a real app, you'd upload to server)
            const base64Data = await this._fileToBase64(imageFile);

            return this._formatResponse(true, 'Image uploaded successfully', {
                fileName: newFileName,
                originalName: imageFile.name,
                size: imageFile.size,
                mimetype: imageFile.type,
                uploadPath: `/uploads/${newFileName}`,
                base64Data: base64Data,
                uploadedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error('Image upload error:', error);
            return this._formatResponse(false, 'Failed to upload image', null, 500);
        }
    }

    /**
     * Get backup history
     */
    async getBackupHistory(type) {
        try {
            const fileName = this.contentFiles[type];
            if (!fileName) {
                return this._formatResponse(false, `Content type '${type}' not found`, null, 404);
            }

            // In a real implementation, this would read from the backup directory
            // For now, return mock data
            const mockBackups = [
                {
                    fileName: `${new Date().toISOString().replace(/[:.]/g, '-')}_${fileName}`,
                    timestamp: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }
            ];

            return this._formatResponse(true, 'Backup history retrieved successfully', mockBackups);

        } catch (error) {
            console.error('Backup history error:', error);
            return this._formatResponse(false, 'Failed to retrieve backup history', null, 500);
        }
    }

    /**
     * Private method: Load JSON file via AJAX
     */
    async _loadJSONFile(fileName) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.dataPath + fileName,
                method: 'GET',
                dataType: 'json',
                cache: false,
                success: function(data) {
                    resolve(data);
                },
                error: function(xhr, status, error) {
                    reject(new Error(`Failed to load ${fileName}: ${error}`));
                }
            });
        });
    }

    /**
     * Private method: Save JSON file (requires server-side support)
     */
    async _saveJSONFile(fileName, data) {
        // Note: This requires a server-side endpoint to actually save files
        // For demonstration, we'll use localStorage as a fallback
        try {
            const jsonString = JSON.stringify(data, null, 2);
            localStorage.setItem(`huaytuengthao_${fileName}`, jsonString);
            console.log(`Content saved to localStorage: ${fileName}`);
            
            // In a real implementation, you would send this to a server endpoint:
            /*
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/api/save-content',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        fileName: fileName,
                        content: data
                    }),
                    success: resolve,
                    error: reject
                });
            });
            */
        } catch (error) {
            throw new Error(`Failed to save ${fileName}: ${error.message}`);
        }
    }

    /**
     * Private method: Create backup
     */
    async _createBackup(fileName) {
        try {
            const currentData = await this._loadJSONFile(fileName);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupKey = `huaytuengthao_backup_${timestamp}_${fileName}`;
            
            localStorage.setItem(backupKey, JSON.stringify(currentData, null, 2));
            console.log(`Backup created: ${backupKey}`);
        } catch (error) {
            console.warn('Backup creation failed:', error.message);
            // Don't fail the main operation if backup fails
        }
    }

    /**
     * Private method: Convert file to base64
     */
    async _fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Private method: Validate content
     */
    _validateContent(type, data) {
        if (!data || typeof data !== 'object') {
            return { valid: false, errors: ['Invalid data format'] };
        }

        // Basic validation based on content type
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
    }

    /**
     * Private method: Sanitize input data
     */
    _sanitizeInput(data) {
        if (typeof data === 'string') {
            return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        
        if (Array.isArray(data)) {
            return data.map(item => this._sanitizeInput(item));
        }
        
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this._sanitizeInput(value);
            }
            return sanitized;
        }
        
        return data;
    }

    /**
     * Private method: Format API response
     */
    _formatResponse(success, message, data = null, statusCode = 200) {
        return {
            success: success,
            message: message,
            data: data,
            statusCode: statusCode,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize global API instance
window.HuayTuengThaoAPI = new HuayTuengThaoAPI();