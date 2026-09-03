const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-sandbox',
        '--user-data-dir=C:\\xampp\\htdocs\\portalweb\\scratch\\chrome-profile'
    ]);

    // Wait 2 seconds for chrome to start
    await new Promise(r => setTimeout(r, 2000));

    try {
        const versionRes = await fetch('http://localhost:9222/json/version');
        const versionData = await versionRes.json();
        console.log('Browser:', versionData.Browser);

        const newTabRes = await fetch('http://localhost:9222/json/new?http://localhost/portalweb/html/sedes.html', { method: 'PUT' });
        const target = await newTabRes.json();
        console.log('Target created:', target.id);

        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let id = 1;
        const pending = new Map();
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (data.id && pending.has(data.id)) {
                pending.get(data.id)(data);
                pending.delete(data.id);
            }
            if (data.method === 'Runtime.consoleAPICalled') {
                console.log('CONSOLE:', data.params.type, data.params.args.map(a => a.value || a.description));
            }
            if (data.method === 'Log.entryAdded') {
                console.log('LOG:', data.params.entry);
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
        await send('Log.enable');

        // Wait 3 seconds for load
        await new Promise(r => setTimeout(r, 3000));

        // Evaluate icons on page
        const evalResult = await send('Runtime.evaluate', {
            expression: `(() => {
                const icons = Array.from(document.querySelectorAll('i'));
                return icons.map(i => {
                    const style = window.getComputedStyle(i);
                    const before = window.getComputedStyle(i, ':before');
                    return {
                        className: i.className,
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        color: style.color,
                        display: style.display,
                        width: style.width,
                        height: style.height,
                        beforeContent: before.content,
                        beforeFontFamily: before.fontFamily
                    };
                });
            })()`,
            returnByValue: true
        });

        console.log('ICONS FOUND:', evalResult.result.value?.length);
        console.log('FIRST 5 ICONS:', JSON.stringify(evalResult.result.value?.slice(0, 10), null, 2));

        // Check Font Awesome stylesheet status
        const faCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
                const faSheets = Array.from(document.styleSheets).filter(s => s.href && s.href.includes('font-awesome'));
                let rulesCount = 0;
                try {
                    rulesCount = faSheets.length > 0 ? faSheets[0].cssRules.length : -1;
                } catch(e) {
                    rulesCount = 'CORS blocked: ' + e.message;
                }
                const fonts = Array.from(document.fonts).map(f => ({ family: f.family, status: f.status, loaded: f.loaded }));
                return { links, faSheetsCount: faSheets.length, rulesCount, fontsLoaded: fonts.length, fonts };
            })()`,
            returnByValue: true
        });
        console.log('FA CHECK:', JSON.stringify(faCheck.result.value, null, 2));

        // Take a screenshot
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        if (screenshot.result?.data) {
            fs.writeFileSync('C:\\xampp\\htdocs\\portalweb\\scratch\\sedes_shot.png', Buffer.from(screenshot.result.data, 'base64'));
            console.log('Screenshot saved to scratch/sedes_shot.png');
        }

        ws.close();
    } catch(err) {
        console.error('Error:', err);
    } finally {
        chrome.kill();
    }
}

main();
