
// 별점 표시 및 선택 컴포넌트
function StarRating({ value = 0, count, onChange }) {
  const interactive = typeof onChange === 'function';
  const score = Number(value) || 0;

  if (!interactive) {
    return (
      <div className="stars stars-readonly">
        <span className="stars-symbol">★</span>
        <strong>{score.toFixed(1)}</strong>
        {count !== undefined && (
          <span className="stars-count">
            ({count}명 참여)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="stars stars-interactive" aria-label="별점 선택">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`detail-star ${star <= score ? 'active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`${star}점`}
          aria-pressed={score === star}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
