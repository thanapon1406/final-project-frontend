/**
 * API Endpoints Testing Script
 * Tests the admin API endpoints for real-time functionality
 */

class APIEndpointTester {
    constructor() {
        this.baseURL = 'http://localhost:3001';
        this.testResults = [];
        this.authToken = null;
    }

    /**
     * Run all API tests
     */
    async runAllTests() {
        console.log('🚀 Starting API Endpoint Tests...\n');
        
        // Import fetch dynamically
        const fetch = (await import('node-fetch')).default;
        this.fetch = fetch;
        
        try {
            // Test 1: Health check
            await this.testHealthEndpoint();
            
            // Test 2: Authentication
            await this.testAuthentication();
            
            // Test 3: Content retrieval
            await this.testContentRetrieval();
            
            // Test 4: Content update (requires auth)
            if (this.authToken) {
                await this.testContentUpdate();
                await this.testUpdateStatusEndpoint();
            }
            
            // Print results
            this.printTestResults();
            
        } catch (error) {
            console.error('❌ API test suite failed:', error);
        }
    }

    /**
     * Test health endpoint
     */
    async testHealthEndpoint() {
        console.log('🏥 Testing Health Endpoint...');
        
        try {
            const response = await this.fetch(`${this.baseURL}/api/health`);
            const data = await response.json();
            
            const isHealthy = response.ok && data.success;
            this.addTestResult('Health Endpoint', isHealthy, 
                isHealthy ? 'API is running' : 'API health check failed');
                
        } catch (error) {
            this.addTestResult('Health Endpoint', false, `Connection failed: ${error.message}`);
        }
    }

    /**
     * Test authentication
     */
    async testAuthentication() {
        console.log('🔐 Testing Authentication...');
        
        try {
            // Test with correct credentials
            const response = await this.fetch(`${this.baseURL}/api/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: 'huaytueng2024!'
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                this.authToken = data.data.token;
                this.addTestResult('Authentication - Valid Credentials', true, 'Login successful');
            } else {
                this.addTestResult('Authentication - Valid Credentials', false, 
                    data.message || 'Login failed');
            }
            
            // Test with invalid credentials
            const invalidResponse = await this.fetch(`${this.baseURL}/api/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: 'wrongpassword'
                })
            });
            
            const invalidData = await invalidResponse.json();
            const shouldFail = !invalidResponse.ok && !invalidData.success;
            
            this.addTestResult('Authentication - Invalid Credentials', shouldFail,
                shouldFail ? 'Correctly rejected invalid credentials' : 'Security issue: accepted invalid credentials');
                
        } catch (error) {
            this.addTestResult('Authentication', false, `Authentication test failed: ${error.message}`);
        }
    }

    /**
     * Test content retrieval endpoints
     */
    async testContentRetrieval() {
        console.log('📖 Testing Content Retrieval...');
        
        const contentTypes = [
            'homepage',
            'history',
            'contact',
            'navigation',
            'footer'
        ];
        
        const contentSections = [
            'homepage/carousel',
            'homepage/services',
            'homepage/featured'
        ];

        for (const contentType of contentTypes) {
            try {
                const response = await this.fetch(`${this.baseURL}/api/content/${contentType}`);
                const data = await response.json();
                
                const isValid = response.ok && data.success;
                this.addTestResult(`Content Retrieval: ${contentType}`, isValid,
                    isValid ? 'Content retrieved successfully' : `Failed to retrieve content: ${data.message}`);
                    
            } catch (error) {
                this.addTestResult(`Content Retrieval: ${contentType}`, false, 
                    `Request failed: ${error.message}`);
            }
        }
        
        // Test content sections
        for (const contentSection of contentSections) {
            try {
                const response = await this.fetch(`${this.baseURL}/api/content/${contentSection}`);
                const data = await response.json();
                
                const isValid = response.ok && data.success;
                this.addTestResult(`Content Section: ${contentSection}`, isValid,
                    isValid ? 'Content section retrieved successfully' : `Failed to retrieve content section: ${data.message}`);
                    
            } catch (error) {
                this.addTestResult(`Content Section: ${contentSection}`, false, 
                    `Request failed: ${error.message}`);
            }
        }
    }

    /**
     * Test content update endpoints
     */
    async testContentUpdate() {
        console.log('✏️ Testing Content Update...');
        
        const testData = {
            slides: [{
                id: 999,
                title: 'API Test Slide',
                description: 'This slide was created by the API test',
                backgroundClass: 'bg-test-api',
                active: true
            }]
        };

        try {
            const response = await this.fetch(`${this.baseURL}/api/admin/content/homepage-carousel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(testData)
            });
            
            const data = await response.json();
            
            const isValid = response.ok && data.success && data.data.cacheInvalidated;
            this.addTestResult('Content Update', isValid,
                isValid ? 'Content updated with cache invalidation' : `Update failed: ${data.message}`);
                
        } catch (error) {
            this.addTestResult('Content Update', false, `Update request failed: ${error.message}`);
        }
    }

    /**
     * Test update status endpoint
     */
    async testUpdateStatusEndpoint() {
        console.log('🔄 Testing Update Status Endpoint...');
        
        try {
            const response = await this.fetch(`${this.baseURL}/api/content/update-status/homepage-carousel?lastUpdate=0`);
            const data = await response.json();
            
            const isValid = response.ok && data.success && typeof data.data.hasUpdate === 'boolean';
            this.addTestResult('Update Status Endpoint', isValid,
                isValid ? `Update status retrieved: ${data.data.hasUpdate ? 'Has updates' : 'No updates'}` : 
                         `Status check failed: ${data.message}`);
                
        } catch (error) {
            this.addTestResult('Update Status Endpoint', false, 
                `Status request failed: ${error.message}`);
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
        console.log('\n📊 API Test Results Summary');
        console.log('============================');
        
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
        
        console.log('\n🎉 API Endpoint Testing Complete!');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new APIEndpointTester();
    tester.runAllTests().catch(console.error);
}

module.exports = APIEndpointTester;