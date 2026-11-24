import { useState, useEffect } from 'react';
import { generateCovers } from '../../../api';
import { LIMITS } from '../../../constants';

// AI 표지: 버튼 하나로 후보 2장 생성 후 1장 선택. gpt-image-2, low, 1024x1536, png, 장르별 화풍 (API-13)
const WAIT_MESSAGES = ['작가가 붓을 고르고 있어요', '밑그림을 그리는 중이에요', '물감이 마르는 중이에요', '마지막 한 획을 더하고 있어요'];

function CoverPicker({ book, onSelect }) {
  const [covers, setCovers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [waitIndex, setWaitIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    setWaitIndex(0);
    const timer = setInterval(() => {
      setWaitIndex((index) => (index + 1) % WAIT_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isGenerating]);
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
    <div className="book-form-cover-panel">
      <h2>AI 표지 <span className="book-form-optional">(선택)</span></h2>
      {selectedCover && !covers.includes(selectedCover) && (
        <p className="book-form-current-cover">
          <img src={selectedCover} alt="현재 표지" />
          <span aria-hidden="true">현재 표지</span>
        </p>
      )}
      <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={!canGenerate || isGenerating}>
        {isGenerating ? `${WAIT_MESSAGES[waitIndex]}...` : 'AI 표지 2개 만들기'}
      </button>
      {!canGenerate && <p className="book-form-cover-hint">제목과 내용을 입력하면 표지를 만들 수 있어요.</p>}
      {error && <p className="book-form-error" role="alert">{error}</p>}
      <div className="book-form-cover-choices">
        {covers.map((url, index) => (
          <label key={url} className="book-form-cover-choice" data-selected={selectedCover === url}>
            <img src={url} alt="" />
            <span className="book-form-choice-label">
              <input
                type="radio"
                name="cover"
                checked={selectedCover === url}
                onChange={() => onSelect(url)}
              />
              표지 후보 {index + 1}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default CoverPicker;
