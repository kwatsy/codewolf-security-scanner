import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
    private static readonly SKIP_DIRECTORIES = new Set([
        'node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'out', 'temp', 'images'
    ]);
    
    private static readonly SKIP_FILES = new Set([
        'test-extension.js', 'test-scanner.js', 'test-exclusions.js', 'security-report.html'
    ]);
    
    private static readonly SKIP_PATTERNS = [
        /[\\/]rules[\\/]/,  // Skip any files in rules directories (src/rules/, out/rules/) - handles both / and \
        /test-.*\.(js|ts)$/,  // Skip test-*.js and test-*.ts files
        /create-.*\.js$/,  // Skip create-*.js utility files
        /.*-SECURITY-REPORT\.md$/,  // Skip generated security reports
        /\.vsix$/,  // Skip extension package files
        /package-lock\.json$/,  // Skip package lock files
        /tsconfig\.json$/,  // Skip TypeScript config
    ];
    
    private static readonly TARGET_EXTENSIONS = new Set([
        '.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte'
    ]);
    
    static shouldSkipDirectory(dirName: string): boolean {
        return this.SKIP_DIRECTORIES.has(dirName);
    }
    
    static shouldSkipFile(filePath: string): boolean {
        const fileName = path.basename(filePath);
        
        // Check if file is in skip list
        if (this.SKIP_FILES.has(fileName)) {
            return true;
        }
        
        // Check if file matches any skip patterns
        return this.SKIP_PATTERNS.some(pattern => pattern.test(filePath));
    }
    
    static isTargetFile(filePath: string): boolean {
        const ext = path.extname(filePath);
        return this.TARGET_EXTENSIONS.has(ext);
    }
    
    static async collectFiles(dirPath: string): Promise<string[]> {
        const files: string[] = [];
        
        const scanRecursive = async (currentPath: string) => {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!this.shouldSkipDirectory(item)) {
                        await scanRecursive(fullPath);
                    }
                } else if (stat.isFile() && this.isTargetFile(fullPath) && !this.shouldSkipFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        };
        
        await scanRecursive(dirPath);
        return files;
    }
    
    static async readFileContent(filePath: string): Promise<string> {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            return '';
        }
    }
    
    static async scanDirectoryFiles(directoryPath: string): Promise<string[]> {
        const files: string[] = [];
        
        const scanRecursive = async (dirPath: string) => {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!this.shouldSkipDirectory(item)) {
                        await scanRecursive(fullPath);
                    }
                } else if (stat.isFile() && this.isTargetFile(fullPath) && !this.shouldSkipFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        };

        await scanRecursive(directoryPath);
        return files;
    }
}
