/**
 * Console Error Testing Script
 * Run this script in the browser console to test all pages for errors
 */

class PageTester {
    constructor() {
        this.pages = [
            'index.html',
            'page-history.html',
            'page-contact.html',
            'page-services.html',
            'page-news.html',
            'test-error-handling.html'
        ];
        this.results = [];
        this.currentPageIndex = 0;
    }

    async testAllPages() {
        console.log('🚀 Starting comprehensive page testing...');
        
        for (let i = 0; i < this.pages.length; i++) {
            const page = this.pages[i];
            console.log(`\n📄 Testing page ${i + 1}/${this.pages.length}: ${page}`);
            
            try {
                const result = await this.testPage(page);
                this.results.push(result);
                console.log(`✅ ${page}: ${result.status}`);
            } catch (error) {
                console.error(`❌ ${page}: Failed to test - ${error.message}`);
                this.results.push({
                    page: page,
                    status: 'ERROR',
                    error: error.message,
                    consoleErrors: [],
                    imageErrors: [],
                    loadTime: 0
                });
            }
        }

        this.generateReport();
    }

    async testPage(pageUrl) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '1200px';
            iframe.style.height = '800px';
            
            const result = {
                page: pageUrl,
                status: 'LOADING',
                consoleErrors: [],
                imageErrors: [],
                loadTime: 0,
                resources: {
                    total: 0,
                    loaded: 0,
                    failed: 0
                }
            };

            // Set up error capturing
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeWindow = iframe.contentWindow;

