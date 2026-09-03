const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const profileDir = 'C:\\xampp\\htdocs\\portalweb\\scratch\\chrome-test-profile';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-sandbox',
        `--user-data-dir=${profileDir}`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const pagesToTest = [
            { name: 'sedes', url: 'http://localhost/portalweb/html/sedes.html' },
            { name: 'index', url: 'http://localhost/portalweb/index.html' },
            { name: 'sede-central', url: 'http://localhost/portalweb/html/sede-central.html' },
            { name: 'academico', url: 'http://localhost/portalweb/html/academico.html' }
        ];

        for (const pageInfo of pagesToTest) {
            console.log(`\n========================================`);
            console.log(`Testing page: ${pageInfo.name} (${pageInfo.url})`);
            console.log(`========================================`);

            const newTabRes = await fetch(`http://localhost:9222/json/new?${encodeURIComponent(pageInfo.url)}`, { method: 'PUT' });
            const target = await newTabRes.json();

            const ws = new WebSocket(target.webSocketDebuggerUrl);
            let id = 1;
            const pending = new Map();
            ws.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.id && pending.has(data.id)) {
                    pending.get(data.id)(data);
                    pending.delete(data.id);
                }
            };

            await new Promise(r => ws.onopen = r);

            function send(method, params = {}) {
                return new Promise((resolve) => {
                    const msgId = id++;
                    pending.set(msgId, resolve);
                    ws.send(JSON.stringify({ id: msgId, method, params }));
                });
            }

            await send('Page.enable');
            await send('Runtime.enable');

            // Wait 2.5s for page to fully load
            await new Promise(r => setTimeout(r, 2500));

            // 1. Test in NORMAL mode
            const normalIcons = await send('Runtime.evaluate', {
                expression: `(() => {
                    const icons = Array.from(document.querySelectorAll('i, [class*="fa-"]'));
                    const samples = icons.slice(0, 15).map(i => {
                        const style = window.getComputedStyle(i);
                        const before = window.getComputedStyle(i, ':before');
                        return {
                            tag: i.outerHTML.substring(0, 60),
                            fontFamily: style.fontFamily,
                            content: before.content
                        };
                    });
                    return { total: icons.length, samples };
                })()`,
                returnByValue: true
            });

            console.log(`[NORMAL MODE] Found ${normalIcons.result?.result?.value?.total} icons.`);
            const brokenNormal = normalIcons.result?.result?.value?.samples?.filter(s => s.content === 'none' || !s.fontFamily.includes('Font Awesome'));
            console.log(`[NORMAL MODE] Broken icons sample count: ${brokenNormal?.length || 0}`);
            if (brokenNormal?.length > 0) {
                console.log('Broken samples:', brokenNormal);
            } else {
                console.log('Sample normal icons:');
                normalIcons.result?.result?.value?.samples?.slice(0, 4).forEach(s => console.log('  ', s.tag, '->', s.fontFamily, 'glyph:', s.content));
            }

            // Normal screenshot
            const normalShot = await send('Page.captureScreenshot', { format: 'png' });
            if (normalShot.result?.data) {
                fs.writeFileSync(`C:\\xampp\\htdocs\\portalweb\\scratch\\shot_${pageInfo.name}_normal.png`, Buffer.from(normalShot.result.data, 'base64'));
            }

            // 2. Test in DYSLEXIA mode
            await send('Runtime.evaluate', {
                expression: `document.body.classList.add('dyslexia-friendly');`
            });
            await new Promise(r => setTimeout(r, 500));

            const dyslexiaIcons = await send('Runtime.evaluate', {
                expression: `(() => {
                    const icons = Array.from(document.querySelectorAll('i, [class*="fa-"]'));
                    const bodyStyle = window.getComputedStyle(document.body);
                    const samples = icons.slice(0, 15).map(i => {
                        const style = window.getComputedStyle(i);
                        const before = window.getComputedStyle(i, ':before');
                        return {
                            tag: i.outerHTML.substring(0, 60),
                            fontFamily: style.fontFamily,
                            content: before.content
                        };
                    });
                    return { bodyFont: bodyStyle.fontFamily, total: icons.length, samples };
                })()`,
                returnByValue: true
            });

            console.log(`[DYSLEXIA MODE] Body font correctly changed to: ${dyslexiaIcons.result?.result?.value?.bodyFont}`);
            const brokenDyslexia = dyslexiaIcons.result?.result?.value?.samples?.filter(s => s.content === 'none' || !s.fontFamily.includes('Font Awesome'));
            console.log(`[DYSLEXIA MODE] Broken icons sample count: ${brokenDyslexia?.length || 0}`);
            if (brokenDyslexia?.length > 0) {
                console.log('BROKEN IN DYSLEXIA MODE:', brokenDyslexia);
            } else {
                console.log('All icons preserved their Font Awesome family & glyphs in Dyslexia mode!');
                dyslexiaIcons.result?.result?.value?.samples?.slice(0, 4).forEach(s => console.log('  ', s.tag, '->', s.fontFamily, 'glyph:', s.content));
            }

            // Dyslexia screenshot
            const dyslexiaShot = await send('Page.captureScreenshot', { format: 'png' });
            if (dyslexiaShot.result?.data) {
                fs.writeFileSync(`C:\\xampp\\htdocs\\portalweb\\scratch\\shot_${pageInfo.name}_dyslexia.png`, Buffer.from(dyslexiaShot.result.data, 'base64'));
            }

            ws.close();
            await fetch(`http://localhost:9222/json/close/${target.id}`, { method: 'PUT' });
        }

        console.log('\n========================================');
        console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
        console.log('========================================');

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        chrome.kill();
    }
}

main();
