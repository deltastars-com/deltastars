const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Matches import or export ... from 'something'
    const importRegex = /(import|export)\s+(?:type\s+)?([^'"]*)\s+from\s+['"]([^'"]+)['"]/g;
    
    content = content.replace(importRegex, (match, keyword, what, importPath) => {
        if (!importPath.startsWith('.')) return match; // Not a relative import
        
        const currentDir = path.dirname(filePath);
        const resolvedPath = path.resolve(currentDir, importPath);
        
        // Check if resolved file exists (.ts, .tsx, .js, .jsx, etc.)
        const exts = ['', '.ts', '.tsx', '.js', '.jsx'];
        let exists = false;
        for (const ext of exts) {
            if (fs.existsSync(resolvedPath + ext) && fs.statSync(resolvedPath + ext).isFile()) {
                exists = true;
                break;
            }
        }
        
        if (exists) return match; // Path is correct
        
        // Otherwise, the path is broken. Let's find it in the root or src.
        const baseName = path.basename(importPath);
        const potentialPaths = [
            path.join('/opt/build/repo', baseName),
            path.join('/opt/build/repo/src/contexts', baseName),
            path.join('/opt/build/repo/src/hooks', baseName),
            path.join('/opt/build/repo/src/lib', baseName),
            path.join('/opt/build/repo/src/components', baseName),
        ];
        
        let foundPath = null;
        for (const p of potentialPaths) {
            for (const ext of exts) {
                if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) {
                    foundPath = p;
                    break;
                }
            }
            if (foundPath) break;
        }
        
        if (foundPath) {
            let newRelativePath = path.relative(currentDir, foundPath);
            if (!newRelativePath.startsWith('.')) newRelativePath = './' + newRelativePath;
            // Clean up backslashes for Windows just in case
            newRelativePath = newRelativePath.replace(/\\/g, '/');
            changed = true;
            return `${keyword} ${what} from '${newRelativePath}'`;
        }
        
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed imports in', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.netlify') continue;
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            fixFile(fullPath);
        }
    }
}

walkDir('/opt/build/repo');
