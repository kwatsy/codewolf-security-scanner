import { SecurityRule } from '../interfaces/security-rule';

export const secretRules: Record<string, SecurityRule> = {
    exposed_secrets: {
        patterns: [
            // API Keys (comprehensive patterns)
            'api_?key["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'apikey["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'api-key["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'token["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'access_token["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            'auth_token["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            
            // Generic key patterns (catch more formats)
            '["\']?[A-Za-z0-9_\\-]{32,}["\']?\\s*//.*(?:key|secret|token|api)',
            '(?:key|secret|token|api)["\']?\\s*[:=]\\s*["\'][A-Za-z0-9_\\-]{15,}["\']',
            
            // Firebase API keys (specific pattern)
            'AIza[0-9A-Za-z\\-_]{35}',
            
            // Passwords & Credentials (avoid React patterns)
            'password["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            'passwd["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            'pwd["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            
            // Database Credentials
            'db_password["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            'database_url["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            'connection_string["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            
            // Framework Environment Variables (only actual secrets)
            'REACT_APP_.*SECRET["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            'VUE_APP_.*SECRET["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            'NEXT_PUBLIC_.*SECRET["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            'EXPO_.*SECRET["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{10,}["\']',
            
            // Common Service Keys (specific patterns)
            'stripe.*key["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'paypal.*secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'aws.*key["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'google.*key["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'facebook.*secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'twitter.*secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            
            // JWT & OAuth
            'jwt.*secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'oauth.*secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            'client_secret["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{20,}["\']',
            
            // Email & SMTP
            'smtp.*password["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            'email.*password["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']',
            'mail.*password["\']?\\s*[:=]\\s*["\'][A-Za-z0-9]{8,}["\']'
        ],
        severity: 'CRITICAL',
        description: 'Hardcoded secrets, credentials, or sensitive data exposed in frontend code'
    }
};
