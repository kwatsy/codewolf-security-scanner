import { SecurityRule } from '../interfaces/security-rule';

export const cryptoRules: Record<string, SecurityRule> = {
    weak_crypto: {
        patterns: [
            'md5\\(',
            'sha1\\(',
            '\\.createHash\\(.*md5',
            '\\.createHash\\(.*sha1',
            'crypto\\.subtle\\.digest\\(.*SHA-1'
        ],
        severity: 'HIGH',
        description: 'Weak cryptographic algorithm detected'
    }
};
