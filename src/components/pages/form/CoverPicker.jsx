import { useState } from 'react';
import { generateCovers } from '../../../api';
import { LIMITS } from '../../../constants';

// AI 표지: 버튼 하나로 후보 2장 생성 후 1장 선택. gpt-image-2, low, 1024x1536, png, 수채화 고정 (API-13)
function CoverPicker({ book, onSelect }) {
  const [covers, setCovers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const selectedCover = book.coverImageUrl;
  const canGenerate = ['title', 'contents'].every((name) => {
    const { min, max } = LIMITS[name];
    const length = book[name].trim().length;
    return length >= min && length <= max;
  });

  async function handleGenerate() {
    setIsGenerating(true);
    setError('');
    try {
      setCovers(await generateCovers(book));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="cover-panel">
      <h2>AI 표지 (선택)</h2>
      {selectedCover && !covers.includes(selectedCover) && (
        <p><img src={selectedCover} alt="현재 표지" width={96} /></p>
      )}
      <button type="button" className="btn" onClick={handleGenerate} disabled={!canGenerate || isGenerating}>
        {isGenerating ? '표지 만드는 중…' : 'AI 표지 2개 만들기'}
      </button>
      {!canGenerate && <p>제목과 내용을 입력하면 표지를 만들 수 있어요.</p>}
      {error && <p role="alert">{error}</p>}
      <div>
        {covers.map((url, index) => (
          <label key={url}>
            <input
              type="radio"
              name="cover"
              checked={selectedCover === url}
              onChange={() => onSelect(url)}
            />
            <img src={url} alt={`표지 후보 ${index + 1}`} width={96} />
          </label>
        ))}
      </div>
    </div>
  );
}

export default CoverPicker;
