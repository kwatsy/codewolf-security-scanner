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

            // Firebase Security Issues
            firebase_security: {
                patterns: [
                    'allow read, write: if true',
                    'allow.*if.*true',
                    'functions\\.https\\.onRequest\\(\\s*\\(',
                    'admin\\.initializeApp\\(\\).*apiKey',
                    'firebase\\.initializeApp\\(.*apiKey.*\\)',
                    'AIza[0-9A-Za-z\\-_]{35}'
                ],
                severity: 'CRITICAL',
                description: 'Insecure Firebase configuration detected',
                recommendation: 'Implement proper authentication and security rules'
            },

            // Unsafe eval() usage (refined to avoid Firebase function calls)
            unsafe_eval: {
                patterns: [
                    '\\beval\\s*\\(',
                    '\\bnew\\s+Function\\s*\\(',
                    'setTimeout\\s*\\(\\s*["\'][^"\']',
                    'setInterval\\s*\\(\\s*["\'][^"\']',
                    // Exclude Firebase function calls
                    '(?<!\\w)Function\\s*\\((?!.*Function\\s*\\(\\s*\\{)'
                ],
                severity: 'HIGH',
                description: 'Unsafe code execution detected',
                recommendation: 'Avoid eval() and string-based code execution'
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

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Scan Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .vulnerability { border-left: 4px solid #ccc; padding: 10px; margin: 10px 0; }
                .critical { border-left-color: #dc3545; }
                .high { border-left-color: #fd7e14; }
                .medium { border-left-color: #ffc107; }
                .low { border-left-color: #20c997; }
                .code { background: #f8f9fa; padding: 5px; font-family: monospace; }
                .file-group { margin: 20px 0; }
                .file-title { font-weight: bold; color: #007bff; }
            </style>
        </head>
        <body>
            <h1>🔍 Security Scan Report</h1>
            <div class="summary">
                <h2>Summary</h2>
                <p>Total vulnerabilities: ${vulnerabilities.length}</p>
                <p>🔴 Critical: ${severityCounts.CRITICAL}</p>
                <p>🟠 High: ${severityCounts.HIGH}</p>
                <p>🟡 Medium: ${severityCounts.MEDIUM}</p>
                <p>🔵 Low: ${severityCounts.LOW}</p>
            </div>
            
            ${this.groupVulnerabilitiesByFile(vulnerabilities).map(([file, vulns]) => `
                <div class="file-group">
                    <div class="file-title">📁 ${file}</div>
                    ${vulns.map(vuln => `
                        <div class="vulnerability ${vuln.severity.toLowerCase()}">
                            <strong>Line ${vuln.lineNumber}:</strong> ${vuln.description}<br>
                            <div class="code">${vuln.codeSnippet}</div>
                            <small><strong>Fix:</strong> ${vuln.recommendation}</small>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
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
