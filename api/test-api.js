/**
 * Simple API Test Script
 * Tests basic functionality of the content API
 */

const http = require('http');

const API_BASE = 'http://localhost:3001/api';

/**
 * Make HTTP request
 */
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve({ status: res.statusCode, data: result });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Run API tests
 */
async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    const tests = [
        {
            name: 'Health Check',
            url: `${API_BASE}/health`
        },
        {
            name: 'Get Homepage Content',
            url: `${API_BASE}/content/homepage`
        },
        {
            name: 'Get Carousel Content',
            url: `${API_BASE}/content/homepage/carousel`
        },
        {
            name: 'Get Contact Content',
            url: `${API_BASE}/content/contact`
        },
        {
            name: 'Get History Content',
            url: `${API_BASE}/content/history`
        },
        {
            name: 'Get Services Content',
            url: `${API_BASE}/content/services`
        },
        {
            name: 'Test Invalid Content Type',
            url: `${API_BASE}/content/invalid-type`
        }
    ];

    for (const test of tests) {
        try {
            console.log(`Testing: ${test.name}`);
            const result = await makeRequest(test.url, test.method, test.data);
            
            if (result.status === 200) {
                console.log(`✅ ${test.name} - SUCCESS`);
                if (result.data.data) {
                    console.log(`   Data keys: ${Object.keys(result.data.data).join(', ')}`);
                }
            } else if (result.status === 404 && test.name.includes('Invalid')) {
                console.log(`✅ ${test.name} - SUCCESS (Expected 404)`);
            } else {
                console.log(`❌ ${test.name} - FAILED (Status: ${result.status})`);
                console.log(`   Message: ${result.data.message || 'No message'}`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} - ERROR: ${error.message}`);
        }
        console.log('');
    }

    console.log('🏁 API Tests Complete');
}

// Check if server is running first
console.log('Checking if API server is running...');
makeRequest(`${API_BASE}/health`)
    .then(() => {
        console.log('✅ API server is running\n');
        runTests();
    })
    .catch(() => {
        console.log('❌ API server is not running');
        console.log('Please start the server with: npm start');
        console.log('Or in development mode: npm run dev');
    });