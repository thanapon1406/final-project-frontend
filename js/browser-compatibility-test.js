/**
 * Browser Compatibility Testing Script
 * Tests cross-browser compatibility for the Huay Tueng Thao website
 */

class BrowserCompatibilityTester {
    constructor() {
        this.testResults = [];
        this.browserInfo = this.getBrowserInfo();
    }

    /**
     * Get browser information
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        const vendor = navigator.vendor || '';
        
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        
        // Chrome
        if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
            browserName = 'Chrome';
            const match = userAgent.match(/Chrome\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Firefox
        else if (/Firefox/.test(userAgent)) {
            browserName = 'Firefox';
            const match = userAgent.match(/Firefox\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Safari
        else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
            browserName = 'Safari';
            const match = userAgent.match(/Version\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Edge
        else if (/Edge/.test(userAgent) || /Edg/.test(userAgent)) {
            browserName = 'Edge';
            const match = userAgent.match(/(?:Edge|Edg)\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        
        return {
            name: browserName,
            version: browserVersion,
            userAgent: userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }

    /**
     * Run all compatibility tests
     */
    async runAllTests() {
        console.log(`🌐 Running Browser Compatibility Tests on ${this.browserInfo.name} ${this.browserInfo.version}`);
        console.log(`Platform: ${this.browserInfo.platform}`);
        console.log('='.repeat(60));
        
        // CSS Feature Tests
        await this.testCSSFeatures();
        
        // JavaScript API Tests
        await this.testJavaScriptAPIs();
        
        // HTML5 Feature Tests
        await this.testHTML5Features();
        
        // Bootstrap Compatibility Tests
        await this.testBootstrapCompatibility();
        
        // Font Loading Tests
        await this.testFontLoading();
        
        // Interactive Feature Tests
        await this.testInteractiveFeatures();
        
        // Performance Tests
        await this.testPerformanceAPIs();
        
        this.printResults();
        return this.testResults;
    }

    /**
     * Test CSS feature support
     */
    async testCSSFeatures() {
        console.log('🎨 Testing CSS Features...');
        
        const cssFeatures = [
            { name: 'Flexbox', property: 'display', value: 'flex' },
            { name: 'CSS Grid', property: 'display', value: 'grid' },
            { name: 'Custom Properties (CSS Variables)', property: '--test', value: 'value' },
            { name: 'Transform', property: 'transform', value: 'translateX(0px)' },
            { name: 'Transition', property: 'transition', value: 'all 0.3s ease' },
            { name: 'Border Radius', property: 'border-radius', value: '5px' },
            { name: 'Box Shadow', property: 'box-shadow', value: '0 0 5px rgba(0,0,0,0.5)' },
            { name: 'Gradient', property: 'background', value: 'linear-gradient(to right, red, blue)' },
            { name: 'Calc()', property: 'width', value: 'calc(100% - 20px)' },
            { name: 'Viewport Units', property: 'width', value: '100vw' }
        ];

        for (const feature of cssFeatures) {
            try {
                const isSupported = CSS.supports(feature.property, feature.value);
                this.addTestResult('CSS Features', feature.name, isSupported, 
                    isSupported ? 'Supported' : 'Not supported');
            } catch (error) {
                this.addTestResult('CSS Features', feature.name, false, 'CSS.supports() not available');
            }
        }
    }

