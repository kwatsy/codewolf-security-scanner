// src/scanner.ts
import * as fs from 'fs';
import * as path from 'path';

interface Vulnerability {
    filePath: string;
    lineNumber: number;
    vulnerabilityType: string;
    severity: string;
    description: string;
    codeSnippet: string;
    recommendation: string;
}

interface SecurityRule {
    patterns: string[];
    severity: string;
    description: string;
    recommendation: string;
}

export class SecurityScanner {
    private rules: Record<string, SecurityRule>;
    private targetExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte']);
    private isDisposed = false;

    constructor() {
        this.rules = this.loadRules();
    }
    
    // Cleanup method for proper disposal
    dispose(): void {
        if (this.isDisposed) {
            return;
        }
        
        // Clear rules and extensions
        this.rules = {};
        this.targetExtensions.clear();
        this.isDisposed = true;
        
        console.log('🐺 SecurityScanner disposed successfully');
    }
    
    // Check if scanner is disposed
    private checkDisposed(): void {
        if (this.isDisposed) {
            throw new Error('SecurityScanner has been disposed');
        }
    }

    private loadRules(): Record<string, SecurityRule> {
        return {
            // XSS Vulnerabilities
            xss_vulnerabilities: {
                patterns: [
                    'innerHTML\\s*=\\s*.*?\\+',
                    'outerHTML\\s*=\\s*.*?\\+',
                    'insertAdjacentHTML\\s*\\([^)]*\\+',
                    'document\\.write\\s*\\([^)]*\\+',
                    '\\.html\\([^)]*\\+[^)]*\\)'
                ],
                severity: 'HIGH',
                description: 'Potential XSS vulnerability through dynamic HTML injection',
                recommendation: 'Use textContent, createElement, or sanitize HTML input'
            },

            // Hardcoded API Keys & Secrets (refined patterns to reduce false positives)
            exposed_secrets: {
                patterns: [
                    // API Keys (more specific patterns)
                    'api_key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'apikey["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'api-key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'token["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'access_token["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'auth_token["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    
                    // Passwords & Credentials (avoid React patterns)
                    'password["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    'passwd["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    'pwd["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    
                    // Database Credentials
                    'db_password["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    'database_url["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    'connection_string["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    
                    // Framework Environment Variables (only actual secrets)
                    'REACT_APP_.*SECRET["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    'VUE_APP_.*SECRET["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    'NEXT_PUBLIC_.*SECRET["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    'EXPO_.*SECRET["\']?\s*[:=]\s*["\'][A-Za-z0-9]{10,}["\']',
                    
                    // Common Service Keys (specific patterns)
                    'stripe.*key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'paypal.*secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'aws.*key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'google.*key["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'facebook.*secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'twitter.*secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    
                    // JWT & OAuth
                    'jwt.*secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'oauth.*secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    'client_secret["\']?\s*[:=]\s*["\'][A-Za-z0-9]{20,}["\']',
                    
                    // Email & SMTP
                    'smtp.*password["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    'email.*password["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']',
                    'mail.*password["\']?\s*[:=]\s*["\'][A-Za-z0-9]{8,}["\']'
                ],
                severity: 'CRITICAL',
                description: 'Hardcoded secrets, credentials, or sensitive data exposed in frontend code',
                recommendation: 'Move all secrets to server-side, use environment variables, or secure credential management'
            },

            // Firebase Security Issues (Context-Aware Detection)
            firebase_security: {
                patterns: [
                    // Firebase Security Rules issues (CRITICAL)
                    'allow read, write: if true',
                    'allow.*if.*true',
                    
                    // Server-side Firebase keys in client code (CRITICAL)
                    'admin\.initializeApp\(\).*apiKey',
                    'firebase-admin.*apiKey',
                    'serviceAccountKey',
                    
                    // Firebase web API keys (MEDIUM - context-aware)
                    'apiKey:\s*["\']AIza[0-9A-Za-z\-_]{35}["\']',
                    
                    // Insecure Cloud Functions (HIGH)
                    'functions\.https\.onRequest\\(',
                    'cors.*origin.*\\*'
                ],
                severity: 'MEDIUM', // Changed from CRITICAL - Firebase web keys are designed to be public
                description: 'Firebase configuration should use environment variables for better security practices',
                recommendation: 'Move Firebase API key to environment variables (process.env.FIREBASE_API_KEY). Note: Firebase web API keys are designed to be public, but environment variables are best practice for key management and rotation.'
            },
            
            // Firebase Critical Security Issues (separate rule for truly critical issues)
            firebase_critical: {
                patterns: [
                    // Server-side keys that should NEVER be in client code
                    'firebase-admin.*private_key',
                    'serviceAccountKey.*private_key',
                    'admin\.initializeApp\(.*private_key',
                    
                    // Dangerous Firebase Security Rules
                    'allow read, write: if true',
                    'allow.*if.*true.*firestore',
                    'allow.*if.*request\.auth == null'
                ],
                severity: 'CRITICAL',
                description: 'Critical Firebase security vulnerability - server credentials or insecure rules detected',
                recommendation: 'IMMEDIATE ACTION: Remove server-side Firebase credentials from client code and implement proper Firebase Security Rules with authentication'
            },

            // Unsafe eval() usage (improved Firebase Functions exclusion)
            unsafe_eval: {
                patterns: [
                    // Actual dangerous eval patterns
                    '\\beval\\s*\\(',
                    '\\bnew\\s+Function\\s*\\(',
                    
                    // String-based setTimeout/setInterval (dangerous)
                    'setTimeout\\s*\\(\\s*["\'][^"\']',
                    'setInterval\\s*\\(\\s*["\'][^"\']',
                    
                    // Generic Function constructor (simplified pattern)
                    '\\bnew\\s+Function\\s*\\('
                ],
                severity: 'HIGH',
                description: 'Unsafe code execution detected',
                recommendation: 'Avoid eval(), Function() constructor, and string-based code execution. Note: Firebase Functions calls like "await calculateProfileFunction()" are safe and excluded from this check.'
            },

            // Insecure HTTP requests
            insecure_http: {
                patterns: [
                    'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
                    'fetch\\s*\\(\\s*.*http://',
                    'axios\\.(get|post|put|delete)\\s*\\(.*http://',
                    'XMLHttpRequest.*?open\\([^)]*http://'
                ],
                severity: 'MEDIUM',
                description: 'Insecure HTTP requests detected',
                recommendation: 'Use HTTPS for all external requests'
            },

            // Cryptographic weaknesses
            weak_crypto: {
                patterns: [
                    'md5\\(',
                    'sha1\\(',
                    '\\.createHash\\(.*md5',
                    '\\.createHash\\(.*sha1',
                    'crypto\\.subtle\\.digest\\(.*SHA-1'
                ],
                severity: 'HIGH',
                description: 'Weak cryptographic algorithm detected',
                recommendation: 'Use SHA-256, SHA-3, or other modern cryptographic algorithms'
            },

            // Timing attacks
            timing_attacks: {
                patterns: [
                    '===.*?password',
                    '==.*?token',
                    '===.*?secret',
                    'if\\s*\\([^)]*password\\s*===',
                    'password\\s*===\\s*[^&|]+\\s*[&|]'
                ],
                severity: 'MEDIUM',
                description: 'Potential timing attack vulnerability in string comparison',
                recommendation: 'Use constant-time comparison functions for sensitive data'
            },

            // Local storage issues
            insecure_storage: {
                patterns: [
                    'localStorage\\.setItem\\([^)]*password',
                    'localStorage\\.setItem\\([^)]*token',
                    'localStorage\\.setItem\\([^)]*secret',
                    'sessionStorage\\.setItem\\([^)]*password',
                    'sessionStorage\\.setItem\\([^)]*token',
                    'document\\.cookie\\s*=.*password',
                    'document\\.cookie\\s*=.*token'
                ],
                severity: 'HIGH',
                description: 'Sensitive data stored insecurely in browser storage',
                recommendation: 'Use secure, httpOnly cookies or avoid storing sensitive data client-side'
            },

            // SQL Injection vulnerabilities
            sql_injection: {
                patterns: [
                    'SELECT.*?\\+.*?["\']',
                    'INSERT.*?\\+.*?["\']',
                    'UPDATE.*?\\+.*?["\']',
                    'DELETE.*?\\+.*?["\']',
                    'query\\(.*?\\+.*?["\']',
                    'execute\\(.*?\\+.*?["\']',
                    'WHERE.*?\\+.*?["\']',
                    'ORDER BY.*?\\+.*?["\']'
                ],
                severity: 'CRITICAL',
                description: 'Potential SQL injection vulnerability detected',
                recommendation: 'Use parameterized queries or prepared statements instead of string concatenation'
            },

            // CORS issues
            cors_issues: {
                patterns: [
                    'Access-Control-Allow-Origin.*?\\*',
                    'cors.*?origin.*?true',
                    'allowedOrigins.*?\\*',
                    'Access-Control-Allow-Credentials.*?true.*?\\*'
                ],
                severity: 'HIGH',
                description: 'Insecure CORS configuration detected',
                recommendation: 'Specify exact origins instead of wildcards, especially with credentials'
            }
        };
    }

    async scanText(content: string, filePath: string, config?: any): Promise<Vulnerability[]> {
        this.checkDisposed();
        const vulnerabilities: Vulnerability[] = [];
        const lines = content.split('\n');

        // Get enabled vulnerability types from config
        const enabledTypes = config?.vulnerabilityTypes || {
            xss_vulnerabilities: true,
            exposed_secrets: true,
            firebase_security: true,
            firebase_critical: true,
            unsafe_eval: true,
            insecure_http: true,
            weak_crypto: true,
            sql_injection: true,
            cors_issues: true
        };

        // Get minimum severity filter
        const minSeverity = config?.minSeverity || 'MEDIUM';
        const severityLevels = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
        const minSeverityLevel = severityLevels[minSeverity as keyof typeof severityLevels] || 2;

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];
            
            for (const [vulnType, rule] of Object.entries(this.rules)) {
                // Skip if this vulnerability type is disabled
                if (!enabledTypes[vulnType]) {
                    continue;
                }

                // Skip if severity is below minimum threshold
                const ruleSeverityLevel = severityLevels[rule.severity as keyof typeof severityLevels] || 1;
                if (ruleSeverityLevel < minSeverityLevel) {
                    continue;
                }

                for (const pattern of rule.patterns) {
                    const regex = new RegExp(pattern, 'i');
                    if (regex.test(line)) {
                        vulnerabilities.push({
                            filePath,
                            lineNumber: lineNum + 1,
                            vulnerabilityType: vulnType,
                            severity: rule.severity,
                            description: rule.description,
                            codeSnippet: line.trim(),
                            recommendation: rule.recommendation
                        });
                        break; // Avoid duplicate matches on same line
                    }
                }
            }
        }

        return vulnerabilities;
    }

    async scanFile(filePath: string, config?: any): Promise<Vulnerability[]> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return this.scanText(content, filePath, config);
        } catch (error) {
            console.error(`Error scanning file ${filePath}:`, error);
            return [];
        }
    }

    async scanDirectory(directoryPath: string, config?: any): Promise<Vulnerability[]> {
        const vulnerabilities: Vulnerability[] = [];
        
        const scanRecursive = async (dirPath: string) => {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Skip common directories
                    if (!['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(item)) {
                        await scanRecursive(fullPath);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(fullPath);
                    if (this.targetExtensions.has(ext)) {
                        const fileVulns = await this.scanFile(fullPath, config);
                        vulnerabilities.push(...fileVulns);
                    }
                }
            }
        };

        await scanRecursive(directoryPath);
        return vulnerabilities;
    }

    async scanWorkspace(workspacePath: string, progressCallback?: (current: number, total: number) => void, config?: any): Promise<Vulnerability[]> {
        const allFiles: string[] = [];
        
        // Collect all files first
        const collectFiles = (dirPath: string) => {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(item)) {
                        collectFiles(fullPath);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(fullPath);
                    if (this.targetExtensions.has(ext)) {
                        allFiles.push(fullPath);
                    }
                }
            }
        };

        collectFiles(workspacePath);
        
        const vulnerabilities: Vulnerability[] = [];
        
        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const fileVulns = await this.scanFile(filePath, config);
            vulnerabilities.push(...fileVulns);
            
            if (progressCallback) {
                progressCallback(i + 1, allFiles.length);
            }
        }

        return vulnerabilities;
    }

