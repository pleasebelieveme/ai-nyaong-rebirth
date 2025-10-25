/**
 * AI Photo Studio - Backend API
 *
 * Google Gemini AI를 사용하여 일반 사진을 전문가 프로필 사진으로 변환하는 서비스입니다.
 *
 * 주요 기능:
 * - 이미지 업로드 (multipart/form-data)
 * - Gemini AI를 통한 이미지 변환
 * - CORS 설정
 * - 에러 처리
 */

const express = require('express');
const cors = require('cors');
const Busboy = require('busboy');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// ============================================
// 상수 정의
// ============================================

/** 업로드 가능한 최대 파일 크기 (10MB) */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** 허용되는 이미지 MIME 타입 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
]);

/** Busboy 파일 파싱 제한 */
const BUSBOY_LIMITS = {
  fileSize: MAX_FILE_SIZE_BYTES,  // 파일 크기 제한
  files: 1,                        // 한 번에 1개 파일만
  fields: 20,                      // 최대 폼 필드 수
  parts: 25,                       // 최대 파트 수
};

/** Gemini AI 이미지 생성 설정 */
const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash-image',
  aspectRatio: '3:4',              // 세로형 프로필 사진
};

/** AI 프롬프트: 프로필 사진 생성 지침 */
const PROFILE_PROMPT = `A photorealistic and artistically stylized portrait of a domestic cat that visually represents the same personality, fashion, and mood as the human in the uploaded photo.
The cat’s appearance should reflect the human’s hairstyle, facial proportions, and clothing style, reinterpreted naturally into feline form.
The image captures a close-up portrait in soft natural lighting, with realistic fur textures and expressive, intelligent eyes.
The background is minimalist and softly colored, complementing the subject’s tone and personality.
The composition feels like a high-quality street photography portrait, blending realism and artistic warmth — resembling a fine art photograph or magazine-style photo of a fashionable cat version of the person.
Emphasize facial expression, light, and atmosphere rather than literal mimicry.
Style reference: realistic photography with artistic color grading, gentle contrast, and slightly cinematic mood.
medium-length fur or short-haired cat, depending on what best fits the subject’s vibe.`;

// ============================================
// 커스텀 에러 클래스
// ============================================

/**
 * HTTP 상태 코드를 포함하는 에러 클래스
 * Express 에러 핸들러에서 적절한 HTTP 응답을 반환하기 위해 사용
 */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

// ============================================
// CORS 설정
// ============================================

/**
 * 허용할 Origin 목록을 반환합니다.
 * - 프로덕션: 토스 앱 도메인
 * - 개발: localhost
 */
function getAllowedOrigins() {
  return [
    'https://ai-nyaong-rebirth.apps.tossmini.com',
    'https://ai-nyaong-rebirth.private-apps.tossmini.com',
    'https://172.1.1.1:5173' // 로컬 테스트용
  ];
}

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

// ============================================
// AI 이미지 생성 함수
// ============================================

/**
 * Gemini AI를 사용하여 프로필 이미지를 생성합니다.
 *
 * @param {Buffer} imageBuffer - 업로드된 이미지 데이터
 * @returns {Promise<string>} Data URI 형식의 생성된 이미지
 *
 * 동작 과정:
 * 1. Gemini API 초기화
 * 2. 프롬프트와 이미지를 함께 전송
 * 3. 스트리밍 응답에서 생성된 이미지 추출
 * 4. Base64 인코딩하여 Data URI로 반환
 */
async function generateProfile(imageBuffer) {
  // 1. API 키 확인
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('FATAL: GEMINI_API_KEY is not configured');
    throw new Error('GEMINI_API_KEY not configured');
  }

  // 2. Gemini AI 클라이언트 초기화
  const ai = new GoogleGenAI({
    apiKey,
  });

  // 3. 요청 데이터 구성
  const contents = [
    {
      role: 'user',
      parts: [
        { text: PROFILE_PROMPT },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBuffer.toString('base64'),
          },
        },
      ],
    },
  ];

  const config = {
    responseModalities: ['IMAGE'],
    imageConfig: {
      aspectRatio: GEMINI_CONFIG.aspectRatio,
    },
  };

  // 4. AI 이미지 생성 요청 (스트리밍)
  const response = await ai.models.generateContentStream({
    model: GEMINI_CONFIG.model,
    config,
    contents,
  });

  // 5. 스트리밍 응답에서 이미지 추출
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content) {
      continue;
    }

    const parts = chunk.candidates[0].content.parts || [];

    if (parts[0] && parts[0].inlineData) {
      const inlineData = parts[0].inlineData;
      const buffer = Buffer.from(inlineData.data || '', 'base64');
      const mimeType = inlineData.mimeType || 'image/jpeg';
      const b64Data = buffer.toString('base64');

      return `data:${mimeType};base64,${b64Data}`;
    }
  }

  throw new Error('No image generated');
}