    /**
     * Test JavaScript API support
     */
    async testJavaScriptAPIs() {
        console.log('⚙️ Testing JavaScript APIs...');
        
        const jsAPIs = [
            { 
                name: 'Fetch API', 
                test: () => typeof fetch !== 'undefined',
                fallback: 'XMLHttpRequest available as fallback'
            },
            { 
                name: 'Promise', 
                test: () => typeof Promise !== 'undefined',
                fallback: 'Required for modern JavaScript'
            },
            { 
                name: 'Local Storage', 
                test: () => typeof localStorage !== 'undefined' && localStorage !== null,
                fallback: 'Cookies can be used as fallback'
            },
            { 
                name: 'Session Storage', 
                test: () => typeof sessionStorage !== 'undefined' && sessionStorage !== null,
                fallback: 'Memory storage can be used as fallback'
            },
            { 
                name: 'JSON', 
                test: () => typeof JSON !== 'undefined',
                fallback: 'Required for data handling'
            },
            { 
                name: 'Array.from', 
                test: () => typeof Array.from === 'function',
                fallback: 'Polyfill available'
            },
            { 
                name: 'Object.assign', 
                test: () => typeof Object.assign === 'function',
                fallback: 'Polyfill available'
            },
            { 
                name: 'addEventListener', 
                test: () => typeof document.addEventListener === 'function',
                fallback: 'attachEvent for IE'
            },
            { 
                name: 'querySelector', 
                test: () => typeof document.querySelector === 'function',
                fallback: 'getElementById/getElementsByTagName'
            },
            { 
                name: 'classList', 
                test: () => document.body.classList !== undefined,
                fallback: 'className manipulation'
            }
        ];

        for (const api of jsAPIs) {
            try {
                const isSupported = api.test();
                this.addTestResult('JavaScript APIs', api.name, isSupported, 
                    isSupported ? 'Supported' : `Not supported - ${api.fallback}`);
            } catch (error) {
                this.addTestResult('JavaScript APIs', api.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Test HTML5 features
     */
    async testHTML5Features() {
        console.log('📄 Testing HTML5 Features...');
        
        const html5Features = [
            { 
                name: 'Canvas', 
                test: () => {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext && canvas.getContext('2d'));
                }
            },
            { 
                name: 'SVG', 
                test: () => {
                    return !!(document.createElementNS && 
                             document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
                }
            },
            { 
                name: 'Video', 
                test: () => {
                    const video = document.createElement('video');
                    return !!(video.canPlayType);
                }
            },
            { 
                name: 'Audio', 
                test: () => {
                    const audio = document.createElement('audio');
                    return !!(audio.canPlayType);
                }
            },
            { 
                name: 'Input Types (email, tel, url)', 
                test: () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'email');
                    return input.type === 'email';
                }
            },
            { 
                name: 'Placeholder Attribute', 
                test: () => {
                    const input = document.createElement('input');
                    return 'placeholder' in input;
                }
            },
            { 
                name: 'Required Attribute', 
                test: () => {
                    const input = document.createElement('input');
                    return 'required' in input;
                }
            },
            { 
                name: 'Data Attributes', 
                test: () => {
                    const div = document.createElement('div');
                    div.setAttribute('data-test', 'value');
                    return div.dataset && div.dataset.test === 'value';
                }
            }
        ];

        for (const feature of html5Features) {
            try {
                const isSupported = feature.test();
                this.addTestResult('HTML5 Features', feature.name, isSupported, 
                    isSupported ? 'Supported' : 'Not supported');
            } catch (error) {
                this.addTestResult('HTML5 Features', feature.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Test Bootstrap compatibility
     */
    async testBootstrapCompatibility() {
        console.log('🅱️ Testing Bootstrap Compatibility...');
        
        const bootstrapTests = [
            { 
                name: 'Bootstrap CSS Loaded', 
                test: () => {
                    const links = document.querySelectorAll('link[href*="bootstrap"]');
                    return links.length > 0;
                }
            },
            { 
                name: 'Bootstrap JavaScript Loaded', 
                test: () => {
                    return typeof bootstrap !== 'undefined';
                }
            },
            { 
                name: 'Bootstrap Modal', 
                test: () => {
                    return typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined';
                }
            },
            { 
                name: 'Bootstrap Carousel', 
                test: () => {
                    return typeof bootstrap !== 'undefined' && typeof bootstrap.Carousel !== 'undefined';
                }
            },
            { 
                name: 'Bootstrap Collapse', 
                test: () => {
                    return typeof bootstrap !== 'undefined' && typeof bootstrap.Collapse !== 'undefined';
                }
            },
            { 
                name: 'Bootstrap Dropdown', 
                test: () => {
                    return typeof bootstrap !== 'undefined' && typeof bootstrap.Dropdown !== 'undefined';
                }
            },
            { 
                name: 'Responsive Grid Classes', 
                test: () => {
                    const testDiv = document.createElement('div');
                    testDiv.className = 'col-md-6';
                    document.body.appendChild(testDiv);
                    const hasBootstrapStyles = window.getComputedStyle(testDiv).paddingLeft !== '0px';
                    document.body.removeChild(testDiv);
                    return hasBootstrapStyles;
                }
            }
        ];

        for (const test of bootstrapTests) {
            try {
                const isSupported = test.test();
                this.addTestResult('Bootstrap Compatibility', test.name, isSupported, 
                    isSupported ? 'Working' : 'Not working');
            } catch (error) {
                this.addTestResult('Bootstrap Compatibility', test.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Test font loading
     */
    async testFontLoading() {
        console.log('🔤 Testing Font Loading...');
        
        const fontTests = [
            { 
                name: 'Google Fonts API', 
                test: () => {
                    const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
                    return links.length > 0;
                }
            },
            { 
                name: 'Itim Font Loading', 
                test: () => {
                    const testElement = document.createElement('div');
                    testElement.style.fontFamily = 'Itim, sans-serif';
                    testElement.style.position = 'absolute';
                    testElement.style.visibility = 'hidden';
                    testElement.textContent = 'Test';
                    document.body.appendChild(testElement);
                    
                    const computedFont = window.getComputedStyle(testElement).fontFamily;
                    document.body.removeChild(testElement);
                    
                    return computedFont.includes('Itim');
                }
            },
            { 
                name: 'Font Awesome Icons', 
                test: () => {
                    const links = document.querySelectorAll('link[href*="font-awesome"]');
                    const hasFA = links.length > 0;
                    
                    // Also check if FA classes work
                    if (hasFA) {
                        const testIcon = document.createElement('i');
                        testIcon.className = 'fas fa-test';
                        testIcon.style.position = 'absolute';
                        testIcon.style.visibility = 'hidden';
                        document.body.appendChild(testIcon);
                        
                        const computedFont = window.getComputedStyle(testIcon, ':before').fontFamily;
                        document.body.removeChild(testIcon);
                        
                        return computedFont.includes('Font Awesome') || computedFont.includes('FontAwesome');
                    }
                    
                    return hasFA;
                }
            }
        ];

        for (const test of fontTests) {
            try {
                const isSupported = test.test();
                this.addTestResult('Font Loading', test.name, isSupported, 
                    isSupported ? 'Loaded successfully' : 'Failed to load');
            } catch (error) {
                this.addTestResult('Font Loading', test.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Test interactive features
     */
    async testInteractiveFeatures() {
        console.log('🎮 Testing Interactive Features...');
        
        const interactiveTests = [
            { 
                name: 'jQuery Library', 
                test: () => typeof $ !== 'undefined' && typeof jQuery !== 'undefined'
            },
            { 
                name: 'Touch Events', 
                test: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0
            },
            { 
                name: 'Mouse Events', 
                test: () => 'onmouseenter' in document.createElement('div')
            },
            { 
                name: 'Keyboard Events', 
                test: () => 'onkeydown' in document.createElement('input')
            },
            { 
                name: 'Resize Events', 
                test: () => 'onresize' in window
            },
            { 
                name: 'Scroll Events', 
                test: () => 'onscroll' in window
            },
            { 
                name: 'Animation Frame', 
                test: () => typeof requestAnimationFrame !== 'undefined'
            },
            { 
                name: 'Intersection Observer', 
                test: () => typeof IntersectionObserver !== 'undefined'
            }
        ];

        for (const test of interactiveTests) {
            try {
                const isSupported = test.test();
                this.addTestResult('Interactive Features', test.name, isSupported, 
                    isSupported ? 'Supported' : 'Not supported');
            } catch (error) {
                this.addTestResult('Interactive Features', test.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Test performance APIs
     */
    async testPerformanceAPIs() {
        console.log('⚡ Testing Performance APIs...');
        
        const performanceTests = [
            { 
                name: 'Performance API', 
                test: () => typeof performance !== 'undefined'
            },
            { 
                name: 'Performance.now()', 
                test: () => typeof performance !== 'undefined' && typeof performance.now === 'function'
            },
            { 
                name: 'Performance.memory', 
                test: () => typeof performance !== 'undefined' && typeof performance.memory !== 'undefined'
            },
            { 
                name: 'Navigation Timing', 
                test: () => typeof performance !== 'undefined' && typeof performance.navigation !== 'undefined'
            },
            { 
                name: 'Resource Timing', 
                test: () => typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function'
            },
            { 
                name: 'User Timing', 
                test: () => typeof performance !== 'undefined' && typeof performance.mark === 'function'
            }
        ];

        for (const test of performanceTests) {
            try {
                const isSupported = test.test();
                this.addTestResult('Performance APIs', test.name, isSupported, 
                    isSupported ? 'Available' : 'Not available');
            } catch (error) {
                this.addTestResult('Performance APIs', test.name, false, `Test failed: ${error.message}`);
            }
        }
    }

    /**
     * Add test result
     */
    addTestResult(category, name, passed, message) {
        this.testResults.push({
            category: category,
            name: name,
            passed: passed,
            message: message,
            browser: this.browserInfo.name,
            browserVersion: this.browserInfo.version,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${name}: ${message}`);
    }

    /**
     * Print test results
     */
    printResults() {
        console.log('\n📊 Browser Compatibility Test Results');
        console.log('=====================================');
        console.log(`Browser: ${this.browserInfo.name} ${this.browserInfo.version}`);
        console.log(`Platform: ${this.browserInfo.platform}`);
        console.log(`Language: ${this.browserInfo.language}`);
        console.log('');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Compatibility Score: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        // Group results by category
        const categories = [...new Set(this.testResults.map(result => result.category))];
        
        categories.forEach(category => {
            const categoryResults = this.testResults.filter(result => result.category === category);
            const categoryPassed = categoryResults.filter(result => result.passed).length;
            const categoryTotal = categoryResults.length;
            const categoryScore = ((categoryPassed / categoryTotal) * 100).toFixed(1);
            
            console.log(`\n${category}: ${categoryPassed}/${categoryTotal} (${categoryScore}%)`);
            
            // Show failed tests in this category
            const failedInCategory = categoryResults.filter(result => !result.passed);
            if (failedInCategory.length > 0) {
                failedInCategory.forEach(result => {
                    console.log(`  ❌ ${result.name}: ${result.message}`);
                });
            }
        });
        
        console.log('\n🎉 Browser Compatibility Testing Complete!');
    }

    /**
     * Generate compatibility report
     */
    generateReport() {
        const report = {
            browser: this.browserInfo,
            testResults: this.testResults,
            summary: {
                totalTests: this.testResults.length,
                passedTests: this.testResults.filter(result => result.passed).length,
                failedTests: this.testResults.filter(result => !result.passed).length,
                compatibilityScore: ((this.testResults.filter(result => result.passed).length / this.testResults.length) * 100).toFixed(1)
            },
            timestamp: new Date().toISOString()
        };
        
        return report;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserCompatibilityTester;
}

// Make available globally
window.BrowserCompatibilityTester = BrowserCompatibilityTester;