// 서비스 정보
export const SERVICE_NAME = '작가의 산책';
export const TEAM_NAME = 'KT AIVLE School AI 트랙 미니프로젝트 4차, 3반 9조';
export const GITHUB_URL = 'https://github.com/ha-rameter/book_eating_cat';

// 구분 (상위 분류). 홈 탭은 맨 앞에 종합을 붙여서 사용
export const CATEGORIES = [
  '에세이',
  '소설/시',
  '자기계발/커리어',
  '경제/경영',
  '과학/IT',
  '실용/예술/취미',
  '인문/교양',
  '만화/웹툰',
  '교육',
  '사회/역사',
];

// 구분별 장르 (하위 분류)
// 소설/시는 확정 목록
export const CATEGORY_GENRES = {
  '에세이': ['일상', '여행', '감성', '인물'],
  '소설/시': ['일반소설', '로맨스', '판타지', 'SF', '추리/스릴러', '호러', '무협', '역사소설', '시', '희곡'],
  '자기계발/커리어': ['자기계발', '취업', '리더십'],
  '경제/경영': ['경제', '경영', '재테크', '마케팅'],
  '과학/IT': ['과학', '프로그래밍', 'AI', '수학'],
  '실용/예술/취미': ['요리', '여행 안내', '미술', '음악', '운동'],
  '인문/교양': ['철학', '심리', '언어'],
  '만화/웹툰': ['만화', '웹툰'],
  '교육': ['어린이', '청소년', '참고서'],
  '사회/역사': ['사회', '역사', '정치'],
};

// 입력 제한 (BookForm에서 사용)
export const LIMITS = {
  title: { label: '제목', obj: '제목을', topic: '제목은', min: 1, max: 50 },
  author: { label: '저자', obj: '저자를', topic: '저자는', min: 1, max: 20 },
  contents: { label: '내용', obj: '내용을', topic: '내용은', min: 10, max: 2000 },
};
