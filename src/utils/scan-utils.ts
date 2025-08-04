import { SecurityRule } from '../interfaces/security-rule';
import { Vulnerability } from '../interfaces/vulnerability';

export class ScanUtils {
    private static readonly SEVERITY_LEVELS = {
        'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4
    };
    
    static filterByConfig(rules: Record<string, SecurityRule>, config?: any): Record<string, SecurityRule> {
        if (!config) return rules;
        
        const enabledTypes = config.vulnerabilityTypes || {
            xss_vulnerabilities: true,
            exposed_secrets: true,
            firebase_security: true,
            firebase_critical: true,
            unsafe_eval: true,
            insecure_http: true,
            weak_crypto: true,
            sql_injection: true,
            cors_issues: true,
            timing_attacks: true,
            insecure_storage: true
        };
        
        const minSeverity = config.minSeverity || 'MEDIUM';
        const minSeverityLevel = this.SEVERITY_LEVELS[minSeverity as keyof typeof this.SEVERITY_LEVELS] || 2;
        
        const filteredRules: Record<string, SecurityRule> = {};
        
        for (const [vulnType, rule] of Object.entries(rules)) {
            // Skip if this vulnerability type is disabled
            if (!enabledTypes[vulnType]) {
                continue;
            }

            // Skip if severity is below minimum threshold
            const ruleSeverityLevel = this.SEVERITY_LEVELS[rule.severity as keyof typeof this.SEVERITY_LEVELS] || 1;
            if (ruleSeverityLevel < minSeverityLevel) {
                continue;
            }
            
            filteredRules[vulnType] = rule;
        }
        
        return filteredRules;
    }
    
    static scanLineForVulnerabilities(
        line: string, 
        lineNum: number, 
        filePath: string, 
        rules: Record<string, SecurityRule>
    ): Vulnerability[] {
        const vulnerabilities: Vulnerability[] = [];
        
        for (const [vulnType, rule] of Object.entries(rules)) {
            for (const pattern of rule.patterns) {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(line)) {
                    vulnerabilities.push({
                        filePath,
                        lineNumber: lineNum + 1,
                        vulnerabilityType: vulnType,
                        severity: rule.severity,
                        description: rule.description,
                        codeSnippet: line.trim()
                    });
                    break; // Avoid duplicate matches on same line
                }
            }
        }
        
        return vulnerabilities;
    }
    
    static scanTextContent(
        content: string, 
        filePath: string, 
        rules: Record<string, SecurityRule>
    ): Vulnerability[] {
        const vulnerabilities: Vulnerability[] = [];
        const lines = content.split('\n');

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const lineVulns = this.scanLineForVulnerabilities(
                lines[lineNum], lineNum, filePath, rules
            );
            vulnerabilities.push(...lineVulns);
        }

        return vulnerabilities;
    }
}
