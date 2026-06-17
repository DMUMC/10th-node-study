# Week 7 워크북 - 미들웨어, 표준 응답/에러 처리, Git 전략

> **프로젝트 참조:** week6_directory_contents 기반으로 week7 리팩토링

---

## Step 1. 필수 미들웨어 설치 및 설정

### 설치 패키지

```bash
npm install morgan cookie-parser
```

### `index.js` 적용 예시

```js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// 요청 로깅 미들웨어
app.use(morgan('dev'));

// 쿠키 파싱 미들웨어
app.use(cookieParser());

// JSON 및 URL-encoded body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### 미들웨어 역할 설명

| 미들웨어 | 역할 |
|---|---|
| `morgan('dev')` | HTTP 요청/응답 로그를 터미널에 출력 (개발 환경용) |
| `cookieParser()` | `req.cookies` 객체로 쿠키 값 파싱 |
| `express.json()` | `Content-Type: application/json` 요청 바디 파싱 |
| `express.urlencoded()` | HTML form 데이터 파싱 |

---

## Step 2. 표준 API 성공 응답 형식 통일

### 응답 형식 정의

모든 API의 성공 응답은 아래 구조를 따릅니다:

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "성공입니다.",
  "result": { }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `isSuccess` | boolean | 요청 성공 여부 |
| `code` | string | 응답 코드 (예: `COMMON200`, `USER404`) |
| `message` | string | 사람이 읽을 수 있는 메시지 |
| `result` | object \| array | 실제 데이터 |

### BaseResponse 유틸리티 구현 예시

```js
// src/utils/response.js

const BaseResponse = (result, message = '성공입니다.', code = 'COMMON200') => {
  return {
    isSuccess: true,
    code,
    message,
    result,
  };
};

module.exports = { BaseResponse };
```

### 컨트롤러에서 사용

```js
const { BaseResponse } = require('../utils/response');

// Before (기존 방식)
res.status(200).json(user);

// After (표준 응답 적용)
res.status(200).json(BaseResponse(user));
```

---

## Step 3. 중앙 집중식 커스텀 에러 처리

### BaseError 클래스 정의

```js
// src/utils/errors.js

class BaseError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'BaseError';
    this.status = statusCode;
    this.code = code;
  }
}

module.exports = { BaseError };
```

### 에러 코드 상수 예시

```js
// src/utils/errorCode.js

const ErrorCode = {
  USER_NOT_FOUND: { status: 404, code: 'USER4001', message: '사용자를 찾을 수 없습니다.' },
  DUPLICATE_EMAIL: { status: 409, code: 'USER4002', message: '이미 사용 중인 이메일입니다.' },
  INTERNAL_ERROR: { status: 500, code: 'COMMON500', message: '서버 내부 오류입니다.' },
};

module.exports = { ErrorCode };
```

### 글로벌 에러 핸들러 미들웨어 (`index.js` 하단에 추가)

```js
// 글로벌 에러 핸들러 - 반드시 다른 app.use() 아래에 위치해야 함
app.use((err, req, res, next) => {
  if (err instanceof BaseError) {
    return res.status(err.status).json({
      isSuccess: false,
      code: err.code,
      message: err.message,
      result: null,
    });
  }

  // Prisma unique constraint 에러 처리
  if (err.code === 'P2002') {
    return res.status(409).json({
      isSuccess: false,
      code: 'USER4002',
      message: '이미 존재하는 데이터입니다.',
      result: null,
    });
  }

  console.error(err);
  return res.status(500).json({
    isSuccess: false,
    code: 'COMMON500',
    message: '서버 내부 오류입니다.',
    result: null,
  });
});
```

### 컨트롤러에서 에러 던지기

```js
const { BaseError } = require('../utils/errors');
const { ErrorCode } = require('../utils/errorCode');

// Before (기존 방식)
res.status(404).send('User Not Found');

