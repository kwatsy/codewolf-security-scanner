import * as vscode from 'vscode';
import { SecurityScanner } from './scanner';

let scanner: SecurityScanner;
let diagnosticCollection: vscode.DiagnosticCollection;
let disposables: vscode.Disposable[] = [];
let webviewPanels: vscode.WebviewPanel[] = [];

export function activate(context: vscode.ExtensionContext) {
    scanner = new SecurityScanner();
    diagnosticCollection = vscode.languages.createDiagnosticCollection('securityScanner');
    
    // Register commands
    const scanFileCommand = vscode.commands.registerCommand('securityScanner.scanFile', scanCurrentFile);
    const scanWorkspaceCommand = vscode.commands.registerCommand('securityScanner.scanWorkspace', scanWorkspace);
    const scanFolderCommand = vscode.commands.registerCommand('securityScanner.scanFolder', scanFolder);
    const generateReportCommand = vscode.commands.registerCommand('securityScanner.generateReport', generateReport);
    
    // Register VibeWolf management commands
    const ignoreIssueCommand = vscode.commands.registerCommand('vibewolf.ignoreIssue', ignoreIssue);
    const addToWhitelistCommand = vscode.commands.registerCommand('vibewolf.addToWhitelist', addToWhitelist);
    const markFalsePositiveCommand = vscode.commands.registerCommand('vibewolf.markFalsePositive', markFalsePositive);
    const showFixDetailsCommand = vscode.commands.registerCommand('vibewolf.showFixDetails', showFixDetails);
    
    // Register code actions provider for VibeWolf management
    const codeActionsProvider = vscode.languages.registerCodeActionsProvider('*', {
        provideCodeActions(document, range, context) {
            const actions: vscode.CodeAction[] = [];
            
            // Check if there are VibeWolf diagnostics in this range
            const vibeWolfDiagnostics = context.diagnostics.filter(
                diag => diag.source === 'VibeWolf Security Scanner'
            );
            
            if (vibeWolfDiagnostics.length > 0) {
                const diagnostic = vibeWolfDiagnostics[0];
                
                // Ignore this issue
                const ignoreAction = new vscode.CodeAction(
                    '🚫 Ignore this VibeWolf issue',
                    vscode.CodeActionKind.QuickFix
                );
                ignoreAction.command = {
                    command: 'vibewolf.ignoreIssue',
                    title: 'Ignore Issue',
                    arguments: [document.uri, range, diagnostic]
                };
                actions.push(ignoreAction);
                
                // Add pattern to whitelist
                const whitelistAction = new vscode.CodeAction(
                    '➕ Add pattern to VibeWolf whitelist',
                    vscode.CodeActionKind.QuickFix
                );
                whitelistAction.command = {
                    command: 'vibewolf.addToWhitelist',
                    title: 'Add to Whitelist',
                    arguments: [document.uri, range, diagnostic]
                };
                actions.push(whitelistAction);
                
                // Mark as false positive
                const falsePositiveAction = new vscode.CodeAction(
                    '🎯 Mark as false positive',
                    vscode.CodeActionKind.QuickFix
                );
                falsePositiveAction.command = {
                    command: 'vibewolf.markFalsePositive',
                    title: 'Mark False Positive',
                    arguments: [document.uri, range, diagnostic]
                };
                actions.push(falsePositiveAction);
                
                // Show detailed fix information
                const fixDetailsAction = new vscode.CodeAction(
                    '🔍 Show detailed fix guide',
                    vscode.CodeActionKind.QuickFix
                );
                fixDetailsAction.command = {
                    command: 'vibewolf.showFixDetails',
                    title: 'Show Fix Details',
                    arguments: [document.uri, range, diagnostic]
                };
                actions.push(fixDetailsAction);
            }
            
            return actions;
        }
    });

    // Register event listeners
    const onDidSaveDocument = vscode.workspace.onDidSaveTextDocument(onDocumentSave);
    const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor(onActiveEditorChange);

    // Store disposables for proper cleanup
    disposables = [
        scanFileCommand,
        scanWorkspaceCommand,
        scanFolderCommand,
        generateReportCommand,
        ignoreIssueCommand,
        addToWhitelistCommand,
        markFalsePositiveCommand,
        showFixDetailsCommand,
        codeActionsProvider,
        onDidSaveDocument,
        onDidChangeActiveEditor,
        diagnosticCollection
    ];
    
    context.subscriptions.push(...disposables);

    // Only scan initially if real-time is enabled
    const config = vscode.workspace.getConfiguration('securityScanner');
    if (config.get('enableRealTime', false) && vscode.window.activeTextEditor) {
        scanDocument(vscode.window.activeTextEditor.document);
    }

    vscode.window.showInformationMessage('🐺 VibeWolf Security Scanner ready! Use Command Palette to scan when you\'re ready for deployment.');
}