// ============================================
// 이미지 업로드 처리 함수
// ============================================

/**
 * multipart/form-data 요청에서 이미지 파일을 추출합니다.
 *
 * @param {Request} req - Express 요청 객체
 * @returns {Promise<Buffer|null>} 이미지 버퍼 또는 null
 *
 * Busboy를 사용한 이유:
 * - Express의 기본 body parser는 multipart/form-data를 지원하지 않음
 * - Busboy는 스트리밍 방식으로 대용량 파일도 효율적으로 처리
 * - 파일 크기 제한, MIME 타입 검증 등 세밀한 제어 가능
 */
function receiveImage(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: BUSBOY_LIMITS,
    });

    let fileBuffer = null;
    let hasFile = false;

    // 파일 업로드 이벤트
    busboy.on('file', (_fieldname, file, fileInfo) => {
      hasFile = true;

      // MIME 타입 검증
      const mimeType = fileInfo.mimeType || fileInfo.mime || 'application/octet-stream';

      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        file.resume(); // 스트림 버리기
        reject(new HttpError(415, 'Unsupported file type. Please upload a JPEG, PNG, or WEBP image.'));
        return;
      }

      // 파일 데이터 수집
      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // 파일 크기 초과 시
      file.on('limit', () => {
        file.resume();
        reject(new HttpError(413, 'File too large. Maximum allowed size is 10MB.'));
      });

      // 파일 읽기 완료
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    // 폼 필드 크기 초과
    busboy.on('field', (_name, _val, info) => {
      if (info && info.truncated) {
        reject(new HttpError(413, 'Form field too large.'));
      }
    });

    // 에러 처리
    busboy.on('error', (error) => {
      if (error.message === 'Unexpected end of form') {
        reject(new HttpError(400, 'Upload was interrupted. Please try again.'));
      } else {
        reject(error);
      }
    });

    // 제한 초과 이벤트
    busboy.on('partsLimit', () => {
      reject(new HttpError(413, 'Too many form parts.'));
    });

    busboy.on('filesLimit', () => {
      reject(new HttpError(413, 'Only one image can be uploaded at a time.'));
    });

    busboy.on('fieldsLimit', () => {
      reject(new HttpError(413, 'Too many form fields.'));
    });

    // 파싱 완료
    busboy.on('finish', () => {
      if (!hasFile || !fileBuffer || fileBuffer.length === 0) {
        resolve(null);
        return;
      }

      resolve(fileBuffer);
    });

    // 요청 바디를 Busboy로 파이핑
    try {
      if (req.rawBody instanceof Buffer) {
        busboy.end(req.rawBody);
      } else if (typeof req.rawBody === 'string') {
        busboy.end(Buffer.from(req.rawBody));
      } else {
        req.pipe(busboy);
      }
    } catch (error) {
      reject(error);
    }
  });
}

// ============================================
// API 엔드포인트
// ============================================

/**
 * POST /api/generate
 * 이미지를 업로드하고 AI 프로필 사진을 생성합니다.
 *
 * 요청:
 * - Content-Type: multipart/form-data
 * - Body: image (파일)
 *
 * 응답:
 * - 성공: { success: true, imageUrl: "data:image/jpeg;base64,..." }
 * - 실패: { success: false, error: "에러 메시지" }
 */
app.post('/api/generate', async (req, res) => {
  try {
    // 1. Content-Type 검증
    const contentType = req.headers['content-type'] || '';

    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      throw new HttpError(400, 'Content-Type must be multipart/form-data.');
    }

    // 2. 이미지 파일 추출
    const fileBuffer = await receiveImage(req);

    if (!fileBuffer) {
      throw new HttpError(400, 'No image provided');
    }

    // 3. AI 프로필 생성
    const imageUrl = await generateProfile(fileBuffer);

    // 4. 성공 응답
    res.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    // 5. 에러 로깅
    console.error('Generation error:', {
      message: error && error.message,
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
    });

    // 6. 에러 응답
    const status = error instanceof HttpError && typeof error.status === 'number'
      ? error.status
      : 500;

    res.status(status).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /health
 * 서버 상태 확인용 헬스 체크 엔드포인트
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// 전역 에러 핸들러
// ============================================

/**
 * Express 전역 에러 핸들러
 * 라우트에서 처리되지 않은 에러를 처리합니다.
 */
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    success: false,
    error: err instanceof Error ? err.message : 'Unknown error',
  });
});

// ============================================
// Export
// ============================================

// Google Cloud Functions용
module.exports.helloHttp = app;

// 로컬 개발 또는 다른 환경용
module.exports.app = app;