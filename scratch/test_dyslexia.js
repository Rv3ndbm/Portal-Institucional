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

    await new Promise(r => setTimeout(r, 2000));

    try {
        const newTabRes = await fetch('http://localhost:9222/json/new?http://localhost/portalweb/html/sedes.html', { method: 'PUT' });
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

        await new Promise(r => setTimeout(r, 2000));

        // Apply fix and activate dyslexia-friendly
        await send('Runtime.evaluate', {
            expression: `(() => {
                const style = document.createElement('style');
                style.innerHTML = \`
                    body.dyslexia-friendly i,
                    body.dyslexia-friendly .fas,
                    body.dyslexia-friendly .far,
                    body.dyslexia-friendly .fab,
                    body.dyslexia-friendly .fa,
                    body.dyslexia-friendly [class*="fa-"] {
                        font-family: "Font Awesome 6 Free" !important;
                        letter-spacing: normal !important;
                    }
                    body.dyslexia-friendly .fab {
                        font-family: "Font Awesome 6 Brands" !important;
                    }
                    body.dyslexia-friendly .far {
                        font-family: "Font Awesome 6 Free" !important;
                        font-weight: 400 !important;
                    }
                \`;
                document.head.appendChild(style);
                document.body.classList.add('dyslexia-friendly');
            })()`
        });

        await new Promise(r => setTimeout(r, 500));

        // Evaluate icons on page
        const evalResult = await send('Runtime.evaluate', {
            expression: `(() => {
                const icons = Array.from(document.querySelectorAll('.card-icon i, .accessibility-widget i, .search-toggle-btn i'));
                return icons.map(i => {
                    const style = window.getComputedStyle(i);
                    const before = window.getComputedStyle(i, ':before');
                    return {
                        className: i.className,
                        fontFamily: style.fontFamily,
                        beforeContent: before.content,
                        beforeFontFamily: before.fontFamily
                    };
                });
            })()`,
            returnByValue: true
        });

        console.log('EVAL WITH FIX:', JSON.stringify(evalResult.result.result.value, null, 2));

        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        if (screenshot.result?.data) {
            fs.writeFileSync('C:\\xampp\\htdocs\\portalweb\\scratch\\dyslexia_fixed_shot.png', Buffer.from(screenshot.result.data, 'base64'));
            console.log('Screenshot saved to scratch/dyslexia_fixed_shot.png');
        }

        ws.close();
    } catch(err) {
        console.error('Error:', err);
    } finally {
        chrome.kill();
    }
}

main();
