import * as fs from 'fs';
import * as path from 'path';
import { Vulnerability } from '../interfaces/vulnerability';

export class ReportGenerator {
    private templatePath: string;
    
    constructor() {
        this.templatePath = path.join(__dirname, 'report.html');
    }
    
    generateHTMLReport(vulnerabilities: Vulnerability[]): string {
        const template = fs.readFileSync(this.templatePath, 'utf-8');
        
        const severityCounts = {
            CRITICAL: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
            HIGH: vulnerabilities.filter(v => v.severity === 'HIGH').length,
            MEDIUM: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
            LOW: vulnerabilities.filter(v => v.severity === 'LOW').length
        };

        const totalIssues = vulnerabilities.length;
        const projectName = 'Your Project'; // Could be enhanced to get actual project name
        
        // Generate vulnerabilities content
        const vulnerabilitiesContent = this.generateVulnerabilitiesContent(vulnerabilities);
        
        // Replace placeholders with actual data
        return template
            .replace(/{{PROJECT_NAME}}/g, projectName)
            .replace(/{{SCAN_DATE}}/g, new Date().toLocaleDateString())
            .replace(/{{SCAN_DATETIME}}/g, new Date().toLocaleString())
            .replace(/{{TOTAL_ISSUES}}/g, totalIssues.toString())
            .replace(/{{CRITICAL_COUNT}}/g, severityCounts.CRITICAL.toString())
            .replace(/{{HIGH_COUNT}}/g, severityCounts.HIGH.toString())
            .replace(/{{MEDIUM_COUNT}}/g, severityCounts.MEDIUM.toString())
            .replace(/{{LOW_COUNT}}/g, severityCounts.LOW.toString())
            .replace(/{{VULNERABILITIES_CONTENT}}/g, vulnerabilitiesContent);
    }
    
    private generateVulnerabilitiesContent(vulnerabilities: Vulnerability[]): string {
        const totalIssues = vulnerabilities.length;
        
        if (totalIssues === 0) {
            return `
                <div class="terminal-success">🎉 EXCELLENT! NO SECURITY ISSUES FOUND</div>
                <div class="terminal-line">✅ Your code is secure and ready for deployment!</div>
                <div class="terminal-line">🐺 The Guardian Wolf found no vulnerabilities.</div>
            `;
        }
        
        const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        let content = '';
        
        for (const severity of severityOrder) {
            const vulns = vulnerabilities.filter(v => v.severity === severity);
            if (vulns.length === 0) continue;
            
            const emoji = severity === 'CRITICAL' ? '🔴' : 
                         severity === 'HIGH' ? '🟠' : 
                         severity === 'MEDIUM' ? '🟡' : '🔵';
            
            content += `
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
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        content += `
            <div class="terminal-footer">
                <div class="terminal-line">📄 Detailed report saved to: !CODEWOLF-SECURITY-REPORT.md</div>
                <div class="terminal-line">🔧 Use this file to track your security fixes!</div>
                <div class="terminal-divider">🐺 ===============================================</div>
                <div class="terminal-complete">✅ SCAN COMPLETE - STAY SECURE!</div>
                <div class="terminal-divider">🐺 ===============================================</div>
            </div>
        `;
        
        return content;
    }
    
    groupVulnerabilitiesByFile(vulnerabilities: Vulnerability[]): [string, Vulnerability[]][] {
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
