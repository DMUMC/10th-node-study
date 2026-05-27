# Week 7 실행 명령어 순서 정리

> 아래 순서대로 실행하세요. 각 단계 완료 후 다음 단계로 진행합니다.

---

## 1단계. 프로젝트 디렉토리 이동

```bash
cd <your-project-folder>
```

> week6 코드가 있는 프로젝트 루트 폴더로 이동합니다.

---

## 2단계. 필수 미들웨어 패키지 설치

```bash
npm install morgan cookie-parser
```

---

## 3단계. 설치 확인

```bash
cat package.json
```

> `dependencies`에 `morgan`과 `cookie-parser`가 추가되었는지 확인합니다.

---

## 4단계. Git 초기화 및 원격 저장소 연결

> GitHub에서 새 레포지토리를 먼저 만든 후 실행합니다.

```bash
git init
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

---

## 5단계. 작업 브랜치 생성 및 이동

```bash
git checkout -b feature/chapter-07
```

> **주의:** `main` 브랜치에는 절대 push하지 않습니다. (Week 11 CI/CD 전용)

---

## 6단계. 코드 작성 후 스테이징

> `index.js`, `BaseResponse`, `BaseError`, `errorCode.js` 등 수정/생성 후 실행

```bash
git add .
```

---

## 7단계. 커밋

```bash
git commit -m "feat: add middleware, standard response, and error handling"
```

---

## 8단계. feature 브랜치에 push

```bash
git push origin feature/chapter-07
```

---

## (선택) Prisma 관련 명령어

### 스키마 변경 후 마이그레이션 실행

```bash
npx prisma migrate dev --name <migration-name>
```

### DB 상태와 스키마 동기화 확인

```bash
npx prisma db pull
```

### Prisma Studio (GUI로 DB 확인)

```bash
npx prisma studio
```

---

## 전체 순서 요약

| 순서 | 명령어 | 설명 |
|---|---|---|
| 1 | `cd <project>` | 프로젝트 폴더 이동 |
| 2 | `npm install morgan cookie-parser` | 미들웨어 설치 |
| 3 | `cat package.json` | 설치 확인 |
| 4 | `git init` | Git 초기화 |
| 5 | `git remote add origin <url>` | 원격 저장소 연결 |
| 6 | `git checkout -b feature/chapter-07` | 작업 브랜치 생성 |
| 7 | `git add .` | 변경 파일 스테이징 |
| 8 | `git commit -m "..."` | 커밋 |
| 9 | `git push origin feature/chapter-07` | 브랜치에 push |