async function scanCurrentFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active file to scan');
        return;
    }

    try {
        const config = vscode.workspace.getConfiguration('securityScanner');
        const vulnerabilities = await scanner.scanText(editor.document.getText(), editor.document.fileName, config);
        const diagnostics = vulnerabilities.map(vuln => createDiagnostic(vuln));
        diagnosticCollection.set(editor.document.uri, diagnostics);
        
        // Enhanced terminal output and file creation
        await outputScanResults(vulnerabilities);
        
        vscode.window.showInformationMessage(
            `✅ File scan completed: ${vulnerabilities.length} vulnerabilities found. Check terminal and !VIBEWOLF-SECURITY-REPORT.md for details.`
        );
    } catch (error) {
        vscode.window.showErrorMessage(`❌ File scan failed: ${error}`);
    }
}

async function scanWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showWarningMessage('No workspace folder open');
        return;
    }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "🔍 Scanning workspace for security vulnerabilities...",
        cancellable: false
    }, async (progress) => {
        try {
            const config = vscode.workspace.getConfiguration('securityScanner');
            const vulnerabilities = await scanner.scanWorkspace(
                workspaceFolders[0].uri.fsPath,
                (current, total) => {
                    progress.report({ 
                        increment: (current / total) * 100,
                        message: `${current}/${total} files scanned`
                    });
                },
                config
            );

            // Clear existing diagnostics
            diagnosticCollection.clear();

            // Group vulnerabilities by file
            const fileGroups = new Map<string, any[]>();
            vulnerabilities.forEach(vuln => {
                if (!fileGroups.has(vuln.filePath)) {
                    fileGroups.set(vuln.filePath, []);
                }
                fileGroups.get(vuln.filePath)!.push(vuln);
            });

            // Create diagnostics for each file
            for (const [filePath, vulns] of fileGroups) {
                const uri = vscode.Uri.file(filePath);
                const diagnostics = vulns.map(vuln => createDiagnostic(vuln));
                diagnosticCollection.set(uri, diagnostics);
            }

            // Enhanced terminal output and file creation
            await outputScanResults(vulnerabilities);
            
            vscode.window.showInformationMessage(
                `✅ Workspace scan completed: ${vulnerabilities.length} vulnerabilities found. Check terminal and !VIBEWOLF-SECURITY-REPORT.md for details.`
            );
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Scan failed: ${error}`);
        }
    });
}

async function scanFolder(uri: vscode.Uri) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "🔍 Scanning folder...",
        cancellable: false
    }, async () => {
        try {
            const config = vscode.workspace.getConfiguration('securityScanner');
            const vulnerabilities = await scanner.scanDirectory(uri.fsPath, config);
            
            // Process results similar to workspace scan
            const fileGroups = new Map<string, any[]>();
            vulnerabilities.forEach(vuln => {
                if (!fileGroups.has(vuln.filePath)) {
                    fileGroups.set(vuln.filePath, []);
                }
                fileGroups.get(vuln.filePath)!.push(vuln);
            });

            for (const [filePath, vulns] of fileGroups) {
                const fileUri = vscode.Uri.file(filePath);
                const diagnostics = vulns.map(vuln => createDiagnostic(vuln));
                diagnosticCollection.set(fileUri, diagnostics);
            }

            // Enhanced terminal output and file creation
            await outputScanResults(vulnerabilities);
            
            vscode.window.showInformationMessage(
                `✅ Folder scan completed: ${vulnerabilities.length} vulnerabilities found. Check terminal and !VIBEWOLF-SECURITY-REPORT.md for details.`
            );
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Folder scan failed: ${error}`);
        }
    });
}

