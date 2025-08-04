// Test the security scanner on the Coffee Profile App
const { SecurityScanner } = require('./out/scanner');
const path = require('path');

async function testScanner() {
    const scanner = new SecurityScanner();
    
    console.log('🔍 Testing Security Scanner...\n');
    
    // Test on current directory
    const appPath = __dirname;
    
    try {
        console.log(`📁 Scanning: ${appPath}`);
        
        // Check if path exists
        const fs = require('fs');
        if (!fs.existsSync(appPath)) {
            console.error(`❌ Path does not exist: ${appPath}`);
            return;
        }
        
        console.log('🔄 Starting scan...');
        const vulnerabilities = await scanner.scanDirectory(appPath);
        
        console.log(`\n📊 SCAN RESULTS:`);
        console.log(`Total vulnerabilities found: ${vulnerabilities.length}`);
        
        // Debug: Show what files were scanned
        console.log('\n🔍 Debug info:');
        console.log('Scanner rules loaded:', Object.keys(scanner.rules || {}).length);
        console.log('Target extensions:', Array.from(scanner.targetExtensions || []).join(', '));
        
        if (vulnerabilities.length > 0) {
            // Group by severity
            const bySeverity = {
                CRITICAL: vulnerabilities.filter(v => v.severity === 'CRITICAL'),
                HIGH: vulnerabilities.filter(v => v.severity === 'HIGH'),
                MEDIUM: vulnerabilities.filter(v => v.severity === 'MEDIUM'),
                LOW: vulnerabilities.filter(v => v.severity === 'LOW')
            };
            
            console.log(`🔴 Critical: ${bySeverity.CRITICAL.length}`);
            console.log(`🟠 High: ${bySeverity.HIGH.length}`);
            console.log(`🟡 Medium: ${bySeverity.MEDIUM.length}`);
            console.log(`🔵 Low: ${bySeverity.LOW.length}`);
            
            console.log('\n📋 DETAILED FINDINGS:');
            
            // Show critical and high severity issues
            [...bySeverity.CRITICAL, ...bySeverity.HIGH].forEach((vuln, index) => {
                console.log(`\n${index + 1}. ${vuln.severity} - ${vuln.vulnerabilityType}`);
                console.log(`   File: ${path.relative(appPath, vuln.filePath)}`);
                console.log(`   Line: ${vuln.lineNumber}`);
                console.log(`   Issue: ${vuln.description}`);
                console.log(`   Code: ${vuln.codeSnippet}`);
            });
            
            // Generate HTML report
            console.log('\n📄 Generating HTML report...');
            const htmlReport = scanner.generateHTMLReport(vulnerabilities);
            const fs = require('fs');
            const reportPath = path.join(__dirname, 'security-report.html');
            fs.writeFileSync(reportPath, htmlReport);
            console.log(`✅ Report saved to: ${reportPath}`);
            
        } else {
            console.log('✅ No security vulnerabilities found!');
        }
        
    } catch (error) {
        console.error('❌ Error during scan:', error);
    }
}

testScanner();
