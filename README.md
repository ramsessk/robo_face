# 🤖 Robo Web Server v3.0

본 프로젝트는 리눅스 서버에서 Node.js를 기반으로 동작하며, 아이폰 Safari 브라우저에서 **실시간 타이핑 효과**와 **오디오 재생**을 동기화하여 보여주는 로보 제어 서버입니다.

## ✨ 주요 기능 및 수정 사항

*   **iOS 호환성 강화**: 아이폰 Safari의 오디오 차단 정책을 우회하기 위해 안정적인 터치 기반 권한 획득 로직을 적용했습니다.
*   **상단 미니 인터페이스**: 'TAP TO CONNECT' 버튼을 상단으로 이동하고 크기를 축소하여 로봇 이미지를 가리지 않도록 개선했습니다.
*   **상태 고정**: 연결 성공 시 버튼이 'SYSTEM ONLINE' 문구로 고정되어 오디오 재생 중에도 UI가 변경되지 않습니다.
*   **실시간 타이핑**: 오디오 시작과 동시에 텍스트가 한 글자씩 출력되어 실제 로봇이 말하는 듯한 시각적 효과를 줍니다.
*   **고정 600x600 캔버스**: 로봇 이미지가 항상 고정된 크기(600x600px)로 출력되며, 모바일 환경에서는 비율에 맞춰 자동 스케일링됩니다.

## 📁 프로젝트 구조

```text
robo-server/
├── server.js        # 메인 서버 코드
├── silent.gif       # 대기 상태 이미지 (600x600 권장)
├── speaking.gif     # 재생 상태 이미지 (600x600 권장)
├── audio.wav        # 수신된 오디오 데이터 (자동 생성)
└── package.json     # 의존성 설정
```

## 🚀 설치 및 실행 방법

   1. 필수 패키지 설치:
```bash 
   npm install express
```   
   2. 리소스 준비: silent.gif와 speaking.gif를 server.js와 동일한 폴더에 넣습니다.
   3. 서버 시작:
```bash   
   # 외부 기기 접속을 위해 0.0.0.0 포트로 실행됩니다.
   node server.js
```   
   4. 아이폰 접속: Safari 앱에서 http://[리눅스-IP]:5000 접속 후 상단의 TAP TO CONNECT 버튼을 탭합니다.

## 🛠 제어 테스트 (curl)
1. 메시지 예약 (텍스트 전송):
```bash
curl -X POST http://localhost:5000/text \
     -H "Content-Type: application/json" \
     -d '{"message": "안녕하세요! 로보 서버가 정상 작동 중입니다."}'
```
2. 음성 실행 (WAV 전송):
오디오를 전송하면 위에서 예약한 텍스트와 함께 로봇이 움직이며 말을 합니다.

```bash
curl -X POST http://localhost:5000/wav \
     -H "Content-Type: audio/wav" \
     --data-binary @test.wav
```
## 🔍 문제 해결 (FAQ)

* 접속이 안 됩니다: app.listen 설정이 0.0.0.0인지 확인하고, 리눅스 방화벽에서 5000번 포트를 허용했는지 확인하세요.
* SYSTEM ONLINE으로 바뀌지 않아요: 아이폰 Safari에서 페이지 새로고침 후 버튼을 확실하게 한 번 클릭해야 권한이 생성됩니다.
* 소리가 나지 않아요: 아이폰 측면 무음 스위치를 확인하고 볼륨을 높여주세요.




