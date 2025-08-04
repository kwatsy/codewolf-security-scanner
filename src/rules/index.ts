import { SecurityRule } from '../interfaces/security-rule';
import { xssRules } from './xss-rules';
import { secretRules } from './secret-rules';
import { injectionRules } from './injection-rules';
import { cryptoRules } from './crypto-rules';
import { securityRules } from './security-rules';

export function loadAllRules(): Record<string, SecurityRule> {
    return {
        ...xssRules,
        ...secretRules,
        ...injectionRules,
        ...cryptoRules,
        ...securityRules
    };
}
