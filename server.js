const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.raw({ type: 'audio/wav', limit: '50mb' }));

let clients = [];

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
            <title>Robo Client Final</title>
            <style>
                body { 
                    text-align:center; background:#121212; color:white; 
                    font-family:-apple-system, sans-serif; margin:0; 
                    height:100vh; display:flex; flex-direction:column; 
                    align-items:center; justify-content:center;
                    overflow: hidden;
                }
                #startBtn { 
                    position: fixed; top: 25px; padding: 8px 18px; font-size: 11px; 
                    border-radius: 20px; border: 1px solid #444;
                    background: rgba(255,255,255,0.08); color: #00ff88; 
                    cursor: pointer; letter-spacing: 1.5px;
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    z-index: 100; transition: all 0.3s;
                }
                .connected-status {
                    border: 1px solid transparent !important;
                    background: transparent !important;
                    color: #666 !important;
                    cursor: default !important;
                }
                .robot-container {
                    width: 600px; height: 600px; border-radius: 35px;
                    background: #1a1a1a; overflow: hidden;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.9);
                    display: flex; align-items: center; justify-content: center;
                }
                #robot-img { width: 600px; height: 600px; object-fit: cover; transition: transform 0.3s; }
                #text-display { 
                    margin-top: 40px; font-size: 2.2em; font-weight: 700; 
                    padding: 0 30px; min-height: 1.5em; color: #00ff88; 
                    max-width: 800px; word-break: keep-all;
                }
                @media (max-width: 650px) {
                    .robot-container, #robot-img { width: 90vw; height: 90vw; }
                    #text-display { font-size: 1.6em; }
                }
            </style>
        </head>
        <body>
            <button id="startBtn">TAP TO CONNECT</button>
            <div style="display:none;"><img src="/silent.gif"><img src="/speaking.gif"></div>
            <div class="robot-container"><img id="robot-img" src="/silent.gif"></div>
            <div id="text-display"></div>
            <audio id="player" preload="auto" playsinline></audio>

            <script>
                const img = document.getElementById('robot-img');
                const textDisp = document.getElementById('text-display');
                const player = document.getElementById('player');
                const startBtn = document.getElementById('startBtn');

                let currentMessage = "";
                let typeTimeout;
                let isUnlocked = false;

                function typeWriter(text, i) {
                    if (i < text.length) {
                        textDisp.innerHTML += text.charAt(i);
                        typeTimeout = setTimeout(() => typeWriter(text, i + 1), 65);
                    }
                }

                // 버튼 클릭 시 단 한 번만 상태 변경
                startBtn.onclick = function() {
                    if (isUnlocked) return;
                    
                    // 빈 사운드로 재생 권한만 획득 시도
                    player.play().catch(() => {}); 
                    player.pause();
                    
                    // 무조건 상태 변경 (이후 오디오 데이터 수신 시 재생 가능해짐)
                    isUnlocked = true;
                    startBtn.innerText = "SYSTEM ONLINE";
                    startBtn.classList.add("connected-status");
                };

                const evSource = new EventSource('/stream');
                evSource.onmessage = function(e) {
                    const data = JSON.parse(e.data);
                    if (data.type === 'text') {
                        currentMessage = data.content;
                        // 텍스트 영역을 미리 비워둠 (오디오 신호 대기)
                        textDisp.innerText = "";
                    } 
                    else if (data.type === 'audio') {
                        // 1. 시각 효과 시작
                        img.src = '/speaking.gif';
                        img.style.transform = "scale(1.04)";
                        
                        // 2. 타이핑 시작
                        textDisp.innerText = "";
                        clearTimeout(typeTimeout);
                        typeWriter(currentMessage, 0);

                        // 3. 오디오 재생 (캐시 방지 타임스탬프 필수)
                        player.src = '/audio.wav?t=' + Date.now();
                        player.load();
                        
                        // 사용자 상호작용 기록이 있으므로 play() 성공함
                        var playPromise = player.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(function(error) {
                                console.log("Playback interaction record active");
                            });
                        }
                    }
                };

                player.onended = () => {
                    img.src = '/silent.gif';
                    img.style.transform = "scale(1)";
                    clearTimeout(typeTimeout);
                    textDisp.innerText = ""; 
                };
            </script>
        </body>
        </html>
    `);
});

app.use(express.static(__dirname));

app.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    clients.push(res);
    req.on('close', () => clients = clients.filter(c => c !== res));
});

function broadcast(data) {
    clients.forEach(c => c.write(`data: ${JSON.stringify(data)}\n\n`));
}

app.post('/text', (req, res) => {
    broadcast({ type: 'text', content: req.body.message });
    res.status(200).send("OK");
});

app.post('/wav', (req, res) => {
    fs.writeFileSync(path.join(__dirname, 'audio.wav'), req.body);
    broadcast({ type: 'audio' });
    res.status(200).send("OK");
});

app.listen(5000, '0.0.0.0', () => console.log('Robo Server: Port 5000'));