async function generateReport() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showWarningMessage('No workspace folder open');
        return;
    }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "📊 Generating security report...",
        cancellable: false
    }, async () => {
        try {
            const config = vscode.workspace.getConfiguration('securityScanner');
            const vulnerabilities = await scanner.scanWorkspace(workspaceFolders[0].uri.fsPath, undefined, config);
            const htmlReport = scanner.generateHTMLReport(vulnerabilities);
            
            // Create and show HTML report in new tab
            const panel = vscode.window.createWebviewPanel(
                'securityReport',
                '🛡️ Security Report',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            
            // Track panel for cleanup
            webviewPanels.push(panel);
            
            // Remove from tracking when disposed
            panel.onDidDispose(() => {
                const index = webviewPanels.indexOf(panel);
                if (index > -1) {
                    webviewPanels.splice(index, 1);
                }
            });
            
            panel.webview.html = htmlReport;
            
            vscode.window.showInformationMessage('📊 Security report generated!');
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Report generation failed: ${error}`);
        }
    });
}

async function scanDocument(document: vscode.TextDocument) {
    if (!isScannableFile(document)) {
        return;
    }

    try {
        const config = vscode.workspace.getConfiguration('securityScanner');
        const vulnerabilities = await scanner.scanText(document.getText(), document.fileName, config);
        const diagnostics = vulnerabilities.map(vuln => createDiagnostic(vuln));
        diagnosticCollection.set(document.uri, diagnostics);
    } catch (error) {
        console.error('Error scanning document:', error);
    }
}

// Enhanced output function for terminal and file creation
async function outputScanResults(vulnerabilities: any[]) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;
    
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Terminal output
    const outputChannel = vscode.window.createOutputChannel('VibeWolf Security Scanner');
    outputChannel.clear();
    outputChannel.show(true);
    
    outputChannel.appendLine('🐺 ==========================================');
    outputChannel.appendLine('🐺 VIBEWOLF SECURITY SCANNER RESULTS');
    outputChannel.appendLine('🐺 ==========================================');
    outputChannel.appendLine(`📅 Scan Date: ${new Date().toLocaleString()}`);
    outputChannel.appendLine(`📁 Workspace: ${workspaceRoot}`);
    outputChannel.appendLine(`🔍 Total Vulnerabilities Found: ${vulnerabilities.length}`);
    outputChannel.appendLine('');
    
    // Group by severity
    const bySeverity = {
        CRITICAL: vulnerabilities.filter(v => v.severity === 'CRITICAL'),
        HIGH: vulnerabilities.filter(v => v.severity === 'HIGH'),
        MEDIUM: vulnerabilities.filter(v => v.severity === 'MEDIUM'),
        LOW: vulnerabilities.filter(v => v.severity === 'LOW')
    };
    
    // Terminal summary
    outputChannel.appendLine('📊 SEVERITY BREAKDOWN:');
    outputChannel.appendLine(`🔴 CRITICAL: ${bySeverity.CRITICAL.length}`);
    outputChannel.appendLine(`🟠 HIGH: ${bySeverity.HIGH.length}`);
    outputChannel.appendLine(`🟡 MEDIUM: ${bySeverity.MEDIUM.length}`);
    outputChannel.appendLine(`🔵 LOW: ${bySeverity.LOW.length}`);
    outputChannel.appendLine('');
    
    // Detailed findings in terminal
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
        const vulns = bySeverity[severity as keyof typeof bySeverity];
        if (vulns.length > 0) {
            const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🔵';
            outputChannel.appendLine(`${emoji} ${severity} VULNERABILITIES (${vulns.length}):`);
            outputChannel.appendLine(''.padEnd(50, '-'));
            
            vulns.forEach((vuln, index) => {
                const relativePath = vuln.filePath.replace(workspaceRoot, '').replace(/\\\\/g, '/');
                outputChannel.appendLine(`${index + 1}. ${relativePath}:${vuln.lineNumber}`);
                outputChannel.appendLine(`   Type: ${vuln.vulnerabilityType}`);
                outputChannel.appendLine(`   Issue: ${vuln.description}`);
                outputChannel.appendLine(`   Code: ${vuln.codeSnippet.trim()}`);
                outputChannel.appendLine(`   Fix: ${vuln.recommendation}`);
                outputChannel.appendLine('');
            });
        }
    });
    
    // Create markdown file
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(workspaceRoot, '!VIBEWOLF-SECURITY-REPORT.md');
    
    let markdownContent = `# 🐺 VibeWolf Security Scanner Results\n\n`;
    markdownContent += `**Scan Date:** ${new Date().toLocaleString()}\n`;
    markdownContent += `**Workspace:** ${workspaceRoot}\n`;
    markdownContent += `**Total Vulnerabilities:** ${vulnerabilities.length}\n\n`;
    
    markdownContent += `## 📊 Severity Breakdown\n\n`;
    markdownContent += `- 🔴 **CRITICAL:** ${bySeverity.CRITICAL.length}\n`;
    markdownContent += `- 🟠 **HIGH:** ${bySeverity.HIGH.length}\n`;
    markdownContent += `- 🟡 **MEDIUM:** ${bySeverity.MEDIUM.length}\n`;
    markdownContent += `- 🔵 **LOW:** ${bySeverity.LOW.length}\n\n`;
    
    // Detailed findings in markdown
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
        const vulns = bySeverity[severity as keyof typeof bySeverity];
        if (vulns.length > 0) {
            const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🔵';
            markdownContent += `## ${emoji} ${severity} Vulnerabilities (${vulns.length})\n\n`;
            
            vulns.forEach((vuln, index) => {
                const relativePath = vuln.filePath.replace(workspaceRoot, '').replace(/\\\\/g, '/');
                markdownContent += `### ${index + 1}. \`${relativePath}:${vuln.lineNumber}\`\n\n`;
                markdownContent += `**Type:** ${vuln.vulnerabilityType}\n`;
                markdownContent += `**Issue:** ${vuln.description}\n\n`;
                markdownContent += `**Code:**\n\`\`\`javascript\n${vuln.codeSnippet.trim()}\n\`\`\`\n\n`;
                markdownContent += `**Recommendation:** ${vuln.recommendation}\n\n`;
                markdownContent += `**Status:** [ ] Fixed\n\n`;
                markdownContent += `---\n\n`;
            });
        }
    });
    
    markdownContent += `## 🎯 Next Steps\n\n`;
    markdownContent += `1. [ ] Review all CRITICAL vulnerabilities first\n`;
    markdownContent += `2. [ ] Fix HIGH severity issues before deployment\n`;
    markdownContent += `3. [ ] Address MEDIUM issues for production\n`;
    markdownContent += `4. [ ] Consider LOW priority items for future releases\n\n`;
    markdownContent += `---\n`;
    markdownContent += `*Generated by VibeWolf Security Scanner - Your Guardian Wolf 🐺*\n`;
    
    try {
        fs.writeFileSync(reportPath, markdownContent);
        outputChannel.appendLine(`📄 Detailed report saved to: !VIBEWOLF-SECURITY-REPORT.md`);
        outputChannel.appendLine('🎯 Use this file to track your security fixes!');
    } catch (error) {
        outputChannel.appendLine(`❌ Failed to create report file: ${error}`);
    }
    
    outputChannel.appendLine('');
    outputChannel.appendLine('🐺 ==========================================');
    outputChannel.appendLine('🐺 SCAN COMPLETE - STAY SECURE!');
    outputChannel.appendLine('🐺 ==========================================');
}

