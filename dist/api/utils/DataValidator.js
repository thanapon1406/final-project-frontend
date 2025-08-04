/**
 * Data Validator Utility
 * Validates JSON data structure and content integrity
 */

class DataValidator {
    
    /**
     * Validate basic JSON structure
     */
    static validateJSONStructure(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // Check if it's a valid object (not null, not array unless expected)
        return data !== null && typeof data === 'object';
    }
    
    /**
     * Validate homepage carousel data
     */
    static validateCarouselData(data) {
        if (!data.slides || !Array.isArray(data.slides)) {
            return { valid: false, errors: ['Slides array is required'] };
        }
        
        const errors = [];
        data.slides.forEach((slide, index) => {
            if (!slide.id) errors.push(`Slide ${index}: ID is required`);
            if (!slide.title) errors.push(`Slide ${index}: Title is required`);
            if (!slide.description) errors.push(`Slide ${index}: Description is required`);
            if (!slide.backgroundClass) errors.push(`Slide ${index}: Background class is required`);
        });
        
        return { valid: errors.length === 0, errors };
    }
    
    /**
     * Validate contact data
     */
    static validateContactData(data) {
        if (!data.contact) {
            return { valid: false, errors: ['Contact object is required'] };
        }
        
        const errors = [];
        const contact = data.contact;
        
        if (!contact.title) errors.push('Contact title is required');
        if (!contact.organization) errors.push('Organization is required');
        if (!contact.address) errors.push('Address is required');
        if (!contact.phone) errors.push('Phone is required');
        if (!contact.email) errors.push('Email is required');
        
        return { valid: errors.length === 0, errors };
    }
    
    /**
     * Validate history data
     */
    static validateHistoryData(data) {
        if (!data.history) {
            return { valid: false, errors: ['History object is required'] };
        }
        
        const errors = [];
        const history = data.history;
        
        if (!history.title) errors.push('History title is required');
        if (!history.content || !Array.isArray(history.content)) {
            errors.push('History content array is required');
        }
        
        return { valid: errors.length === 0, errors };
    }
    
    /**
     * Validate services data
     */
    static validateServicesData(data) {
        if (!data.services) {
            return { valid: false, errors: ['Services object is required'] };
        }
        
        const errors = [];
        const services = data.services;
        
        if (!services.title) errors.push('Services title is required');
        if (!services.items || !Array.isArray(services.items)) {
            errors.push('Services items array is required');
        }
        
        return { valid: errors.length === 0, errors };
    }
    
    /**
     * Validate content by type
     */
    static validateContentByType(type, data) {
        switch (type) {
            case 'homepage-carousel':
                return this.validateCarouselData(data);
            case 'contact':
                return this.validateContactData(data);
            case 'history':
                return this.validateHistoryData(data);
            case 'services':
                return this.validateServicesData(data);
            default:
                return this.validateJSONStructure(data) 
                    ? { valid: true, errors: [] }
                    : { valid: false, errors: ['Invalid JSON structure'] };
        }
    }
    
    /**
     * Sanitize input data
     */
    static sanitizeInput(data) {
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
}

module.exports = DataValidator;