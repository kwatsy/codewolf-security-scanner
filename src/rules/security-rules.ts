import { SecurityRule } from '../interfaces/security-rule';

export const securityRules: Record<string, SecurityRule> = {
    firebase_security: {
        patterns: [
            // Firebase Security Rules issues (CRITICAL)
            'allow read, write: if true',
            'allow.*if.*true',
            
            // Server-side Firebase keys in client code (CRITICAL)
            'admin\\.initializeApp\\(\\).*apiKey',
            'firebase-admin.*apiKey',
            'serviceAccountKey',
            
            // Firebase web API keys (MEDIUM - context-aware)
            'apiKey:\\s*["\']AIza[0-9A-Za-z\\-_]{35}["\']',
            
            // Insecure Cloud Functions (HIGH)
            'functions\\.https\\.onRequest\\(',
            'cors.*origin.*\\*'
        ],
        severity: 'MEDIUM',
        description: 'Firebase configuration should use environment variables for better security practices'
    },

    firebase_critical: {
        patterns: [
            // Server-side Firebase Admin SDK keys (CRITICAL)
            'serviceAccountKey.*private_key',
            'admin\\.initializeApp\\(\\{[^}]*serviceAccountKey',
            
            // Firestore Security Rules (CRITICAL)
            'allow read, write: if true',
            'allow.*if.*true.*firestore',
            
            // Firebase Functions with no auth (CRITICAL)
            'functions\\.https\\.onRequest\\([^)]*\\)\\s*=>\\s*{[^}]*res\\.send'
        ],
        severity: 'CRITICAL',
        description: 'Critical Firebase security misconfiguration detected'
    },

    insecure_http: {
        patterns: [
            'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
            'fetch\\s*\\(\\s*.*http://',
            'axios\\.(get|post|put|delete)\\s*\\(.*http://',
            'XMLHttpRequest.*?open\\([^)]*http://'
        ],
        severity: 'MEDIUM',
        description: 'Insecure HTTP requests detected'
    },

    timing_attacks: {
        patterns: [
            '===.*?password',
            '==.*?token',
            '===.*?secret',
            'if\\s*\\([^)]*password\\s*===',
            'password\\s*===\\s*[^&|]+\\s*[&|]'
        ],
        severity: 'MEDIUM',
        description: 'Potential timing attack vulnerability in string comparison'
    },

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
        description: 'Sensitive data stored insecurely in browser storage'
    },

    cors_issues: {
        patterns: [
            'Access-Control-Allow-Origin.*?\\*',
            'cors.*?origin.*?true',
            'allowedOrigins.*?\\*',
            'Access-Control-Allow-Credentials.*?true.*?\\*'
        ],
        severity: 'HIGH',
        description: 'Insecure CORS configuration detected'
    }
};