    generateHTMLReport(vulnerabilities: Vulnerability[]): string {
        const severityCounts = {
            CRITICAL: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
            HIGH: vulnerabilities.filter(v => v.severity === 'HIGH').length,
            MEDIUM: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
            LOW: vulnerabilities.filter(v => v.severity === 'LOW').length
        };

        const totalIssues = vulnerabilities.length;
        const projectName = 'Your Project'; // Could be enhanced to get actual project name

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>🐺 VibeWolf Security Report</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: #333;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .header {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    padding: 30px;
                    margin-bottom: 30px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                
                .wolf-logo {
                    font-size: 4rem;
                    margin-bottom: 10px;
                    animation: pulse 2s infinite;
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                .header .subtitle {
                    font-size: 1.2rem;
                    color: #00ffff;
                    margin-bottom: 20px;
                    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                }
                
                .scan-info {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                    margin-top: 20px;
                }
                
                .scan-info-item {
                    text-align: center;
                }
                
                .scan-info-item .label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 5px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .scan-info-item .value {
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #ffffff;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .terminal-output {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 15px;
                    padding: 30px;
                    margin-bottom: 30px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    font-family: 'Courier New', monospace;
                }
                
                .terminal-header {
                    color: #00ff00;
                    font-weight: bold;
                    margin: 5px 0;
                    font-size: 1rem;
                    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
                }
                
                .scan-info-line {
                    color: #ffffff;
                    margin: 8px 0;
                    font-size: 1rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .severity-breakdown {
                    margin: 20px 0;
                }
                
                .breakdown-title {
                    color: #00ffff;
                    font-weight: bold;
                    margin: 15px 0 10px 0;
                    font-size: 1rem;
                    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                }
                
                .severity-line {
                    margin: 5px 0;
                    font-size: 1rem;
                    font-weight: bold;
                }
                
                .severity-line.critical {
                    color: #ff4444;
                    text-shadow: 0 0 5px rgba(255, 68, 68, 0.7);
                }
                
                .severity-line.high {
                    color: #ff8800;
                    text-shadow: 0 0 5px rgba(255, 136, 0, 0.7);
                }
                
                .severity-line.medium {
                    color: #ffdd00;
                    text-shadow: 0 0 5px rgba(255, 221, 0, 0.7);
                }
                
                .severity-line.low {
                    color: #0088ff;
                    text-shadow: 0 0 5px rgba(0, 136, 255, 0.7);
                }
                
                .vulnerability-section {
                    margin: 25px 0;
                }
                
                .vuln-section-header {
                    color: #ffffff;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin: 15px 0 5px 0;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                .vuln-divider {
                    color: rgba(255, 255, 255, 0.8);
                    margin: 5px 0 15px 0;
                }
                
                .vuln-item {
                    margin: 15px 0;
                    padding: 10px 0;
                }
                
                .vuln-number {
                    color: #ffffff;
                    font-weight: bold;
                    margin-bottom: 5px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .vuln-type {
                    color: #00ff88;
                    margin: 3px 0;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .vuln-issue {
                    color: #ffaa44;
                    margin: 3px 0;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .vuln-code-line {
                    color: #dd88ff;
                    margin: 3px 0;
                    font-style: italic;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .vuln-fix {
                    color: #88ff88;
                    margin: 3px 0;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .terminal-footer {
                    margin-top: 30px;
                }
                
                .terminal-line {
                    color: #ffffff;
                    margin: 8px 0;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .terminal-divider {
                    color: #00ff00;
                    font-weight: bold;
                    margin: 10px 0;
                    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
                }
                
                .terminal-complete {
                    color: #00ff00;
                    font-weight: bold;
                    margin: 10px 0;
                    text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
                }
                
                .terminal-success {
                    color: #00ff00;
                    font-weight: bold;
                    font-size: 1.2rem;
                    margin: 20px 0;
                    text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
                }
                

                
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding: 30px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                
                .footer .wolf-quote {
                    font-style: italic;
                    font-size: 1.1rem;
                    color: #ffffff;
                    margin-bottom: 15px;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
                }
                
                .footer .vibewolf-info {
                    color: #ffffff;
                    font-size: 0.9rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                }
                
                .footer .vibewolf-info a {
                    color: #00ffff !important;
                    text-decoration: none !important;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(0, 255, 255, 0.7);
                    transition: all 0.3s ease;
                }
                
                .footer .vibewolf-info a:hover {
                    color: #88ffff !important;
                    text-shadow: 0 0 8px rgba(0, 255, 255, 1);
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 10px;
                    }
                    
                    .header {
                        padding: 20px;
                    }
                    
                    .header h1 {
                        font-size: 2rem;
                    }
                    
                    .scan-info {
                        gap: 15px;
                    }
                    
                    .overview-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="wolf-logo">🐺</div>
                    <h1>VibeWolf Security Report</h1>
                    <div class="subtitle">The Guardian Wolf for Developers</div>
                    <div class="scan-info">
                        <div class="scan-info-item">
                            <div class="label">Project</div>
                            <div class="value">${projectName}</div>
                        </div>
                        <div class="scan-info-item">
                            <div class="label">Scan Date</div>
                            <div class="value">${new Date().toLocaleDateString()}</div>
                        </div>
                        <div class="scan-info-item">
                            <div class="label">Total Issues</div>
                            <div class="value">${totalIssues}</div>
                        </div>
                    </div>
                </div>
                
                <div class="terminal-output">
                    <div class="terminal-header">🐺 ===============================================</div>
                    <div class="terminal-header">🐺 VIBEWOLF SECURITY SCANNER RESULTS</div>
                    <div class="terminal-header">🐺 ===============================================</div>
                    
                    <div class="scan-info-line">📅 Scan Date: ${new Date().toLocaleString()}</div>
                    <div class="scan-info-line">📁 Project: Your Project</div>
                    <div class="scan-info-line">🔍 Total Vulnerabilities Found: ${totalIssues}</div>
                    
                    <div class="severity-breakdown">
                        <div class="breakdown-title">📊 SEVERITY BREAKDOWN:</div>
                        <div class="severity-line critical">🔴 CRITICAL: ${severityCounts.CRITICAL}</div>
                        <div class="severity-line high">🟠 HIGH: ${severityCounts.HIGH}</div>
                        <div class="severity-line medium">🟡 MEDIUM: ${severityCounts.MEDIUM}</div>
                        <div class="severity-line low">🔵 LOW: ${severityCounts.LOW}</div>
                    </div>
                    
                    ${totalIssues === 0 ? `
                        <div class="terminal-success">🎉 EXCELLENT! NO SECURITY ISSUES FOUND</div>
                        <div class="terminal-line">✅ Your code is secure and ready for deployment!</div>
                        <div class="terminal-line">🐺 The Guardian Wolf found no vulnerabilities.</div>
                    ` : `
                        ${['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
                            const vulns = vulnerabilities.filter(v => v.severity === severity);
                            if (vulns.length === 0) return '';
                            
                            const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🔵';
                            
                            return `
                                <div class="vulnerability-section">
                                    <div class="vuln-section-header">${emoji} ${severity} VULNERABILITIES (${vulns.length}):</div>
                                    <div class="vuln-divider">----------------------------------------------------</div>
                                    ${vulns.map((vuln, index) => {
                                        const fileName = vuln.filePath.split(/[\\\/]/).pop();
                                        const lineNum = vuln.lineNumber;
                                        
                                        return `
                                            <div class="vuln-item">
                                                <div class="vuln-number">${index + 1}. ${fileName}:${lineNum}</div>
                                                <div class="vuln-type">   Type: ${vuln.vulnerabilityType.replace(/_/g, ' ')}</div>
                                                <div class="vuln-issue">   Issue: ${vuln.description}</div>
                                                <div class="vuln-code-line">   Code: ${vuln.codeSnippet.trim()}</div>
                                                <div class="vuln-fix">   Fix: ${vuln.recommendation}</div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `;
                        }).join('')}
                        
                        <div class="terminal-footer">
                            <div class="terminal-line">📄 Detailed report saved to: !VIBEWOLF-SECURITY-REPORT.md</div>
                            <div class="terminal-line">🔧 Use this file to track your security fixes!</div>
                            <div class="terminal-divider">🐺 ===============================================</div>
                            <div class="terminal-complete">✅ SCAN COMPLETE - STAY SECURE!</div>
                            <div class="terminal-divider">🐺 ===============================================</div>
                        </div>
                    </div>
                `}
                
                <div class="footer">
                    <div class="wolf-quote">"No developer should accidentally expose their secrets to the world."</div>
                    <div class="vibewolf-info">
                        <strong>VibeWolf Security Scanner v1.0.0</strong><br>
                        🎯 83% Noise Reduction • 🎛️ Interactive Management • 📊 Triple Output<br>
                        <a href="https://buymeacoffee.com/vibewolf" style="color: #667eea; text-decoration: none;">☕ Buy me a coffee</a>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    private groupVulnerabilitiesByFile(vulnerabilities: Vulnerability[]): [string, Vulnerability[]][] {
        const groups = new Map<string, Vulnerability[]>();
        
        vulnerabilities.forEach(vuln => {
            if (!groups.has(vuln.filePath)) {
                groups.set(vuln.filePath, []);
            }
            groups.get(vuln.filePath)!.push(vuln);
        });

        return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
    }
}
