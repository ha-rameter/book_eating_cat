const { existsSync } = require('node:fs');
const jsonServer = require('json-server');
const { OPENAI_IMAGE_API_URL, COVER_SETTINGS } = require('../src/api.js');
const { CATEGORIES, CATEGORY_GENRES, LIMITS } = require('../src/constants.js');

if (existsSync('.env')) process.loadEnvFile('.env');
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

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

function trimText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildCoverPrompt(book) {
  return [
    '세로형 책 표지를 수채화로 그려 주세요.',
    `제목: ${book.title}`,
    book.author && `저자: ${book.author}`,
    book.category && `구분: ${book.category}`,
    book.genre && `장르: ${book.genre}`,
    `내용: ${book.contents}`,
    book.category && `분위기와 색감: ${CATEGORY_MOODS[book.category]}`,
    '장르와 내용에 어울리는 소재와 색감을 사용하고, 여백을 충분히 남겨 주세요.',
    '글자는 제목과 저자만 각각 한 번씩 넣고, 광고 문구와 로고, 워터마크는 빼 주세요.',
  ].filter(Boolean).join('\n');
}

const covers = jsonServer.create();

covers.post('/api/covers', async (req, res) => {
  // 로컬 React 화면에서 보낸 표지 생성 요청을 받는다.
  const origin = req.get('origin');
  if (origin && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)) {
    return res.status(403).json({ error: '로컬 화면에서 표지를 생성해 주세요.' });
  }

  const { title, author, contents, category, genre } = req.body ?? {};
  const bookCategory = CATEGORIES.includes(category) ? category : '';
  const book = {
    title: trimText(title),
    author: trimText(author),
    contents: trimText(contents),
    category: bookCategory,
    genre: (CATEGORY_GENRES[bookCategory] ?? []).includes(genre) ? genre : '',
  };

  // 표지 생성에는 제목과 내용이 필요하고, 저자는 비워도 된다.
  const invalidField = Object.entries(LIMITS).find(([name, { min, max }]) => {
    const length = book[name].length;
    return length > max || (name !== 'author' && length < min);
  });
  if (invalidField) {
    const [, { label }] = invalidField;
    return res.status(400).json({ error: `${label}의 글자 수를 확인해 주세요.` });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({ error: '서버에 OPENAI_API_KEY를 설정해 주세요.' });
  }

  try {
    const response = await fetch(OPENAI_IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ ...COVER_SETTINGS, prompt: buildCoverPrompt(book) }),
      signal: AbortSignal.timeout(180_000),
    });
    if (!response.ok) {
      console.error('OpenAI 표지 생성 요청 실패', response.status);
      throw new Error('표지 생성 요청 실패');
    }

    const { data } = await response.json();
    if (!Array.isArray(data) || data.length !== COVER_SETTINGS.n ||
        data.some((image) => typeof image?.b64_json !== 'string' || !image.b64_json.trim())) {
      return res.status(502).json({ error: '표지 후보 두 장을 받지 못했어요.' });
    }
    const images = data.map(({ b64_json }) => `data:image/${COVER_SETTINGS.output_format};base64,${b64_json}`);
    return res.json({ images });
  } catch {
    return res.status(502).json({ error: '표지 생성에 실패했어요. 잠시 후 다시 시도해 주세요.' });
  }
});

module.exports = covers;
