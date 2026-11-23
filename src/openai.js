//src/openai.js

import {CATEGORIES, CATEGORY_GENRES} from './constants.js';
import {OPENAI_IMAGE_API_URL, COVER_SETTINGS} from './api.js';

// 화풍
const CATEGORY_MOODS = {
  '에세이': '따뜻하고 개인적인 분위기, 부드럽고 차분한 색감',
  '소설/시': '이야기에 빠져들게 하는 서정적이고 감성적인 분위기',
  '자기계발/커리어': '밝고 긍정적인 분위기, 선명하고 산뜻한 색감',
  '경제/경영': '신뢰감 있고 전문적인 분위기, 절제된 색감',
  '과학/IT': '명료하고 지적인 분위기, 차갑고 선명한 색감',
  '실용/예술/취미': '친근하고 생기 있는 분위기, 밝은 색감',
  '인문/교양': '깊이 있고 사색적인 분위기, 차분하고 깊은 색감',
  '만화/웹툰': '경쾌하고 재미있는 분위기, 또렷한 색감',
  '교육': '친절하고 이해하기 쉬운 분위기, 밝고 깨끗한 색감',
  '사회/역사': '진지하고 무게감 있는 분위기, 가라앉은 색감',
};

// 장르별 그림체
const GENRE_STYLES = {
  // 에세이
  '일상': '따뜻하고 소박한 수채화, 생활 속 사물과 풍경',
  '여행': '탁 트인 풍경의 여행 스케치풍 수채화',
  '감성': '부드러운 빛과 몽환적인 파스텔 톤의 감성 일러스트',
  '인물': '인물의 표정과 분위기를 살린 초상화풍 일러스트',
  // 소설/시
  '일반소설': '사실적인 회화풍, 인물과 장소 중심',
  '로맨스': '부드러운 파스텔 톤의 감성 일러스트',
  '판타지': '신비롭고 웅장한 판타지 일러스트',
  'SF': '미래적인 디지털 아트, 네온과 금속 질감',
  '추리/스릴러': '어둡고 긴장감 있는 영화 포스터풍, 강한 명암 대비',
  '호러': '어둡고 음산한 분위기, 탁한 색과 그림자',
  '무협': '동양화 수묵 담채 느낌',
  '역사소설': '시대감이 느껴지는 고전 회화풍',
  '시': '여백이 많은 서정적인 수채화',
  '희곡': '무대 조명을 받은 연극 포스터풍',
  // 자기계발/커리어
  '자기계발': '밝고 희망적인 미니멀 일러스트, 성장과 도약의 상징',
  '취업': '단정하고 신뢰감 있는 플랫 일러스트, 차분한 파랑 계열',
  '리더십': '힘 있는 구도의 미니멀 그래픽, 앞장서는 인물의 실루엣',
  // 경제/경영
  '경제': '정돈된 인포그래픽풍 일러스트, 그래프와 화폐를 단순한 도형으로 표현',
  '경영': '세련된 비즈니스 그래픽, 차트와 도형 중심의 절제된 색',
  '재테크': '깔끔한 플랫 일러스트, 동전·저금통 같은 소재와 밝은 초록·금색',
  '마케팅': '대담한 색 대비의 팝아트풍 그래픽',
  // 과학/IT
  '과학': '정밀한 과학 일러스트, 우주·분자·자연 현상을 선명하게',
  '프로그래밍': '깔끔한 테크 일러스트, 코드와 기기를 단순한 도형으로 표현',
  'AI': '미래적인 디지털 아트, 신경망과 빛나는 선으로 표현한 추상 이미지',
  '수학': '기하학적 도형과 패턴의 미니멀 추상화',
  // 실용/예술/취미
  '요리': '먹음직스러운 음식 사진풍, 밝은 자연광',
  '여행 안내': '지도와 명소를 담은 밝고 경쾌한 여행 일러스트',
  '미술': '붓 터치가 살아 있는 유화 또는 과슈 느낌',
  '음악': '리듬감 있는 선과 색의 추상 일러스트, 악기 소재',
  '운동': '역동적인 움직임을 살린 스포츠 일러스트, 생기 있는 색',
  // 인문/교양
  '철학': '고전 조각과 여백을 살린 차분한 회화풍',
  '심리': '상징적인 초현실주의 일러스트, 부드럽고 깊은 색',
  '언어': '글자와 말풍선을 도형처럼 배치한 타이포그래피풍 그래픽',
  // 만화/웹툰
  '만화': '선명한 펜 선과 스크린톤의 출판 만화 스타일',
  '웹툰': '밝고 깔끔한 디지털 채색의 웹툰 스타일',
  // 교육
  '어린이': '동글동글하고 귀여운 그림책풍 일러스트, 밝은 원색',
  '청소년': '산뜻하고 활기찬 학원물 일러스트',
  '참고서': '명료하고 정돈된 교과서풍 일러스트, 깔끔한 도형과 아이콘',
  // 사회/역사
  '사회': '다큐멘터리 사진풍, 도시와 사람들의 모습',
  '역사': '시대감이 느껴지는 고전 회화풍 또는 옛 판화 느낌',
  '정치': '무게감 있는 포스터풍 그래픽, 절제된 색과 강한 대비',
};