function createDiagnostic(vulnerability: any): vscode.Diagnostic {
    const line = vulnerability.lineNumber - 1; // VS Code uses 0-based line numbers
    const range = new vscode.Range(line, 0, line, 1000);
    
    let severity: vscode.DiagnosticSeverity;
    switch (vulnerability.severity) {
        case 'CRITICAL':
            severity = vscode.DiagnosticSeverity.Error;
            break;
        case 'HIGH':
            severity = vscode.DiagnosticSeverity.Error;
            break;
        case 'MEDIUM':
            severity = vscode.DiagnosticSeverity.Warning;
            break;
        case 'LOW':
            severity = vscode.DiagnosticSeverity.Information;
            break;
        default:
            severity = vscode.DiagnosticSeverity.Warning;
    }

    const diagnostic = new vscode.Diagnostic(
        range,
        `🐺 ${vulnerability.description}\n💡 Fix: ${vulnerability.recommendation}\n\n🎛️ Right-click for VibeWolf management options`,
        severity
    );
    
    diagnostic.source = 'VibeWolf Security Scanner';
    diagnostic.code = {
        value: vulnerability.vulnerabilityType,
        target: vscode.Uri.parse(`vibewolf://manage/${vulnerability.vulnerabilityType}/${vulnerability.filePath}/${vulnerability.lineNumber}`)
    };
    
    return diagnostic;
}