// After (next()로 에러 위임)
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
  return next(new BaseError(
    ErrorCode.USER_NOT_FOUND.message,
    ErrorCode.USER_NOT_FOUND.status,
    ErrorCode.USER_NOT_FOUND.code
  ));
}
```

---

## Step 4. GitHub 브랜치 전략

### 브랜치 규칙

| 브랜치 | 용도 |
|---|---|
| `main` | Week 11 CI/CD 파이프라인 전용 — **직접 push 금지** |
| `feature/chapter-07` | Week 7 작업 브랜치 |

### 주의사항

> `main` 브랜치는 Week 11 CI/CD 설정을 위해 보호되어 있습니다.  
> 모든 코드는 반드시 `feature/chapter-07` 브랜치에 push 하세요.

---

## Step 5. Prisma ORM vs Raw SQL (mysql2) 비교 분석

### 비교표

| 항목 | Prisma ORM | Raw SQL (mysql2) |
|---|---|---|
| **문법** | TypeScript 기반 타입 안전 API | 직접 SQL 문자열 작성 |
| **가독성** | 높음 (직관적 메서드 체이닝) | 낮음 (SQL 숙련도 필요) |
| **타입 안전성** | 자동 타입 추론 지원 | 없음 (직접 캐스팅 필요) |
| **성능 튜닝** | 제한적 | 완전한 SQL 제어 가능 |
| **마이그레이션** | `prisma migrate dev` 자동화 | 수동 관리 |
| **학습 비용** | Prisma 문법 학습 필요 | SQL 지식만 있으면 됨 |
| **복잡 쿼리** | 한계 있음 (rawQuery 혼용) | 무제한 |

---

### `prisma migrate dev` 장단점 분석

#### 장점

- **자동 마이그레이션 파일 생성:** `schema.prisma` 변경 사항을 감지해 SQL 파일 자동 생성
- **히스토리 관리:** `prisma/migrations/` 폴더에 변경 이력 누적 보관
- **개발 편의성:** 스키마 → DB 동기화를 명령어 한 줄로 처리
- **Seed 연동:** `prisma db seed`와 연계하여 초기 데이터 삽입 가능

#### 단점

- **팀 협업 시 충돌 위험:** 여러 사람이 `schema.prisma`를 동시에 수정하면 migration 충돌 발생
- **프로덕션 부적합:** 운영 환경에서는 `prisma migrate deploy` 사용 권장 (`dev`는 개발 전용)
- **자동화의 불투명성:** 생성된 SQL을 검토하지 않으면 의도치 않은 데이터 손실 위험

---

### 협업 시 Migration 충돌 방지 전략

1. **스키마 담당자 단일화:** `schema.prisma` 수정은 한 명이 담당하거나 PR 리뷰를 필수로 설정
2. **브랜치 전략 준수:** 기능 브랜치에서 스키마 수정 후 PR 머지 순서 지키기
3. **migration 파일 커밋 필수:** `prisma/migrations/` 폴더를 `.gitignore`에 추가하지 말고 항상 커밋
4. **머지 전 `prisma migrate dev` 재실행:** 머지 후 로컬에서 반드시 재실행하여 동기화 확인
5. **팀 내 DB 상태 공유:** 마이그레이션 실행 여부를 팀 채널(슬랙 등)에 공유

---

### 개인 선호도: Prisma vs mysql2

**선택: Prisma ORM**

**이유:**

- TypeScript 환경에서 타입 자동 완성과 컴파일 타임 에러 검출이 가능해 런타임 버그 감소
- 복잡한 JOIN보다 단순 CRUD 위주인 현재 프로젝트 규모에 충분
- 마이그레이션 자동화로 팀 전체의 DB 상태를 일관되게 유지 가능
- `prisma studio`를 통한 GUI 데이터 확인이 개발 생산성을 높임

**mysql2가 더 적합한 경우:**

- 복잡한 집계 쿼리나 서브쿼리가 많은 서비스
- 극도의 성능 최적화가 필요한 대규모 트래픽 환경

---

## 디렉토리 구조 제안

```
project/
├── index.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── utils/
│       ├── response.js      ← BaseResponse
│       ├── errors.js        ← BaseError
│       └── errorCode.js     ← 에러 코드 상수
└── package.json
```
