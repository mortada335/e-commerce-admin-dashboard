const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = '/Users/macbookshop/Desktop/e-commerce/frontend/src/pages';
const files = execSync(`find ${dir} -name "columns.jsx"`).toString().split('\n').filter(Boolean);

const extraction = {};

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /row(?:\.original|\?\.original)(?:\.|(?:\?\.))([a-zA-Z0-9_]+)/g;
    
    let match;
    const keys = new Set();
    while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
    }
    
    const accessorRegex = /accessorKey:\s*["']([^"']+)["']/g;
    while ((match = accessorRegex.exec(content)) !== null) {
        keys.add(match[1]);
    }

    if (keys.size > 0) {
        extraction[file.replace(dir + '/', '')] = Array.from(keys).sort();
    }
}

console.log(JSON.stringify(extraction, null, 2));
