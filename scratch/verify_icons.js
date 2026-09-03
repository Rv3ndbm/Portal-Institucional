const fs = require('fs');
const path = require('path');

// Read FontAwesome 6.4.0 all.min.css to extract all known icon classes
const cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

async function verifyAllIcons() {
    console.log('Fetching FA 6.4.0 CSS...');
    const res = await fetch(cdnUrl);
    const css = await res.text();
    
    // Find all .fa-xxx:before rules
    const knownIcons = new Set();
    const regex = /\.fa-([a-z0-9-]+):before/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
        knownIcons.add('fa-' + match[1]);
    }
    console.log(`Loaded ${knownIcons.size} known Font Awesome icons.`);

    // Find all HTML and PHP files
    function getFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
                    results = results.concat(getFiles(fullPath));
                }
            } else if (file.endsWith('.html') || file.endsWith('.php') || file.endsWith('.js')) {
                results.push(fullPath);
            }
        });
        return results;
    }

    const files = getFiles('c:\\xampp\\htdocs\\portalweb');
    console.log(`Scanning ${files.length} files for icon classes...`);

    const unknownIcons = [];
    const iconTagRegex = /<i[^>]*class=["']([^"']*)["'][^>]*>/gi;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        let tagMatch;
        while ((tagMatch = iconTagRegex.exec(content)) !== null) {
            const classes = tagMatch[1].split(/\s+/);
            const faClasses = classes.filter(c => c.startsWith('fa-') && c !== 'fa-solid' && c !== 'fa-regular' && c !== 'fa-brands' && c !== 'fa-2x' && c !== 'fa-3x' && c !== 'fa-lg' && c !== 'fa-fw' && c !== 'fa-spin');
            for (const fc of faClasses) {
                if (!knownIcons.has(fc)) {
                    unknownIcons.push({ file: path.relative('c:\\xampp\\htdocs\\portalweb', file), tag: tagMatch[0], class: fc });
                }
            }
        }
    }

    console.log('\n--- SCAN RESULTS ---');
    if (unknownIcons.length === 0) {
        console.log('All icons found in HTML/PHP match known Font Awesome 6.4.0 icons!');
    } else {
        console.log(`Found ${unknownIcons.length} unknown/invalid icon classes:`);
        unknownIcons.forEach(u => console.log(`  File: ${u.file} | Class: ${u.class} | Tag: ${u.tag}`));
    }
}

verifyAllIcons();
