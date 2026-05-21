import * as vscode from 'vscode';

let breakTimer: NodeJS.Timeout;
let breakActive = false;

export function activate(context: vscode.ExtensionContext) {
    
    vscode.window.showInformationMessage(
        '20-20-20 extension is active 👀'
    );

    startBreakTimer();
}

function startBreakTimer() {
    breakTimer = setTimeout(() => {
        showBreakScreen();
    }, 20 * 60 * 1000); 
}

function showBreakScreen() {
    if (breakActive) {
        return;
    }

    breakActive = true;

    const panel = vscode.window.createWebviewPanel(
        'eyeBreak',
        '👀 Eye Break Time',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.reveal(vscode.ViewColumn.One, true);
    panel.webview.html = getBreakHtml();

    setTimeout(() => {
        panel.dispose();
        breakActive = false;
        startBreakTimer(); 
    }, 20000);
}

function getBreakHtml(): string {
    return `
    <!DOCTYPE html>
    <html>

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            html, body {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
                background: radial-gradient(circle at center, #0f172a, #020617);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }

            .container {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }

            .title {
                font-size: 70px;
                font-weight: bold;
                margin-bottom: 20px;
                animation: fadeIn 0.5s ease-in;
            }

            .subtitle {
                font-size: 26px;
                opacity: 0.8;
                margin-bottom: 40px;
                animation: fadeIn 0.5s ease-in 0.2s both;
            }

            .countdown {
                font-size: 160px;
                font-weight: bold;
                color: #38bdf8;
                text-shadow: 0 0 30px #38bdf8;
                animation: pulse 1s infinite, fadeIn 0.5s ease-in 0.4s both;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="title">👀 Eye Break Time</div>
            <div class="subtitle">
                Look 20 feet away for 20 seconds
            </div>
            <div class="countdown" id="countdown">20</div>
        </div>

        <script>
            let time = 20;
            const countdownElement = document.getElementById('countdown');

            const interval = setInterval(() => {
                time--;
                countdownElement.innerText = time;

                // Optional: Change color when time is low
                if (time <= 5) {
                    countdownElement.style.color = '#ff6b6b';
                    countdownElement.style.textShadow = '0 0 30px #ff6b6b';
                }

                if (time <= 0) {
                    clearInterval(interval);
                    // The panel will close automatically after 20 seconds
                }
            }, 1000);
        </script>
    </body>
    </html>
    `;
}

export function deactivate() {
    if (breakTimer) {
        clearTimeout(breakTimer);
    }
}