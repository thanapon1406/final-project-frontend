/**
 * Real-time Sync Testing Script
 * Tests the complete admin-to-frontend workflow
 */

const fs = require('fs').promises;
const path = require('path');

class RealTimeSyncTester {
    constructor() {
        this.dataPath = path.join(__dirname, '../data');
        this.testResults = [];
        this.originalData = new Map();
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Starting Real-time Sync Tests...\n');
        
        try {
            // Test 1: Homepage content updates
            await this.testHomepageContentUpdates();
            
            // Test 2: History page updates
            await this.testHistoryPageUpdates();
            
            // Test 3: Contact page updates
            await this.testContactPageUpdates();
            
            // Test 4: JSON file integrity
            await this.testJSONFileIntegrity();
            
            // Test 5: Cache invalidation
            await this.testCacheInvalidation();
            
            // Print results
            this.printTestResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        } finally {
            // Restore original data
            await this.restoreOriginalData();
        }
    }

    /**
     * Test homepage content updates
     */
    async testHomepageContentUpdates() {
        console.log('📝 Testing Homepage Content Updates...');
        
        const testCases = [
            {
                file: 'homepage-carousel.json',
                testData: {
                    slides: [{
                        id: 999,
                        title: 'Test Slide',
                        description: 'This is a test slide for real-time sync',
                        backgroundImage: 'test-image.jpg',
                        active: true
                    }]
                }
            },
            {
                file: 'homepage-services.json',
                testData: {
                    services: [{
                        id: 999,
                        icon: 'fas fa-test',
                        title: 'Test Service',
                        description: 'This is a test service for real-time sync'
                    }]
                }
            },
            {
                file: 'homepage-featured.json',
                testData: {
                    featured: [{
                        id: 999,
                        title: 'Test Featured',
                        description: 'This is test featured content',
                        image: 'test-featured.jpg',
                        link: 'https://test.com'
                    }]
                }
            }
        ];

        for (const testCase of testCases) {
            try {
                // Backup original data
                await this.backupOriginalData(testCase.file);
                
                // Write test data
                await this.writeTestData(testCase.file, testCase.testData);
                
                // Verify file was written correctly
                const writtenData = await this.readTestData(testCase.file);
                const isValid = JSON.stringify(writtenData) === JSON.stringify(testCase.testData);
                
                this.addTestResult(`Homepage ${testCase.file}`, isValid, 
                    isValid ? 'Content updated successfully' : 'Content update failed');
                
            } catch (error) {
                this.addTestResult(`Homepage ${testCase.file}`, false, error.message);
            }
        }
    }

    /**
     * Test history page updates
     */
    async testHistoryPageUpdates() {
        console.log('📚 Testing History Page Updates...');
        
        const testData = {
            title: 'Test History Title',
            content: 'This is test history content for real-time sync testing.',
            timeline: [
                {
                    year: 2024,
                    event: 'Test event for real-time sync'
                }
            ],
            images: [
                {
                    src: 'test-history.jpg',
                    title: 'Test History Image',
                    alt: 'Test image for history'
                }
            ]
        };

        try {
            await this.backupOriginalData('history-content.json');
            await this.writeTestData('history-content.json', testData);
            
            const writtenData = await this.readTestData('history-content.json');
            const isValid = JSON.stringify(writtenData) === JSON.stringify(testData);
            
            this.addTestResult('History Page Content', isValid,
                isValid ? 'History content updated successfully' : 'History content update failed');
                
        } catch (error) {
            this.addTestResult('History Page Content', false, error.message);
        }
    }

    /**
     * Test contact page updates
     */
    async testContactPageUpdates() {
        console.log('📞 Testing Contact Page Updates...');
        
        const testData = {
            organization: 'Test Organization for Real-time Sync',
            address: 'Test Address 123, Test District, Test Province 12345',
            phone: '053-999999',
            email: 'test@realtime-sync.com',
            socialMedia: {
                facebook: {
                    account: {
                        url: 'https://facebook.com/test-account'
                    },
                    fanpage: {
                        url: 'https://facebook.com/test-fanpage'
                    }
                }
            },
            googleMaps: {
                embedUrl: 'https://maps.google.com/test-embed',
                width: '100%',
                height: '400',
                style: 'border:0;',
                allowfullscreen: 'true',
                loading: 'lazy'
            }
        };

        try {
            await this.backupOriginalData('contact-content.json');
            await this.writeTestData('contact-content.json', testData);
            
            const writtenData = await this.readTestData('contact-content.json');
            const isValid = JSON.stringify(writtenData) === JSON.stringify(testData);
            
            this.addTestResult('Contact Page Content', isValid,
                isValid ? 'Contact content updated successfully' : 'Contact content update failed');
                
        } catch (error) {
            this.addTestResult('Contact Page Content', false, error.message);
        }
    }

