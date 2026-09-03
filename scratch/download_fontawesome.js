const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'vendor', 'fontawesome');
const cssDir = path.join(baseDir, 'css');
const fontsDir = path.join(baseDir, 'webfonts');

fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(fontsDir, { recursive: true });

const filesToDownload = [
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        dest: path.join(cssDir, 'all.min.css')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
        dest: path.join(fontsDir, 'fa-solid-900.woff2')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.ttf',
        dest: path.join(fontsDir, 'fa-solid-900.ttf')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
        dest: path.join(fontsDir, 'fa-regular-400.woff2')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.ttf',
        dest: path.join(fontsDir, 'fa-regular-400.ttf')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
        dest: path.join(fontsDir, 'fa-brands-400.woff2')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.ttf',
        dest: path.join(fontsDir, 'fa-brands-400.ttf')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-v4compatibility.woff2',
        dest: path.join(fontsDir, 'fa-v4compatibility.woff2')
    },
    {
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-v4compatibility.ttf',
        dest: path.join(fontsDir, 'fa-v4compatibility.ttf')
    }
];

async function downloadAll() {
    console.log('Downloading Font Awesome 6.4.0 local assets...');
    for (const item of filesToDownload) {
        console.log(`Fetching ${path.basename(item.dest)}...`);
        try {
            const res = await fetch(item.url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const arrayBuffer = await res.arrayBuffer();
            fs.writeFileSync(item.dest, Buffer.from(arrayBuffer));
            console.log(`Saved ${path.basename(item.dest)} (${arrayBuffer.byteLength} bytes)`);
        } catch (err) {
            console.error(`Error fetching ${item.url}:`, err.message);
        }
    }
    console.log('All Font Awesome assets downloaded successfully!');
}

downloadAll();
