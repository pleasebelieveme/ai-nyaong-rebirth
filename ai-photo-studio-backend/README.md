# 🐱 AI Photo Studio Backend

Google Cloud Run에서 동작하는 AI 사진 변환 백엔드 API입니다.

## 🚀 기술 스택

- **Node.js 18** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **TypeScript** - 타입 안전성
- **Google Gemini AI** - 이미지 변환 AI
- **Google Cloud Run** - 서버리스 배포
- **Docker** - 컨테이너화

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
# .env 파일에서 GEMINI_API_KEY 설정
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🔧 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `GEMINI_API_KEY` | Google Gemini API 키 | 필수 |
| `PORT` | 서버 포트 | 8080 |
| `NODE_ENV` | 환경 설정 | production |
| `CORS_ORIGIN` | CORS 허용 오리진 | http://localhost:5173 |
| `MAX_FILE_SIZE` | 최대 파일 크기 (bytes) | 10485760 (10MB) |
| `ALLOWED_MIME_TYPES` | 허용된 파일 타입 | image/jpeg,image/png,image/webp |

## 📡 API 엔드포인트

### 헬스 체크
- `GET /api/health` - 서비스 상태 확인
- `GET /api/health/ready` - 준비 상태 확인
- `GET /api/health/live` - 생존 상태 확인

### 이미지 처리
- `POST /api/image/convert` - 이미지를 고양이 사진으로 변환
- `GET /api/image/status` - 이미지 처리 서비스 상태

## 🐳 Docker 배포

### 1. 로컬 Docker 빌드
```bash
docker build -t ai-photo-studio-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key ai-photo-studio-backend
```

### 2. Google Cloud Run 배포
```bash
# Google Cloud SDK 설치 후
gcloud run deploy ai-photo-studio-backend \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

## 🔒 보안 기능

- **Helmet.js** - 보안 헤더 설정
- **CORS** - 크로스 오리진 요청 제어
- **Rate Limiting** - 요청 제한 (100 req/15min)
- **File Validation** - 파일 타입 및 크기 검증
- **Error Handling** - 안전한 에러 처리

## 📊 모니터링

- **Health Checks** - Cloud Run 자동 헬스 체크
- **Structured Logging** - 구조화된 로깅
- **Error Tracking** - 에러 추적 및 알림

## 🚀 Cloud Run 설정

### 리소스 할당
- **Memory**: 2GB
- **CPU**: 2 cores
- **Max Instances**: 10
- **Port**: 8080

### 환경 변수
```yaml
NODE_ENV: production
GEMINI_API_KEY: your_gemini_api_key
```

## 🔧 개발 가이드

### 프로젝트 구조
```
src/
├── index.ts              # 메인 서버 파일
├── routes/               # API 라우터
│   ├── healthRoutes.ts   # 헬스 체크
│   └── imageRoutes.ts    # 이미지 처리
├── services/             # 비즈니스 로직
│   └── geminiService.ts  # Gemini AI 연동
└── middleware/           # 미들웨어
    ├── errorHandler.ts   # 에러 처리
    ├── rateLimiter.ts    # 요청 제한
    └── imageValidation.ts # 이미지 검증
```

### API 사용 예제

#### 이미지 변환 요청
```bash
curl -X POST http://localhost:8080/api/image/convert \
  -F "image=@photo.jpg" \
  -H "Content-Type: multipart/form-data"
```

#### 응답 예제
```json
{
  "success": true,
  "message": "Image successfully converted to cat",
  "data": {
    "imageData": "base64_encoded_image_data",
    "mimeType": "image/jpeg",
    "originalName": "photo.jpg",
    "convertedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📄 라이선스

MIT License
