# 북커버 AI 도서관 (book_eating_cat)

도서를 등록하면 OpenAI 이미지 모델이 내용에 맞는 표지 후보 2장을 그려 주고, 그중 1장을 골라 저장하는 도서관리 시스템입니다.

## 실행 방법

```bash
npm install

# 터미널 1: json-server (http://localhost:3000/books)
npm run server

# 터미널 2: React (http://localhost:5173)
npm run dev
```

## OpenAI API Key

`.env.example`을 복사해 `.env.local`로 이름을 바꾸고 `VITE_OPENAI_API_KEY=` 뒤에 조별 키를 넣습니다. `.env.local`은 GitHub에 올라가지 않습니다.

## 폴더 구조

```
src/
├── App.jsx                  화면 전환, 알림, 처리 함수
├── App.css                  색 변수와 공통 규칙
├── api.js                   API 주소, fetch 함수 (API 설계서 번호)
├── constants.js             구분과 장르 목록, 입력 제한, 서비스 정보
└── components/
    ├── layout/              Header, HamburgerMenu, Footer
    ├── common/              ConfirmModal (삭제, 등록, 수정 확인 공용)
    └── pages/
        ├── main/            HomePage, SearchBar, CategoryFilter, SearchResult,
        │                    PopularBooks, PopBookCard, BookList, BookCard, StateBox
        ├── detail/          BookDetail, LikeButton, StarRating
        └── form/            BookForm, CoverPicker
```

## 작업 방법

- main 브랜치에서 각자 브랜치를 만들어 맡은 컴포넌트를 채웁니다.
- 컴포넌트 이름과 props는 컴포넌트 설계서와 맞춰 두었습니다. 바꿀 때는 조원에게 먼저 알립니다.
- 색은 App.css의 변수(var(--primary) 등)를 씁니다.
