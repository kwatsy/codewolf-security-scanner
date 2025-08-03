// 🐺 VibeWolf Security Scanner - Extension Test File
// This file contains intentional security vulnerabilities for testing

console.log('🧪 Testing VibeWolf Security Scanner...');

// 🔴 CRITICAL: Hardcoded API Key (should be detected)
const firebaseConfig = {
    apiKey: "AIzaGxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    authDomain: "test-project.firebaseapp.com"
};

// 🟠 HIGH: XSS Vulnerability (should be detected)
function updateContent(userInput) {
    document.getElementById('content').innerHTML = userInput + '<p>Welcome!</p>';
}

// 🟠 HIGH: Unsafe eval usage (should be detected)
function executeCode(code) {
    eval(code); // Dangerous!
}

// 🟡 MEDIUM: Insecure HTTP request (should be detected)
fetch('http://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));

// 🟡 MEDIUM: Weak cryptography (should be detected)
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('password').digest('hex');

// ✅ SAFE: This should not trigger any warnings
const secureConfig = {
    apiUrl: process.env.API_URL,
    timeout: 5000
};

console.log('🎯 Expected VibeWolf detections:');
console.log('- 1 CRITICAL: Hardcoded API key');
console.log('- 2 HIGH: XSS vulnerability, unsafe eval');
console.log('- 2 MEDIUM: Insecure HTTP, weak crypto');
console.log('- Total: 5 security issues should be found');

// Test the extension by:
// 1. Opening this file in Windsurf
// 2. Running: 🐺 VibeWolf: Scan Current File
// 3. Checking that red squiggly lines appear
// 4. Hovering over issues to see recommendations
// 5. Running: 🐺 VibeWolf: Generate Security Report