    /**
     * Test JSON file integrity
     */
    async testJSONFileIntegrity() {
        console.log('🔍 Testing JSON File Integrity...');
        
        const jsonFiles = [
            'navigation.json',
            'homepage-carousel.json',
            'homepage-services.json',
            'homepage-featured.json',
            'homepage-news.json',
            'homepage-updates.json',
            'homepage-gallery.json',
            'history-content.json',
            'services-content.json',
            'contact-content.json',
            'about-content.json',
            'footer.json'
        ];

        for (const fileName of jsonFiles) {
            try {
                const filePath = path.join(this.dataPath, fileName);
                
                // Check if file exists
                await fs.access(filePath);
                
                // Try to parse JSON
                const content = await fs.readFile(filePath, 'utf8');
                JSON.parse(content);
                
                this.addTestResult(`JSON Integrity: ${fileName}`, true, 'Valid JSON structure');
                
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.addTestResult(`JSON Integrity: ${fileName}`, false, 'File does not exist');
                } else {
                    this.addTestResult(`JSON Integrity: ${fileName}`, false, `Invalid JSON: ${error.message}`);
                }
            }
        }
    }

    /**
     * Test cache invalidation mechanism
     */
    async testCacheInvalidation() {
        console.log('🔄 Testing Cache Invalidation...');
        
        // This test simulates the cache invalidation process
        try {
            const testFile = 'test-cache-invalidation.json';
            const testData = {
                timestamp: Date.now(),
                testContent: 'Cache invalidation test data'
            };
            
            // Write test data
            await this.writeTestData(testFile, testData);
            
            // Simulate cache invalidation by checking file modification time
            const filePath = path.join(this.dataPath, testFile);
            const stats = await fs.stat(filePath);
            const modificationTime = stats.mtime.getTime();
            
            // Check if modification time is recent (within last 5 seconds)
            const isRecent = (Date.now() - modificationTime) < 5000;
            
            this.addTestResult('Cache Invalidation', isRecent,
                isRecent ? 'Cache invalidation timestamp is current' : 'Cache invalidation timestamp is outdated');
            
            // Clean up test file
            await fs.unlink(filePath);
            
        } catch (error) {
            this.addTestResult('Cache Invalidation', false, error.message);
        }
    }

    /**
     * Backup original data
     */
    async backupOriginalData(fileName) {
        try {
            const filePath = path.join(this.dataPath, fileName);
            const originalContent = await fs.readFile(filePath, 'utf8');
            this.originalData.set(fileName, originalContent);
        } catch (error) {
            // File might not exist, which is okay
            console.log(`Note: Could not backup ${fileName} - file may not exist`);
        }
    }

    /**
     * Write test data
     */
    async writeTestData(fileName, data) {
        const filePath = path.join(this.dataPath, fileName);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    /**
     * Read test data
     */
    async readTestData(fileName) {
        const filePath = path.join(this.dataPath, fileName);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    }

    /**
     * Restore original data
     */
    async restoreOriginalData() {
        console.log('🔄 Restoring original data...');
        
        for (const [fileName, originalContent] of this.originalData) {
            try {
                const filePath = path.join(this.dataPath, fileName);
                await fs.writeFile(filePath, originalContent, 'utf8');
                console.log(`✅ Restored ${fileName}`);
            } catch (error) {
                console.error(`❌ Failed to restore ${fileName}:`, error.message);
            }
        }
    }

    /**
     * Add test result
     */
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed: passed,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${testName}: ${message}`);
    }

    /**
     * Print test results summary
     */
    printTestResults() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`  - ${result.name}: ${result.message}`);
                });
        }
        
        console.log('\n🎉 Real-time Sync Testing Complete!');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new RealTimeSyncTester();
    tester.runAllTests().catch(console.error);
}

module.exports = RealTimeSyncTester;