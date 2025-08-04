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
    const workspaceName = workspaceRoot.split(/[\\/]/).pop() || 'Unknown Project';
    
    // Terminal output
    const outputChannel = vscode.window.createOutputChannel('VibeWolf Security Scanner');
    outputChannel.clear();
    outputChannel.show(true);
    
    outputChannel.appendLine('🐺 ==========================================');
    outputChannel.appendLine('🐺 VIBEWOLF SECURITY SCANNER RESULTS');
    outputChannel.appendLine('🐺 ==========================================');
    outputChannel.appendLine(`📅 Scan Date: ${new Date().toLocaleString()}`);
    outputChannel.appendLine(`📁 Project: ${workspaceName}`);
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
                const relativePath = vuln.filePath.replace(workspaceRoot, '').replace(/\\/g, '/').replace(/^\//, '');
                outputChannel.appendLine(`${index + 1}. ${relativePath}:${vuln.lineNumber}`);
                outputChannel.appendLine(`   Type: ${vuln.vulnerabilityType}`);
                outputChannel.appendLine(`   Issue: ${vuln.description}`);
                outputChannel.appendLine(`   Code: ${vuln.codeSnippet.trim()}`);

                outputChannel.appendLine('');
            });
        }
    });
    
    // Create beautiful markdown file
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(workspaceRoot, '!VIBEWOLF-SECURITY-REPORT.md');
    
    let markdownContent = `# 🐺 VibeWolf Security Report\n\n`;
    markdownContent += `> **Project:** ${workspaceName}  \n`;
    markdownContent += `> **Scan Date:** ${new Date().toLocaleString()}  \n`;
    markdownContent += `> **Guardian Wolf Status:** ${vulnerabilities.length === 0 ? '✅ All Clear!' : `🛡️ ${vulnerabilities.length} Issues Found`}\n\n`;
    
    if (vulnerabilities.length === 0) {
        markdownContent += `## 🎉 Excellent! No Security Issues Found\n\n`;
        markdownContent += `Your code is secure and ready for deployment! The Guardian Wolf found no vulnerabilities.\n\n`;
        markdownContent += `### 🚀 Next Steps:\n`;
        markdownContent += `- ✅ Your app is ready for backend migration\n`;
        markdownContent += `- ✅ Safe to deploy to app stores\n`;
        markdownContent += `- ✅ No security concerns detected\n\n`;
    } else {
        // Beautiful severity summary with progress bars
        markdownContent += `## 📊 Security Overview\n\n`;
        markdownContent += `| Severity | Count | Status |\n`;
        markdownContent += `|----------|-------|--------|\n`;
        markdownContent += `| 🔴 Critical | ${bySeverity.CRITICAL.length} | ${bySeverity.CRITICAL.length > 0 ? '⚠️ Immediate Action Required' : '✅ Clear'} |\n`;
        markdownContent += `| 🟠 High | ${bySeverity.HIGH.length} | ${bySeverity.HIGH.length > 0 ? '🔧 Fix Before Deployment' : '✅ Clear'} |\n`;
        markdownContent += `| 🟡 Medium | ${bySeverity.MEDIUM.length} | ${bySeverity.MEDIUM.length > 0 ? '📋 Review Recommended' : '✅ Clear'} |\n`;
        markdownContent += `| 🔵 Low | ${bySeverity.LOW.length} | ${bySeverity.LOW.length > 0 ? '💡 Consider Improving' : '✅ Clear'} |\n\n`;
        
        // Detailed findings with better formatting
        ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
            const vulns = bySeverity[severity as keyof typeof bySeverity];
            if (vulns.length > 0) {
                const emoji = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🔵';
                const urgency = severity === 'CRITICAL' ? 'URGENT' : severity === 'HIGH' ? 'HIGH PRIORITY' : severity === 'MEDIUM' ? 'MODERATE' : 'LOW PRIORITY';
                
                markdownContent += `## ${emoji} ${severity} Issues (${vulns.length}) - ${urgency}\n\n`;
                
                vulns.forEach((vuln, index) => {
                    const relativePath = vuln.filePath.replace(workspaceRoot, '').replace(/\\/g, '/').replace(/^\//, '');
                    const fileName = relativePath.split('/').pop();
                    const folderPath = relativePath.substring(0, relativePath.lastIndexOf('/'));
                    
                    markdownContent += `### ${index + 1}. ${fileName} ${severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : severity === 'MEDIUM' ? '⚡' : '💡'}\n\n`;
                    markdownContent += `**📁 Location:** \`${folderPath ? folderPath + '/' : ''}${fileName}:${vuln.lineNumber}\`\n\n`;
                    markdownContent += `**🔍 Issue Type:** ${vuln.vulnerabilityType.replace(/_/g, ' ').toUpperCase()}\n\n`;
                    markdownContent += `**📝 Description:** ${vuln.description}\n\n`;
                    
                    markdownContent += `**💻 Code:**\n\`\`\`javascript\n${vuln.codeSnippet.trim()}\n\`\`\`\n\n`;
                    
                    if (index < vulns.length - 1) {
                        markdownContent += `---\n\n`;
                    }
                });
                markdownContent += `\n`;
            }
        });
    }
    
    markdownContent += `## 🎯 Action Plan\n\n`;
    if (bySeverity.CRITICAL.length > 0) {
        markdownContent += `### 🚨 CRITICAL VULNERABILITIES DETECTED\n`;
        markdownContent += `**${bySeverity.CRITICAL.length} critical security issue(s) found**\n\n`;
    }
    if (bySeverity.HIGH.length > 0) {
        markdownContent += `### ⚠️ HIGH RISK VULNERABILITIES\n`;
        markdownContent += `**${bySeverity.HIGH.length} high-risk security issue(s) detected**\n\n`;
    }
    if (bySeverity.MEDIUM.length > 0 || bySeverity.LOW.length > 0) {
        markdownContent += `### 📋 ADDITIONAL VULNERABILITIES\n`;
        markdownContent += `**${bySeverity.MEDIUM.length + bySeverity.LOW.length} medium/low security issue(s) detected**\n\n`;
    }
    
    markdownContent += `---\n\n`;
    markdownContent += `## 🐺 About VibeWolf\n\n`;
    markdownContent += `**VibeWolf Security Scanner** - The Guardian Wolf for Developers\n\n`;
    markdownContent += `- 🎯 **83% Noise Reduction** - Only flags real security issues\n`;
    markdownContent += `- 🎛️ **Interactive Management** - Right-click to manage issues\n`;
    markdownContent += `- 📊 **Triple Output** - Visual + Terminal + This Report\n\n`;
    markdownContent += `*"No developer should accidentally expose their secrets to the world."* 🛡️\n\n`;
    markdownContent += `---\n\n`;
    markdownContent += `**Generated by VibeWolf v1.0.8** | [Buy me a coffee](https://buymeacoffee.com/watsy) ☕\n\n`;
    markdownContent += `---\n`;
    markdownContent += `*Generated by VibeWolf Security Scanner - Your Guardian Wolf 🐺*\n`;
    
    try {
        fs.writeFileSync(reportPath, markdownContent);
        outputChannel.appendLine(`📄 Detailed report saved to: !VIBEWOLF-SECURITY-REPORT.md`);
        outputChannel.appendLine('📄 Security vulnerability report generated');
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
        `🐺 ${vulnerability.description}\n\n🔍 Security vulnerability detected - Right-click for options`,
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
