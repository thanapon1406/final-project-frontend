/**
 * Content API Module
 * Handles GET requests for content retrieval from JSON files
 */

const fs = require('fs').promises;
const path = require('path');
const DataValidator = require('../utils/DataValidator');
const APIResponse = require('../utils/APIResponse');

class ContentAPI {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data');
        this.contentTypes = {
            'homepage': [
                'homepage-carousel.json',
                'homepage-featured.json', 
                'homepage-gallery.json',
                'homepage-news.json',
                'homepage-services.json',
                'homepage-updates.json'
            ],
            'history': ['history-content.json'],
            'services': ['services-content.json'],
            'contact': ['contact-content.json'],
            'about': ['about-content.json'],
            'navigation': ['navigation.json'],
            'footer': ['footer.json']
        };
    }

    /**
     * Get content by type
     */
    async getContent(req, res) {
        try {
            const { type } = req.params;
            
            // Validate content type
            if (!this.contentTypes[type]) {
                return APIResponse.notFound(res, `Content type '${type}' not found`);
            }

            const files = this.contentTypes[type];
            const content = {};

            // Read all files for the content type
            for (const file of files) {
                try {
                    const filePath = path.join(this.dataPath, file);
                    const fileContent = await fs.readFile(filePath, 'utf8');
                    const jsonData = JSON.parse(fileContent);
                    
                    // Validate JSON structure
                    if (!DataValidator.validateJSONStructure(jsonData)) {
                        console.warn(`Invalid JSON structure in ${file}`);
                    }
                    
                    // Use filename without extension as key
                    const key = path.basename(file, '.json');
                    content[key] = jsonData;
                    
                } catch (fileError) {
                    console.error(`Error reading ${file}:`, fileError.message);
                    // Continue with other files, don't fail entire request
                }
            }

            // Format response based on content type
            const formattedContent = this.formatContentResponse(type, content);
            
            APIResponse.success(res, formattedContent, `${type} content retrieved successfully`);
            
        } catch (error) {
            console.error('Content retrieval error:', error);
            APIResponse.error(res, 'Failed to retrieve content', 500);
        }
    }

    /**
     * Get specific section of content
     */
    async getContentSection(req, res) {
        try {
            const { type, section } = req.params;
            
            if (!this.contentTypes[type]) {
                return APIResponse.notFound(res, `Content type '${type}' not found`);
            }

            // Find the specific file for the section
            const fileName = `${type === 'homepage' ? 'homepage-' + section : type + '-content'}.json`;
            const filePath = path.join(this.dataPath, fileName);

            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                const jsonData = JSON.parse(fileContent);
                
                // Validate and format
                if (!DataValidator.validateJSONStructure(jsonData)) {
                    console.warn(`Invalid JSON structure in ${fileName}`);
                }

                APIResponse.success(res, jsonData, `${type}/${section} content retrieved successfully`);
                
            } catch (fileError) {
                if (fileError.code === 'ENOENT') {
                    APIResponse.notFound(res, `Section '${section}' not found for content type '${type}'`);
                } else {
                    throw fileError;
                }
            }
            
        } catch (error) {
            console.error('Content section retrieval error:', error);
            APIResponse.error(res, 'Failed to retrieve content section', 500);
        }
    }

    /**
     * Format content response based on type
     */
    formatContentResponse(type, content) {
        switch (type) {
            case 'homepage':
                return {
                    carousel: content['homepage-carousel'] || null,
                    featured: content['homepage-featured'] || null,
                    gallery: content['homepage-gallery'] || null,
                    news: content['homepage-news'] || null,
                    services: content['homepage-services'] || null,
                    updates: content['homepage-updates'] || null
                };
            
            case 'history':
            case 'services':
            case 'contact':
            case 'about':
                return content[`${type}-content`] || content[type] || null;
                
            case 'navigation':
            case 'footer':
                return content[type] || null;
                
            default:
                return content;
        }
    }
}

module.exports = ContentAPI;