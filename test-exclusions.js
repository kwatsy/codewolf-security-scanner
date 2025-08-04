// Test file exclusions
const { FileUtils } = require('./out/utils/file-utils');
const path = require('path');

async function testExclusions() {
    console.log('🔍 Testing file exclusions...\n');
    
    const projectPath = __dirname;
    console.log(`📁 Project path: ${projectPath}\n`);
    
    try {
        const files = await FileUtils.collectFiles(projectPath);
        
        console.log(`📊 Total files found: ${files.length}\n`);
        
        console.log('📋 Files that will be scanned:');
        files.forEach((file, index) => {
            const relativePath = path.relative(projectPath, file);
            console.log(`${index + 1}. ${relativePath}`);
        });
        
        // Check if any problematic files are still included
        const problemFiles = files.filter(file => {
            const relativePath = path.relative(projectPath, file);
            return relativePath.includes('rules') || 
                   relativePath.includes('test-') ||
                   relativePath.includes('create-') ||
                   relativePath.endsWith('.vsix') ||
                   relativePath.includes('SECURITY-REPORT');
        });
        
        if (problemFiles.length > 0) {
            console.log('\n❌ Problem files still included:');
            problemFiles.forEach(file => {
                const relativePath = path.relative(projectPath, file);
                console.log(`   - ${relativePath}`);
            });
        } else {
            console.log('\n✅ All problematic files properly excluded!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testExclusions();
