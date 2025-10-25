# 🐱 AI Cat Photo Studio

AI를 통해 사진을 고양이 사진으로 변환하는 재미있는 웹 애플리케이션입니다!

## 🚀 기술 스택

- **React 18** - 최신 React 기능과 Hooks
- **Vite** - 빠른 개발 환경과 빌드 도구
- **TDS Mobile** - 토스의 모바일 UI 컴포넌트 라이브러리
- **Emotion** - CSS-in-JS 스타일링
- **ESLint** - 코드 품질 관리
- **CSS3** - 모던 스타일링과 반응형 디자인

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

### 4. 빌드 미리보기
```bash
npm run preview
```

## 🛠️ 개발 스크립트

- `npm run dev` - 개발 서버 실행 (http://localhost:5173)
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - ESLint로 코드 검사

## 📁 프로젝트 구조

```
ai-photo-studio/
├── public/          # 정적 파일
├── src/            # 소스 코드
│   ├── App.jsx     # 메인 앱 컴포넌트
│   ├── App.css     # 앱 스타일
│   ├── main.jsx    # 앱 진입점
│   └── index.css   # 글로벌 스타일
├── index.html      # HTML 템플릿
├── package.json    # 프로젝트 설정
├── vite.config.js  # Vite 설정
└── README.md       # 프로젝트 문서
```

## ✨ 주요 기능

### 🎯 **AI 사진 변환**
- 📸 **사진 업로드**: 사용자가 원하는 사진을 업로드
- 📺 **보상형 광고**: 광고 시청 후 AI 변환 기능 사용 가능
- 🤖 **AI 변환**: Google Nano Banana AI를 통한 고양이 사진 변환
- 💾 **다운로드**: 변환된 고양이 사진을 다운로드

### 🛠️ **기술적 특징**
- ⚡ Vite의 빠른 HMR (Hot Module Replacement)
- 🎨 TDS Mobile UI 컴포넌트 활용
- 📱 모바일 친화적 반응형 레이아웃
- 🌙 다크/라이트 모드 지원
- 🔧 ESLint를 통한 코드 품질 관리
- 🎯 토스 디자인 시스템 기반 일관된 UI

## 🎨 사용된 TDS Mobile 컴포넌트

- **Button** - 다양한 액션 버튼
- **Modal** - 광고 시청 모달
- **Toast** - 사용자 피드백 알림
- **기타 TDS 컴포넌트들**

더 많은 컴포넌트는 [TDS Mobile 문서](https://tossmini-docs.toss.im/tds-mobile/start/)에서 확인할 수 있습니다.

## 🚀 사용 방법

1. **사진 업로드**: "📸 사진 선택하기" 버튼을 클릭하여 변환하고 싶은 사진을 선택
2. **광고 시청**: "📺 광고 시청하기" 버튼을 클릭하여 보상형 광고 시청
3. **AI 변환**: "🤖 AI 변환 시작" 버튼을 클릭하여 고양이 사진으로 변환
4. **다운로드**: "💾 다운로드" 버튼을 클릭하여 변환된 사진 저장

## 🎯 다음 단계

이 기본 프로젝트를 기반으로 다음과 같은 기능을 추가할 수 있습니다:

- AI 사진 편집 기능
- 이미지 업로드 및 처리
- 사용자 인증 시스템
- 데이터베이스 연동
- API 통합

## 📄 라이선스

MIT License