function isScannableFile(document: vscode.TextDocument): boolean {
    const scannableExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte'];
    const ext = document.fileName.split('.').pop();
    return ext ? scannableExtensions.includes('.' + ext) : false;
}

function onDocumentSave(document: vscode.TextDocument) {
    const config = vscode.workspace.getConfiguration('securityScanner');
    if (config.get('enableRealTime', true)) {
        scanDocument(document);
    }
}

function onActiveEditorChange(editor: vscode.TextEditor | undefined) {
    if (editor) {
        const config = vscode.workspace.getConfiguration('securityScanner');
        if (config.get('enableRealTime', true)) {
            scanDocument(editor.document);
        }
    }
}

// VibeWolf Management Functions
async function ignoreIssue(uri: vscode.Uri, range: vscode.Range, diagnostic: vscode.Diagnostic) {
    const choice = await vscode.window.showQuickPick([
        '🚫 Ignore this specific instance',
        '📁 Ignore all issues in this file',
        '🎯 Ignore this issue type in entire project'
    ], {
        placeHolder: '🐺 How would you like to ignore this VibeWolf issue?'
    });
    
    if (choice) {
        vscode.window.showInformationMessage(`🐺 VibeWolf: ${choice} - Feature coming in next update!`);
        // TODO: Implement actual ignore functionality
    }
}

async function addToWhitelist(uri: vscode.Uri, range: vscode.Range, diagnostic: vscode.Diagnostic) {
    const choice = await vscode.window.showQuickPick([
        '➕ Add this exact pattern to whitelist',
        '🔄 Add similar patterns to whitelist',
        '📂 Whitelist this pattern for entire project',
        '👥 Share whitelist with team'
    ], {
        placeHolder: '🐺 How would you like to whitelist this pattern?'
    });
    
    if (choice) {
        vscode.window.showInformationMessage(`🐺 VibeWolf: ${choice} - Feature coming in next update!`);
        // TODO: Implement actual whitelist functionality
    }
}

