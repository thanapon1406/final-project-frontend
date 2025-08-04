/**
 * Comprehensive Error Handler and Image Fallback System
 * Handles console errors and provides fallback solutions for undefined images
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.imageCache = new Map();
        this.fallbackImages = new Map();
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupImageErrorHandling();
        this.setupConsoleErrorCapture();
        this.createFallbackImageSystem();
        this.initializeImageObserver();
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Capture JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Capture resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleResourceError(event);
            }
        }, true);
    }

    /**
     * Setup image error handling with fallbacks
     */
    setupImageErrorHandling() {
        // Handle image loading errors
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                this.handleImageError(event.target);
            }
        }, true);

        // Monitor all images on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAllImages();
        });
    }

    /**
     * Setup console error capture
     */
    setupConsoleErrorCapture() {
        // Override console.error to capture errors
        const originalError = console.error;
        console.error = (...args) => {
            this.logError('Console Error', {
                message: args.join(' '),
                stack: new Error().stack
            });
            originalError.apply(console, args);
        };

        // Override console.warn to capture warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
            this.logError('Console Warning', {
                message: args.join(' '),
                stack: new Error().stack
            }, 'warning');
            originalWarn.apply(console, args);
        };
    }

    /**
     * Create fallback image system
     */
    createFallbackImageSystem() {
        // Define fallback images for different contexts
        this.fallbackImages.set('carousel', this.generatePlaceholderImage(1200, 500, 'สไลด์', '#4a90e2'));
        this.fallbackImages.set('gallery', this.generatePlaceholderImage(400, 300, 'ภาพ', '#50c878'));
        this.fallbackImages.set('featured', this.generatePlaceholderImage(600, 400, 'เนื้อหาเด่น', '#ff6b6b'));
        this.fallbackImages.set('history', this.generatePlaceholderImage(500, 350, 'ประวัติ', '#ffa500'));
        this.fallbackImages.set('services', this.generatePlaceholderImage(400, 250, 'บริการ', '#9b59b6'));
        this.fallbackImages.set('contact', this.generatePlaceholderImage(300, 200, 'ติดต่อ', '#34495e'));
        this.fallbackImages.set('default', this.generatePlaceholderImage(400, 300, 'รูปภาพ', '#95a5a6'));
    }

    /**
     * Generate placeholder image with text and background color
     */
    generatePlaceholderImage(width, height, text, bgColor = '#e9ecef', textColor = '#6c757d') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Add border
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        // Add icon
        ctx.fillStyle = textColor;
        ctx.font = `${Math.min(width, height) * 0.15}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw camera icon (simplified)
        const iconSize = Math.min(width, height) * 0.2;
        const centerX = width / 2;
        const centerY = height / 2 - 20;
        
        // Camera body
        ctx.fillRect(centerX - iconSize/2, centerY - iconSize/3, iconSize, iconSize * 2/3);
        // Camera lens
        ctx.beginPath();
        ctx.arc(centerX, centerY, iconSize/3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add text
        ctx.font = `${Math.min(width, height) * 0.08}px Arial`;
        ctx.fillText(text, centerX, centerY + iconSize/2 + 30);
        
        // Add dimensions text
        ctx.font = `${Math.min(width, height) * 0.05}px Arial`;
        ctx.fillStyle = '#adb5bd';
        ctx.fillText(`${width} × ${height}`, centerX, centerY + iconSize/2 + 50);

        return canvas.toDataURL('image/png');
    }

    /**
     * Handle image loading errors
     */
    handleImageError(img) {
        if (img.dataset.errorHandled) return; // Prevent infinite loops
        
        img.dataset.errorHandled = 'true';
        img.dataset.originalSrc = img.src;

        // Determine appropriate fallback based on context
        const fallbackType = this.determineFallbackType(img);
        const fallbackSrc = this.fallbackImages.get(fallbackType) || this.fallbackImages.get('default');

        // Apply fallback image
        img.src = fallbackSrc;
        img.alt = img.alt || `${fallbackType} - รูปภาพไม่สามารถโหลดได้`;
        
        // Add error styling
        img.classList.add('image-error');
        img.style.filter = 'grayscale(20%)';
        img.style.opacity = '0.8';

        // Add retry functionality
        this.addImageRetryFunctionality(img);

        this.logError('Image Loading Error', {
            src: img.dataset.originalSrc,
            alt: img.alt,
            fallbackType: fallbackType
        });
    }

    /**
     * Determine appropriate fallback type based on image context
     */
    determineFallbackType(img) {
        const classList = img.classList;
        const parentClasses = img.parentElement?.classList || [];
        const containerClasses = img.closest('[class*="carousel"], [class*="gallery"], [class*="featured"], [class*="history"], [class*="service"], [class*="contact"]')?.classList || [];

        if (classList.contains('carousel-image') || containerClasses.toString().includes('carousel')) return 'carousel';
        if (classList.contains('gallery-image') || containerClasses.toString().includes('gallery')) return 'gallery';
        if (classList.contains('featured-image') || containerClasses.toString().includes('featured')) return 'featured';
        if (classList.contains('history-image') || containerClasses.toString().includes('history')) return 'history';
        if (classList.contains('service-image') || containerClasses.toString().includes('service')) return 'services';
        if (classList.contains('contact-image') || containerClasses.toString().includes('contact')) return 'contact';
        
        return 'default';
    }

    /**
     * Add retry functionality to failed images
     */
    addImageRetryFunctionality(img) {
        // Add retry button overlay
        const retryOverlay = document.createElement('div');
        retryOverlay.className = 'image-retry-overlay';
        retryOverlay.innerHTML = `
            <button class="image-retry-btn" title="ลองโหลดรูปภาพอีกครั้ง">
                <i class="fas fa-redo-alt"></i>
            </button>
        `;

        // Position overlay
        const container = img.parentElement;
        if (container && getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        
        container.appendChild(retryOverlay);

        // Handle retry click
        retryOverlay.querySelector('.image-retry-btn').addEventListener('click', () => {
            this.retryImageLoad(img, retryOverlay);
        });
    }

    /**
     * Retry loading the original image
     */
    retryImageLoad(img, overlay) {
        const originalSrc = img.dataset.originalSrc;
        if (!originalSrc) return;

        // Show loading state
        overlay.innerHTML = '<div class="image-loading"><i class="fas fa-spinner fa-spin"></i></div>';

        // Create new image to test loading
        const testImg = new Image();
        testImg.onload = () => {
            img.src = originalSrc;
            img.classList.remove('image-error');
            img.style.filter = '';
            img.style.opacity = '';
            overlay.remove();
            delete img.dataset.errorHandled;
        };

        testImg.onerror = () => {
            overlay.innerHTML = `
                <button class="image-retry-btn" title="ลองโหลดรูปภาพอีกครั้ง">
                    <i class="fas fa-redo-alt"></i>
                </button>
            `;
            // Re-attach event listener
            overlay.querySelector('.image-retry-btn').addEventListener('click', () => {
                this.retryImageLoad(img, overlay);
            });
        };

        testImg.src = originalSrc;
    }

    /**
     * Check all images on the page
     */
    checkAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Check if image is already loaded
            if (img.complete && img.naturalHeight === 0) {
                this.handleImageError(img);
            }
            
            // Check for missing src
            if (!img.src || img.src === window.location.href) {
                this.handleMissingImageSrc(img);
            }
        });
    }

    /**
     * Handle images with missing src attributes
     */
    handleMissingImageSrc(img) {
        const fallbackType = this.determineFallbackType(img);
        const fallbackSrc = this.fallbackImages.get(fallbackType) || this.fallbackImages.get('default');
        
        img.src = fallbackSrc;
        img.alt = img.alt || `${fallbackType} - ไม่มีรูปภาพ`;
        img.classList.add('image-missing-src');
        
        this.logError('Missing Image Source', {
            element: img.outerHTML,
            fallbackType: fallbackType
        });
    }

    /**
     * Initialize image observer for dynamic content
     */
    initializeImageObserver() {
        // Observer for dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is an image
                        if (node.tagName === 'IMG') {
                            this.setupImageErrorHandling(node);
                        }
                        
                        // Check for images within the added node
                        const images = node.querySelectorAll?.('img');
                        images?.forEach(img => this.setupImageErrorHandling(img));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Setup error handling for a specific image
     */
    setupImageErrorHandling(img) {
        if (img.dataset.errorHandlerSetup) return;
        img.dataset.errorHandlerSetup = 'true';

        img.addEventListener('error', () => {
            this.handleImageError(img);
        });

        // Check if image is already broken
        if (img.complete && img.naturalHeight === 0) {
            this.handleImageError(img);
        }
    }

    /**
     * Handle resource loading errors
     */
    handleResourceError(event) {
        const resource = event.target;
        const resourceType = resource.tagName.toLowerCase();
        
        this.logError('Resource Loading Error', {
            type: resourceType,
            src: resource.src || resource.href,
            message: `Failed to load ${resourceType}`
        });

        // Handle specific resource types
        switch (resourceType) {
            case 'script':
                this.handleScriptError(resource);
                break;
            case 'link':
                this.handleStylesheetError(resource);
                break;
        }
    }

    /**
     * Handle script loading errors
     */
    handleScriptError(script) {
        console.warn(`Failed to load script: ${script.src}`);
        
        // Try to provide fallback functionality if possible
        if (script.src.includes('jquery')) {
            this.providejQueryFallback();
        }
    }

    /**
     * Handle stylesheet loading errors
     */
    handleStylesheetError(link) {
        console.warn(`Failed to load stylesheet: ${link.href}`);
        
        // Add fallback styles if critical CSS fails
        if (link.href.includes('bootstrap')) {
            this.provideBootstrapFallback();
        }
    }

    /**
     * Provide jQuery fallback
     */
    providejQueryFallback() {
        if (typeof $ === 'undefined') {
            // Simple jQuery-like selector function
            window.$ = function(selector) {
                if (typeof selector === 'string') {
                    return document.querySelector(selector);
                }
                return selector;
            };
            
            // Add basic methods
            $.getJSON = function(url, callback) {
                fetch(url)
                    .then(response => response.json())
                    .then(callback)
                    .catch(error => console.error('JSON fetch error:', error));
            };
        }
    }

    /**
     * Provide Bootstrap fallback styles
     */
    provideBootstrapFallback() {
        const fallbackCSS = `
            .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
            .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
            .col, .col-md-6, .col-lg-4 { flex: 1; padding: 0 15px; }
            .btn { padding: 8px 16px; border: 1px solid #ccc; background: #f8f9fa; cursor: pointer; }
            .btn-primary { background: #007bff; color: white; border-color: #007bff; }
            .card { border: 1px solid #dee2e6; border-radius: 4px; margin-bottom: 1rem; }
            .card-body { padding: 1rem; }
        `;
        
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
    }

    /**
     * Log error with context
     */
    logError(type, details, level = 'error') {
        const error = {
            type,
            details,
            level,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.errors.push(error);

        // Log to console with appropriate level
        const logMethod = console[level] || console.error;
        logMethod(`[${type}]`, details);

        // Send to error reporting service if available
        this.reportError(error);
    }

    /**
     * Report error to external service
     */
    reportError(error) {
        // This could be extended to send errors to an external logging service
        if (window.errorReportingEndpoint) {
            fetch(window.errorReportingEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(error)
            }).catch(() => {
                // Silently fail if error reporting fails
            });
        }
    }

    /**
     * Get error summary
     */
    getErrorSummary() {
        const summary = {
            total: this.errors.length,
            byType: {},
            byLevel: {},
            recent: this.errors.slice(-10)
        };

        this.errors.forEach(error => {
            summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
            summary.byLevel[error.level] = (summary.byLevel[error.level] || 0) + 1;
        });

        return summary;
    }

    /**
     * Clear error log
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Fix common undefined variable issues
     */
    fixUndefinedVariables() {
        // Provide safe defaults for common undefined variables
        window.safeGet = function(obj, path, defaultValue = null) {
            try {
                return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
            } catch {
                return defaultValue;
            }
        };

        // Safe JSON parsing
        window.safeJSONParse = function(str, defaultValue = {}) {
            try {
                return JSON.parse(str);
            } catch {
                return defaultValue;
            }
        };

        // Safe element selection
        window.safeQuerySelector = function(selector, defaultElement = null) {
            try {
                return document.querySelector(selector) || defaultElement;
            } catch {
                return defaultElement;
            }
        };
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Make it globally available
window.errorHandler = errorHandler;

// Add CSS for error handling
const errorHandlerCSS = `
    .image-error {
        border: 2px dashed #dc3545 !important;
        background-color: #f8f9fa !important;
    }

    .image-missing-src {
        border: 2px dashed #ffc107 !important;
        background-color: #fff3cd !important;
    }

    .image-retry-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    .image-retry-btn {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .image-retry-btn:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }

    .image-loading {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 20px;
        padding: 10px 15px;
        font-size: 14px;
    }

    .image-loading i {
        margin-right: 5px;
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = errorHandlerCSS;
document.head.appendChild(style);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}