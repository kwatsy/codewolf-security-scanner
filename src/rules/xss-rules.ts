import { SecurityRule } from '../interfaces/security-rule';

export const xssRules: Record<string, SecurityRule> = {
    xss_vulnerabilities: {
        patterns: [
            'innerHTML\\s*=\\s*.*?\\+',
            'outerHTML\\s*=\\s*.*?\\+',
            'insertAdjacentHTML\\s*\\([^)]*\\+',
            'document\\.write\\s*\\([^)]*\\+',
            '\\.html\\([^)]*\\+[^)]*\\)'
        ],
        severity: 'HIGH',
        description: 'Potential XSS vulnerability through dynamic HTML injection'
    }
};
