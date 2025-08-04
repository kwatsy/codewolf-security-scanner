// src/scanner.ts
import { Vulnerability } from './interfaces/vulnerability';
import { SecurityRule } from './interfaces/security-rule';
import { loadAllRules } from './rules';
import { ReportGenerator } from './templates/report-generator';
import { FileUtils } from './utils/file-utils';
import { ScanUtils } from './utils/scan-utils';

export class SecurityScanner {
    private rules: Record<string, SecurityRule>;
    private isDisposed = false;
    private reportGenerator: ReportGenerator;

    constructor() {
        this.rules = loadAllRules();
        this.reportGenerator = new ReportGenerator();
    }
    
    // Cleanup method for proper disposal
    dispose(): void {
        if (this.isDisposed) {
            return;
        }
        
        // Clear rules
        this.rules = {};
        this.isDisposed = true;
        
        console.log('🐺 SecurityScanner disposed successfully');
    }
    
    // Check if scanner is disposed
    private checkDisposed(): void {
        if (this.isDisposed) {
            throw new Error('SecurityScanner has been disposed');
        }
    }

    async scanText(content: string, filePath: string, config?: any): Promise<Vulnerability[]> {
        this.checkDisposed();
        const filteredRules = ScanUtils.filterByConfig(this.rules, config);
        return ScanUtils.scanTextContent(content, filePath, filteredRules);
    }

    async scanFile(filePath: string, config?: any): Promise<Vulnerability[]> {
        this.checkDisposed();
        const content = await FileUtils.readFileContent(filePath);
        if (!content) return [];
        return this.scanText(content, filePath, config);
    }

    async scanDirectory(directoryPath: string, config?: any): Promise<Vulnerability[]> {
        this.checkDisposed();
        const files = await FileUtils.scanDirectoryFiles(directoryPath);
        const vulnerabilities: Vulnerability[] = [];
        
        for (const filePath of files) {
            const fileVulns = await this.scanFile(filePath, config);
            vulnerabilities.push(...fileVulns);
        }

        return vulnerabilities;
    }

    async scanWorkspace(workspacePath: string, progressCallback?: (current: number, total: number) => void, config?: any): Promise<Vulnerability[]> {
        this.checkDisposed();
        const allFiles = await FileUtils.collectFiles(workspacePath);
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
        this.checkDisposed();
        return this.reportGenerator.generateHTMLReport(vulnerabilities);
    }

}