                    // Wait a bit for the page to fully load
                    setTimeout(() => {
                        // Check for JavaScript errors
                        if (iframeWindow.errorHandler) {
                            const errorSummary = iframeWindow.errorHandler.getErrorSummary();
                            result.consoleErrors = errorSummary.recent || [];
                        }

                        // Check for broken images
                        const images = iframeDoc.querySelectorAll('img');
                        images.forEach((img, index) => {
                            if (img.classList.contains('image-error') || 
                                img.classList.contains('image-missing-src') ||
                                (img.complete && img.naturalHeight === 0)) {
                                result.imageErrors.push({
                                    index: index,
                                    src: img.src,
                                    alt: img.alt,
                                    classes: Array.from(img.classList).join(' ')
                                });
                            }
                        });

                        // Check resource loading
                        result.resources.total = images.length;
                        result.resources.loaded = Array.from(images).filter(img => 
                            img.complete && img.naturalHeight > 0
                        ).length;
                        result.resources.failed = result.imageErrors.length;

                        result.loadTime = Date.now() - startTime;
                        result.status = result.consoleErrors.length === 0 && result.imageErrors.length === 0 ? 'PASS' : 'ISSUES';

                        document.body.removeChild(iframe);
                        resolve(result);
                    }, 3000); // Wait 3 seconds for full loading

                } catch (error) {
                    result.status = 'ERROR';
                    result.error = error.message;
                    result.loadTime = Date.now() - startTime;
                    document.body.removeChild(iframe);
                    resolve(result);
                }
            };

            iframe.onerror = () => {
                result.status = 'LOAD_ERROR';
                result.error = 'Failed to load page';
                result.loadTime = Date.now() - startTime;
                document.body.removeChild(iframe);
                resolve(result);
            };

            document.body.appendChild(iframe);
            iframe.src = pageUrl;
        });
    }

    generateReport() {
        console.log('\n📊 COMPREHENSIVE TEST REPORT');
        console.log('================================');

        const summary = {
            total: this.results.length,
            passed: 0,
            issues: 0,
            errors: 0,
            totalConsoleErrors: 0,
            totalImageErrors: 0,
            avgLoadTime: 0
        };

        this.results.forEach(result => {
            switch (result.status) {
                case 'PASS':
                    summary.passed++;
                    break;
                case 'ISSUES':
                    summary.issues++;
                    break;
                default:
                    summary.errors++;
                    break;
            }
            summary.totalConsoleErrors += result.consoleErrors.length;
            summary.totalImageErrors += result.imageErrors.length;
            summary.avgLoadTime += result.loadTime;
        });

        summary.avgLoadTime = Math.round(summary.avgLoadTime / this.results.length);

        // Print summary
        console.log(`\n📈 SUMMARY:`);
        console.log(`Total Pages: ${summary.total}`);
        console.log(`✅ Passed: ${summary.passed}`);
        console.log(`⚠️  Issues: ${summary.issues}`);
        console.log(`❌ Errors: ${summary.errors}`);
        console.log(`🐛 Total Console Errors: ${summary.totalConsoleErrors}`);
        console.log(`🖼️  Total Image Errors: ${summary.totalImageErrors}`);
        console.log(`⏱️  Average Load Time: ${summary.avgLoadTime}ms`);

        // Detailed results
        console.log(`\n📋 DETAILED RESULTS:`);
        this.results.forEach((result, index) => {
            const statusIcon = result.status === 'PASS' ? '✅' : 
                              result.status === 'ISSUES' ? '⚠️' : '❌';
            
            console.log(`\n${index + 1}. ${statusIcon} ${result.page} (${result.loadTime}ms)`);
            
            if (result.consoleErrors.length > 0) {
                console.log(`   🐛 Console Errors: ${result.consoleErrors.length}`);
                result.consoleErrors.forEach(error => {
                    console.log(`      • ${error.type}: ${error.details.message || JSON.stringify(error.details).substring(0, 100)}`);
                });
            }
            
            if (result.imageErrors.length > 0) {
                console.log(`   🖼️  Image Errors: ${result.imageErrors.length}`);
                result.imageErrors.forEach(imgError => {
                    console.log(`      • Image ${imgError.index}: ${imgError.src.substring(0, 50)}... (${imgError.classes})`);
                });
            }

            if (result.resources) {
                console.log(`   📦 Resources: ${result.resources.loaded}/${result.resources.total} loaded, ${result.resources.failed} failed`);
            }

            if (result.error) {
                console.log(`   ❌ Error: ${result.error}`);
            }
        });

        // Recommendations
        console.log(`\n💡 RECOMMENDATIONS:`);
        if (summary.totalConsoleErrors > 0) {
            console.log(`• Fix ${summary.totalConsoleErrors} console errors across pages`);
        }
        if (summary.totalImageErrors > 0) {
            console.log(`• Review ${summary.totalImageErrors} image loading issues`);
        }
        if (summary.avgLoadTime > 3000) {
            console.log(`• Optimize page load time (current average: ${summary.avgLoadTime}ms)`);
        }
        if (summary.passed === summary.total) {
            console.log(`🎉 All pages passed! Great job on error handling!`);
        }

        // Return results for further processing
        return {
            summary,
            results: this.results
        };
    }

    // Quick test for current page only
    testCurrentPage() {
        console.log('🔍 Testing current page for errors...');
        
        const result = {
            page: window.location.pathname,
            consoleErrors: [],
            imageErrors: [],
            resources: {
                total: 0,
                loaded: 0,
                failed: 0
            }
        };

        // Check console errors
        if (window.errorHandler) {
            const errorSummary = window.errorHandler.getErrorSummary();
            result.consoleErrors = errorSummary.recent || [];
            console.log(`🐛 Console Errors: ${result.consoleErrors.length}`);
            result.consoleErrors.forEach(error => {
                console.log(`   • ${error.type}: ${error.details.message || JSON.stringify(error.details)}`);
            });
        }

        // Check images
        const images = document.querySelectorAll('img');
        result.resources.total = images.length;
        
        images.forEach((img, index) => {
            if (img.classList.contains('image-error') || 
                img.classList.contains('image-missing-src') ||
                (img.complete && img.naturalHeight === 0)) {
                result.imageErrors.push({
                    index: index,
                    src: img.src,
                    alt: img.alt,
                    classes: Array.from(img.classList).join(' ')
                });
            } else if (img.complete && img.naturalHeight > 0) {
                result.resources.loaded++;
            }
        });

        result.resources.failed = result.imageErrors.length;

        console.log(`🖼️  Image Status: ${result.resources.loaded}/${result.resources.total} loaded, ${result.resources.failed} failed`);
        result.imageErrors.forEach(imgError => {
            console.log(`   • Image ${imgError.index}: ${imgError.src} (${imgError.classes})`);
        });

        // Performance check
        if (window.performanceOptimizer) {
            const perfReport = window.performanceOptimizer.generatePerformanceReport();
            console.log(`⚡ Performance Score: ${perfReport.score}/100`);
        }

        const status = result.consoleErrors.length === 0 && result.imageErrors.length === 0 ? 'PASS' : 'ISSUES';
        console.log(`\n📊 Current Page Status: ${status === 'PASS' ? '✅' : '⚠️'} ${status}`);

        return result;
    }
}

// Create global instance
window.pageTester = new PageTester();

// Provide easy-to-use functions
window.testAllPages = () => window.pageTester.testAllPages();
window.testCurrentPage = () => window.pageTester.testCurrentPage();

console.log('🧪 Page Testing Tools Loaded!');
console.log('Usage:');
console.log('  testCurrentPage() - Test current page only');
console.log('  testAllPages() - Test all pages (takes ~30 seconds)');
console.log('  pageTester.results - View last test results');