async function markFalsePositive(uri: vscode.Uri, range: vscode.Range, diagnostic: vscode.Diagnostic) {
    const choice = await vscode.window.showQuickPick([
        '🎯 This is not actually a security issue',
        '🔧 This is intentional/safe in this context',
        '📚 Help improve VibeWolf detection',
        '📊 Report false positive to developers'
    ], {
        placeHolder: '🐺 Why is this a false positive?'
    });
    
    if (choice) {
        vscode.window.showInformationMessage(`🐺 VibeWolf: Thanks for the feedback! ${choice}`);
        // TODO: Implement false positive reporting
    }
}

async function showFixDetails(uri: vscode.Uri, range: vscode.Range, diagnostic: vscode.Diagnostic) {
    const vulnerabilityType = typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code;
    
    const fixGuides: Record<string, string> = {
        'exposed_secrets': `🔐 **How to Fix Exposed Secrets:**\n\n1. Move secrets to environment variables\n2. Use .env files (never commit them!)\n3. Use secure credential management\n4. Consider using secret management services\n\n**Example:**\n\`\`\`javascript\n// ❌ Bad\nconst apiKey = "abc123";\n\n// ✅ Good\nconst apiKey = process.env.API_KEY;\n\`\`\``,
        'firebase_security': `🔥 **How to Fix Firebase Security:**\n\n1. Implement proper security rules\n2. Use authentication\n3. Validate data on server-side\n4. Never expose admin credentials\n\n**Example Security Rules:**\n\`\`\`javascript\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if request.auth != null;\n    }\n  }\n}\n\`\`\``,
        'xss_vulnerabilities': `⚡ **How to Fix XSS Vulnerabilities:**\n\n1. Use textContent instead of innerHTML\n2. Sanitize user input\n3. Use framework-specific safe methods\n4. Validate and escape data\n\n**Example:**\n\`\`\`javascript\n// ❌ Dangerous\nelement.innerHTML = userInput;\n\n// ✅ Safe\nelement.textContent = userInput;\n\`\`\``,
        'insecure_http': `🔒 **How to Fix Insecure HTTP:**\n\n1. Always use HTTPS for external requests\n2. Update URLs to use https://\n3. Configure server to redirect HTTP to HTTPS\n4. Use HSTS headers\n\n**Example:**\n\`\`\`javascript\n// ❌ Insecure\nfetch('http://api.example.com/data');\n\n// ✅ Secure\nfetch('https://api.example.com/data');\n\`\`\``
    };
    
    const guide = fixGuides[vulnerabilityType as string] || `🐺 **General Security Fix Guide:**\n\nThis vulnerability requires attention. Please:\n\n1. Review the flagged code\n2. Consider security implications\n3. Apply appropriate fixes\n4. Test thoroughly\n\nFor specific guidance, consult security best practices for your framework.`;
    
    vscode.window.showInformationMessage(guide, { modal: true });
}

export function deactivate() {
    console.log('🐺 VibeWolf Security Scanner: Starting deactivation...');
    
    // Clear all diagnostics first
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
        console.log('✅ Diagnostic collection cleared and disposed');
    }
    
    // Dispose all registered disposables
    disposables.forEach(disposable => {
        try {
            if (disposable && typeof disposable.dispose === 'function') {
                disposable.dispose();
            }
        } catch (error) {
            console.error('Error disposing resource:', error);
        }
    });
    
    // Dispose all webview panels
    webviewPanels.forEach(panel => {
        try {
            if (panel) {
                panel.dispose();
            }
        } catch (error) {
            console.error('Error disposing webview panel:', error);
        }
    });
    webviewPanels = [];
    
    // Clear the disposables array
    disposables = [];
    
    // Dispose scanner properly
    if (scanner && typeof scanner.dispose === 'function') {
        scanner.dispose();
    }
    
    // Clear references
    scanner = undefined as any;
    diagnosticCollection = undefined as any;
    
    console.log('🐺 VibeWolf Security Scanner: Deactivation complete!');
    
    // Force garbage collection if available (helps with cleanup)
    if (global.gc) {
        global.gc();
    }
}
