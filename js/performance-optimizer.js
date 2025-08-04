/**
 * Performance Optimization Script
 * Handles image optimization, lazy loading, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.performanceMetrics = {};
        this.optimizationResults = [];
        this.imageObserver = null;
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        console.log('🚀 Initializing Performance Optimizations...');
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        // Initialize lazy loading for images
        this.initializeLazyLoading();
        
        // Optimize CSS loading
        this.optimizeCSSLoading();
        
        // Optimize JavaScript execution
        this.optimizeJavaScriptExecution();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Setup performance reporting
        this.setupPerformanceReporting();
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        if (!performance || !performance.mark) {
            console.warn('Performance API not available');
            return;
        }

        // Mark the start of optimization
        performance.mark('optimization-start');
        
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.measurePageLoadPerformance();
        });

        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            performance.mark('dom-content-loaded');
            this.measureDOMLoadPerformance();
        });
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        console.log('🖼️ Setting up lazy loading for images...');
        
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported, falling back to immediate loading');
            this.loadAllImages();
            return;
        }

        // Create intersection observer for lazy loading
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before image comes into view
            threshold: 0.01
        });

        // Find all images that should be lazy loaded
        this.setupLazyImages();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyImages() {
        const images = document.querySelectorAll('img[data-src], img[src]');
        let lazyImages = 0;
        let immediateImages = 0;

        images.forEach(img => {
            // Skip images that are already loaded or in viewport
            if (this.isInViewport(img) || img.complete) {
                immediateImages++;
                return;
            }

            // Setup lazy loading
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
            }

            img.classList.add('lazy-image');
            this.imageObserver.observe(img);
            lazyImages++;
        });

        this.optimizationResults.push({
            type: 'Lazy Loading',
            message: `${lazyImages} images set for lazy loading, ${immediateImages} loaded immediately`,
            impact: 'Reduced initial page load time'
        });
    }

    /**
     * Load image when it comes into view
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Create a new image to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            img.classList.remove('lazy-image');
            img.classList.add('lazy-loaded');
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
        };

        imageLoader.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            img.classList.add('lazy-error');
        };

        imageLoader.src = src;
    }

    /**
     * Generate placeholder for lazy loading
     */
    generatePlaceholder(width, height) {
        // Create a simple SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6c757d" font-family="Arial, sans-serif" font-size="14">
                    Loading...
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Load all images immediately (fallback)
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        });
    }

    /**
     * Optimize CSS loading
     */
    optimizeCSSLoading() {
        console.log('🎨 Optimizing CSS loading...');
        
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let optimizedSheets = 0;
        let totalSheets = stylesheets.length;

        stylesheets.forEach(sheet => {
            // Add preload hint for critical CSS
            if (sheet.href.includes('bootstrap') || sheet.href.includes('style.css')) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'style';
                preloadLink.href = sheet.href;
                preloadLink.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
                
                // Insert before the original stylesheet
                sheet.parentNode.insertBefore(preloadLink, sheet);
                optimizedSheets++;
            }

            // Add media attribute for non-critical CSS
            if (sheet.href.includes('font-awesome')) {
                sheet.media = 'print';
                sheet.onload = function() {
                    this.media = 'all';
                };
            }
        });

        this.optimizationResults.push({
            type: 'CSS Loading',
            message: `${optimizedSheets}/${totalSheets} stylesheets optimized with preload hints`,
            impact: 'Improved CSS loading performance'
        });
    }

    /**
     * Optimize JavaScript execution
     */
    optimizeJavaScriptExecution() {
        console.log('⚡ Optimizing JavaScript execution...');
        
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[src]');
        let deferredScripts = 0;

        scripts.forEach(script => {
            // Skip already deferred or async scripts
            if (script.defer || script.async) return;
            
            // Defer non-critical scripts
            if (!script.src.includes('jquery') && 
                !script.src.includes('bootstrap') && 
                !script.src.includes('main.js')) {
                script.defer = true;
                deferredScripts++;
            }
        });

        // Optimize DOM queries by caching selectors
        this.optimizeDOMQueries();

        // Setup requestAnimationFrame for smooth animations
        this.optimizeAnimations();

        this.optimizationResults.push({
            type: 'JavaScript Execution',
            message: `${deferredScripts} scripts deferred, DOM queries optimized`,
            impact: 'Reduced JavaScript blocking time'
        });
    }

    /**
     * Optimize DOM queries
     */
    optimizeDOMQueries() {
        // Cache frequently used selectors
        window.cachedSelectors = {
            body: document.body,
            navbar: document.querySelector('.navbar'),
            carousel: document.querySelector('.carousel'),
            footer: document.querySelector('footer')
        };

        // Provide helper function for efficient DOM queries
        window.$ = window.$ || function(selector) {
            if (window.cachedSelectors[selector]) {
                return window.cachedSelectors[selector];
            }
            return document.querySelector(selector);
        };
    }

    /**
     * Optimize animations
     */
    optimizeAnimations() {
        // Setup efficient animation frame handling
        let animationQueue = [];
        let isAnimating = false;

        window.optimizedAnimate = function(callback) {
            animationQueue.push(callback);
            
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(function processAnimations() {
                    while (animationQueue.length > 0) {
                        const callback = animationQueue.shift();
                        callback();
                    }
                    isAnimating = false;
                });
            }
        };
    }

    /**
     * Monitor resource loading
     */
    monitorResourceLoading() {
        if (!performance.getEntriesByType) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');
                this.analyzeResourcePerformance(resources);
            }, 1000);
        });
    }

    /**
     * Analyze resource performance
     */
    analyzeResourcePerformance(resources) {
        const resourceAnalysis = {
            images: [],
            stylesheets: [],
            scripts: [],
            fonts: [],
            other: []
        };

        resources.forEach(resource => {
            const analysis = {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize || 0,
                type: this.getResourceType(resource.name)
            };

            resourceAnalysis[analysis.type].push(analysis);
        });

        // Find slow loading resources
        const slowResources = resources.filter(r => r.duration > 1000);
        const largeResources = resources.filter(r => (r.transferSize || 0) > 100000);

        this.performanceMetrics.resourceAnalysis = resourceAnalysis;
        this.performanceMetrics.slowResources = slowResources;
        this.performanceMetrics.largeResources = largeResources;

        this.optimizationResults.push({
            type: 'Resource Analysis',
            message: `${slowResources.length} slow resources, ${largeResources.length} large resources identified`,
            impact: 'Performance bottlenecks identified'
        });
    }

    /**
     * Get resource type from URL
     */
    getResourceType(url) {
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'images';
        if (url.match(/\.(css)$/i)) return 'stylesheets';
        if (url.match(/\.(js)$/i)) return 'scripts';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'fonts';
        return 'other';
    }

    /**
     * Measure page load performance
     */
    measurePageLoadPerformance() {
        if (!performance.timing) return;

        const timing = performance.timing;
        const metrics = {
            pageLoadTime: timing.loadEventEnd - timing.navigationStart,
            domContentLoadedTime: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaintTime: timing.responseStart - timing.navigationStart,
            dnsLookupTime: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnectTime: timing.connectEnd - timing.connectStart,
            serverResponseTime: timing.responseEnd - timing.requestStart
        };

        this.performanceMetrics.pageLoad = metrics;

        // Performance thresholds
        const thresholds = {
            pageLoadTime: 3000,
            domContentLoadedTime: 1500,
            serverResponseTime: 500
        };

        // Check performance against thresholds
        Object.keys(thresholds).forEach(metric => {
            const value = metrics[metric];
            const threshold = thresholds[metric];
            const status = value <= threshold ? 'Good' : 'Needs Improvement';
            
            this.optimizationResults.push({
                type: 'Page Load Metrics',
                message: `${metric}: ${value}ms (${status})`,
                impact: status === 'Good' ? 'Meeting performance targets' : 'Performance optimization needed'
            });
        });
    }

    /**
     * Measure DOM load performance
     */
    measureDOMLoadPerformance() {
        const domElements = document.querySelectorAll('*').length;
        const domDepth = this.calculateDOMDepth();
        
        this.performanceMetrics.dom = {
            elementCount: domElements,
            depth: domDepth
        };

        // DOM complexity thresholds
        const elementThreshold = 1500;
        const depthThreshold = 15;

        this.optimizationResults.push({
            type: 'DOM Complexity',
            message: `${domElements} elements (${domElements <= elementThreshold ? 'Good' : 'High'}), depth: ${domDepth} (${domDepth <= depthThreshold ? 'Good' : 'Deep'})`,
            impact: domElements <= elementThreshold && domDepth <= depthThreshold ? 'Optimal DOM structure' : 'Consider DOM optimization'
        });
    }

    /**
     * Calculate DOM depth
     */
    calculateDOMDepth(element = document.body, depth = 0) {
        let maxDepth = depth;
        
        for (let child of element.children) {
            const childDepth = this.calculateDOMDepth(child, depth + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
        
        return maxDepth;
    }

    /**
     * Setup performance reporting
     */
    setupPerformanceReporting() {
        // Report performance metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.generatePerformanceReport();
            }, 2000);
        });

        // Setup periodic performance monitoring
        setInterval(() => {
            this.monitorRuntimePerformance();
        }, 30000); // Every 30 seconds
    }

    /**
     * Monitor runtime performance
     */
    monitorRuntimePerformance() {
        if (!performance.memory) return;

        const memory = performance.memory;
        const memoryUsage = {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        };

        this.performanceMetrics.memory = memoryUsage;

        // Check for memory leaks
        if (memoryUsage.used > memoryUsage.limit * 0.8) {
            console.warn('High memory usage detected:', memoryUsage);
        }
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        console.log('📊 Performance Optimization Report');
        console.log('==================================');
        
        // Summary of optimizations
        console.log('\n🔧 Optimizations Applied:');
        this.optimizationResults.forEach(result => {
            console.log(`✅ ${result.type}: ${result.message}`);
            console.log(`   Impact: ${result.impact}`);
        });

        // Performance metrics
        if (this.performanceMetrics.pageLoad) {
            console.log('\n⏱️ Page Load Metrics:');
            Object.entries(this.performanceMetrics.pageLoad).forEach(([metric, value]) => {
                console.log(`   ${metric}: ${value}ms`);
            });
        }

        // Memory usage
        if (this.performanceMetrics.memory) {
            console.log('\n🧠 Memory Usage:');
            const memory = this.performanceMetrics.memory;
            console.log(`   Used: ${memory.used}MB / ${memory.total}MB (${((memory.used / memory.total) * 100).toFixed(1)}%)`);
        }

        // Resource analysis
        if (this.performanceMetrics.resourceAnalysis) {
            console.log('\n📦 Resource Analysis:');
            const analysis = this.performanceMetrics.resourceAnalysis;
            Object.entries(analysis).forEach(([type, resources]) => {
                if (resources.length > 0) {
                    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
                    const avgDuration = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
                    console.log(`   ${type}: ${resources.length} files, ${Math.round(totalSize / 1024)}KB total, ${Math.round(avgDuration)}ms avg load time`);
                }
            });
        }

        // Performance score
        const score = this.calculatePerformanceScore();
        console.log(`\n🏆 Performance Score: ${score}/100`);
        
        if (score >= 90) {
            console.log('🎉 Excellent performance!');
        } else if (score >= 70) {
            console.log('👍 Good performance, minor optimizations possible');
        } else if (score >= 50) {
            console.log('⚠️ Fair performance, optimization recommended');
        } else {
            console.log('🚨 Poor performance, optimization required');
        }

        return {
            optimizations: this.optimizationResults,
            metrics: this.performanceMetrics,
            score: score,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Calculate overall performance score
     */
    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for slow page load
        if (this.performanceMetrics.pageLoad) {
            const loadTime = this.performanceMetrics.pageLoad.pageLoadTime;
            if (loadTime > 3000) score -= 20;
            else if (loadTime > 2000) score -= 10;
            else if (loadTime > 1000) score -= 5;
        }

        // Deduct points for slow resources
        if (this.performanceMetrics.slowResources) {
            score -= Math.min(this.performanceMetrics.slowResources.length * 5, 20);
        }

        // Deduct points for large resources
        if (this.performanceMetrics.largeResources) {
            score -= Math.min(this.performanceMetrics.largeResources.length * 3, 15);
        }

        // Deduct points for high memory usage
        if (this.performanceMetrics.memory) {
            const memoryUsage = this.performanceMetrics.memory.used / this.performanceMetrics.memory.limit;
            if (memoryUsage > 0.8) score -= 15;
            else if (memoryUsage > 0.6) score -= 10;
            else if (memoryUsage > 0.4) score -= 5;
        }

        // Deduct points for complex DOM
        if (this.performanceMetrics.dom) {
            if (this.performanceMetrics.dom.elementCount > 1500) score -= 10;
            if (this.performanceMetrics.dom.depth > 15) score -= 10;
        }

        return Math.max(0, Math.round(score));
    }

    /**
     * Get optimization recommendations
     */
    getOptimizationRecommendations() {
        const recommendations = [];

        // Check for optimization opportunities
        if (this.performanceMetrics.pageLoad && this.performanceMetrics.pageLoad.pageLoadTime > 3000) {
            recommendations.push({
                type: 'Page Load',
                priority: 'High',
                recommendation: 'Optimize page load time by reducing resource sizes and implementing caching'
            });
        }

        if (this.performanceMetrics.largeResources && this.performanceMetrics.largeResources.length > 0) {
            recommendations.push({
                type: 'Resource Size',
                priority: 'Medium',
                recommendation: 'Compress large resources, especially images and JavaScript files'
            });
        }

        if (this.performanceMetrics.dom && this.performanceMetrics.dom.elementCount > 1500) {
            recommendations.push({
                type: 'DOM Complexity',
                priority: 'Low',
                recommendation: 'Consider simplifying DOM structure to improve rendering performance'
            });
        }

        return recommendations;
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

// Make available globally
window.PerformanceOptimizer = PerformanceOptimizer;