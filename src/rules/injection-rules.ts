import { SecurityRule } from '../interfaces/security-rule';

export const injectionRules: Record<string, SecurityRule> = {
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
        description: 'Potential SQL injection vulnerability detected'
    },

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
        description: 'Unsafe code execution detected'
    }
};