// 구분이나 장르가 지정되지 않았을 경우
const DEFAULT_STYLE = '책 내용과 분위기에 가장 잘 어울리는 화풍을 직접 골라서 작업해.';

if (import.meta.env?.DEV) {
    const allGenres = Object.values(CATEGORY_GENRES).flat();
    Object.keys(CATEGORY_MOODS)
        .filter((key) => !CATEGORIES.includes(key))
        .forEach((key) => console.warn(`[openai.js] 카테고리에 없는 구분 분위기: ${key}`));
    Object.keys(GENRE_STYLES)
        .filter((key) => !allGenres.includes(key))
        .forEach((key) => console.warn(`[openai.js] 장르에 없는 장르 화풍: ${key}`));
}

// 장르와 구분을 기반으로 화풍과 분위기를 가져오기
export function getCoverStyle(category, genre) {
  return {
    style: GENRE_STYLES[genre] || DEFAULT_STYLE,
    mood: CATEGORY_MOODS[category] || '',
  };
}

// 프롬포트 만들기
export function buildCoverPrompt(book) {
  const { style, mood } = getCoverStyle(book.category, book.genre);

  const lines = [
    '[역할]',
    '너는 책의 성격에 맞는 화풍을 골라 표지를 그리는 북커버 일러스트레이터야.',
    '',
    '[책 정보]',
    `제목: ${book.title}`,
    `저자: ${book.author}`,
  ];

  if (book.category) lines.push(`구분: ${book.category}`);
  if (book.genre) lines.push(`장르: ${book.genre}`);

  lines.push(`내용: ${book.contents}`, '', '[화풍]', style);
  if (mood) lines.push('', '[분위기]', mood);

  lines.push(
    '',
    '[지침]',
    mood
      ? '1. 그림체는 [화풍]을 따르고, 톤과 색감은 [분위기]에 맞춰 세로형 책 표지를 그려줘.'
      : '1. [화풍]에 맞춰 세로형 책 표지를 그려줘.',
    '2. 장면, 소재, 색감은 [책 정보]의 구분·장르·내용에 어울리게 정하고, 정보에 없는 요소는 지어내지 마.',
    '3. 그림이 표지의 중심이 되도록 구성하고, 여백을 충분히 남겨 정돈된 느낌을 줘.',
    '4. 글자는 넣어도 되지만 책 제목과 저자 이름 정도만, 각각 한 번씩 작고 깔끔하게 넣어줘.',
    '5. 같은 문구를 반복하거나, 광고 문구, 홍보 배지, 스티커, 로고, 워터마크, 과한 장식 글씨처럼 광고나 스팸으로 보이는 요소는 넣지 마.'
  );

    return lines.join('\n');
}

// b64 > Data URL 변환 img src, coverImageUrl

export function toDataUrl(b64) {
  return `data:image/${COVER_SETTINGS.output_format};base64,${b64}`;
}

// 서버에서 표지 후보를 생성할 때 사용한다.

export async function generateCovers(apiKey, book) {
  if (!apiKey) {
    throw new Error('API 키가 없어요. API 키를 확인해 주세요.');
  }

  const res = await fetch(OPENAI_IMAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      ...COVER_SETTINGS,
      prompt: buildCoverPrompt(book),
    }),
    signal: AbortSignal.timeout(180_000),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || `표지 생성 실패 (${res.status})`);
  }

  if (!Array.isArray(data?.data)) return [];
  return data.data
    .filter((item) => typeof item?.b64_json === 'string' && item.b64_json.trim())
    .map((item) => toDataUrl(item.b64_json.trim()));
}
