🤖 Robo Web Server v3.0 (최종 안정화 버전)
본 프로젝트는 리눅스 서버에서 Node.js를 기반으로 동작하며, 아이폰 Safari 브라우저에서 실시간 타이핑 효과와 오디오 재생을 동기화하여 보여주는 로보 제어 서버입니다.
✨ 주요 기능 및 수정 사항
iOS 호환성 강화: 아이폰 Safari의 오디오 차단 정책을 우회하기 위한 안정적인 터치 기반 권한 획득 로직을 적용했습니다.
상단 미니 인터페이스: 'TAP TO CONNECT' 버튼을 상단으로 이동하고 크기를 축소하여 로봇 이미지를 가리지 않도록 개선했습니다.
상태 고정: 연결 성공 시 버튼이 'SYSTEM ONLINE' 문구로 고정되어 오디오 재생 중에도 UI가 변경되지 않습니다.
실시간 타이핑: 오디오 시작과 동시에 텍스트가 한 글자씩 출력되어 실제 로봇이 말하는 듯한 시각적 효과를 줍니다.
고정 600x600 캔버스: 로봇 이미지가 항상 고정된 크기로 출력되어 일관된 디자인을 유지합니다.
🚀 시작하기
필수 패키지 설치:
bash
npm install express
Use code with caution.

리소스 준비: silent.gif와 speaking.gif를 서버 파일과 동일한 위치에 둡니다.
서버 실행:
bash
node server.js
Use code with caution.

아이폰 접속: Safari 앱에서 http://[서버-IP]:5000 접속 후 상단의 TAP TO CONNECT 버튼을 탭합니다.
🛠 제어 테스트 (curl)
텍스트 예약 (메시지 전송):
bash
curl -X POST http://localhost:5000/text \
     -H "Content-Type: application/json" \
     -d '{"message": "안녕하세요! 로보 서버가 정상 작동 중입니다."}'
Use code with caution.

음성 실행 (WAV 전송):
bash
curl -X POST http://localhost:5000/wav \
     -H "Content-Type: audio/wav" \
     --data-binary @test.wav
Use code with caution.

🔍 문제 해결 (FAQ)
Q: 버튼이 SYSTEM ONLINE으로 바뀌지 않아요.
A: 아이폰 Safari에서 페이지를 새로고침한 후 버튼을 확실하게 한 번 클릭해 주세요.
Q: 텍스트는 나오는데 소리가 안 나요.
A: 아이폰 측면의 무음 모드 스위치가 켜져 있는지 확인하고, 볼륨을 높여주세요.
Q: 이미지 크기가 깨져 보여요.
A: 본 서버는 600x600 고정 사이즈를 사용합니다. 원본 GIF가 정사각형에 가까울수록 가장 예쁘게 출력됩니다.
