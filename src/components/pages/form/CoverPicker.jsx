import { useState } from 'react';

// 표지 선택 화면을 확인하기 위한 샘플 PNG 두 장.
const SAMPLE_COVERS = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAkAgMAAADuoRK9AAAADFBMVEUhODvuzYxjhoAyT0idsN7lAAAAY0lEQVR42mNgIAIwwhkBQEKAgTUEzBMNxUJB5ATAKoFAAUKtAJNMq8AU16oGEKW1agGIWrVqBVhq1SqwFIji0QJT9qtA1Kr/r0DU6v+/QNT6//9A1P7//0HU//8gSRAFBCRTAMm0WZJ7tlAqAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAkAgMAAADuoRK9AAAADFBMVEXt0LTGX1Wbd3FlWVz1z0R/AAAAYUlEQVR42mNgIAMwBoAp0VAwFRrqgKAYQ0MDMCgUJUwQfVwNYFO0FoDNWLUCRDKtWgWiuFatagBJrVoFkly1atUKAzC16g+YWv1/FYha//8ViNr//xeI+v//H8N/MCCeAgAqWlLy3YtB+QAAAABJRU5ErkJggg==',
];

// AI 표지: 버튼 하나로 후보 2장 생성 후 1장 선택. gpt-image-2, low, 1024x1536, png, 수채화 고정 (API-13)
function CoverPicker({ book, onSelect }) {
  const [covers, setCovers] = useState([]);
  const selectedCover = book.coverImageUrl;

  return (
    <div className="cover-panel">
      <h2>AI 표지 (선택)</h2>
      {selectedCover && !covers.includes(selectedCover) && (
        <p><img src={selectedCover} alt="현재 표지" width={96} /></p>
      )}
      <button type="button" className="btn" onClick={() => setCovers(SAMPLE_COVERS)}>
        샘플 표지 2장 보기
      </button>
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
