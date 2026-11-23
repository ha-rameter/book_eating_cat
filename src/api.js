// API 주소 상수
export const API_URL = "http://localhost:3000/books";
export const OPENAI_IMAGE_API_URL =
  "https://api.openai.com/v1/images/generations";

// 표지 생성 고정 설정 (화면에서 고르지 않음)
export const COVER_SETTINGS = {
  model: "gpt-image-2",
  n: 2,
  size: "1024x1536",
  quality: "low",
  output_format: "png",
};

// 아래 함수는 API 설계서 번호대로 채우기
// fetch는 404, 500에도 에러를 던지지 않으니 res.ok 확인 후 throw

// API-01 인기 도서 10권

export async function getPopularBooks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("인기 도서를 불러오지 못했습니다.");
  }

  const books = await response.json();

  return books
    .sort((a, b) => {
      if (b.likeCount !== a.likeCount) {
        return b.likeCount - a.likeCount;
      }

      if (b.review !== a.review) {
        return b.review - a.review;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 10);
}


// API-02, 05, 06 최신 등록순 5권씩 (구분, 장르 조건), X-Total-Count로 전체 권수
export async function getLatestBooks(page, category, genre) {}

// API-03, 04 제목 또는 저자 검색
export async function searchBooks(type, keyword) {}

// API-07 상세
export async function getBook(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("도서 정보를 불러오지 못했습니다.");
  }

  return await response.json();
}

// API-08 등록
export async function createBook(book) {}

// API-09 수정, API-10 좋아요, API-15 별점 주기 (바뀐 필드만 PATCH)
export async function updateBook(id, changes) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  if (!res.ok) {
    throw new Error("도서 정보 수정에 실패했습니다.");
  }

  return await res.json();
}

// API-11 삭제
export async function deleteBook(id) {}

// API-13 표지 후보 2장 생성, Data URL 배열로 돌려주기
export async function generateCovers(book) {
  const { title, author, contents, category, genre } = book;
  const response = await fetch(new URL("/api/covers", API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, contents, category, genre }),
  }).catch(() => {
    throw new Error(
      "표지 서버에 연결할 수 없어요. 서버가 실행 중인지 확인해 주세요.",
    );
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "표지 생성에 실패했어요.");
  }
  if (!Array.isArray(data?.images) || data.images.length !== COVER_SETTINGS.n) {
    throw new Error("표지 후보 두 장을 받지 못했어요.");
  }
  return data.images;
}
