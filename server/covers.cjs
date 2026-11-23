const { existsSync } = require('node:fs');
const jsonServer = require('json-server');
const { COVER_SETTINGS } = require('../src/api.js');
const { CATEGORIES, CATEGORY_GENRES, LIMITS } = require('../src/constants.js');
const { generateCovers } = require('../src/openai.js');

if (existsSync('.env')) process.loadEnvFile('.env');
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

function trimText(value) {
  return typeof value === 'string' ? value.trim() : '';
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
    const images = await generateCovers(apiKey, book, '수채화');
    if (images.length !== COVER_SETTINGS.n) {
      return res.status(502).json({ error: '표지 후보 두 장을 받지 못했어요.' });
    }
    return res.json({ images });
  } catch {
    return res.status(502).json({ error: '표지 생성에 실패했어요. 잠시 후 다시 시도해 주세요.' });
  }
});

module.exports = covers;
