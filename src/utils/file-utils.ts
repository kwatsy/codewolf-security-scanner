import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
    private static readonly SKIP_DIRECTORIES = new Set([
        'node_modules', '.git', 'dist', 'build', '.next', 'coverage'
    ]);
    
    private static readonly TARGET_EXTENSIONS = new Set([
        '.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte'
    ]);
    
    static shouldSkipDirectory(dirName: string): boolean {
        return this.SKIP_DIRECTORIES.has(dirName);
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
                } else if (stat.isFile() && this.isTargetFile(fullPath)) {
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
                } else if (stat.isFile() && this.isTargetFile(fullPath)) {
                    files.push(fullPath);
                }
            }
        };

        await scanRecursive(directoryPath);
        return files;
    }
}
