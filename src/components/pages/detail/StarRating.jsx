
import { useState } from "react";

// 별점 표시 및 선택 컴포넌트
function StarRating({ value = 0, count, onChange }) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const interactive = typeof onChange === "function";
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
      </div>npm.cmd run server
    );
  }

  // 커서를 올린 위치를 우선 표시하고,
  // 마우스가 벗어나면 선택한 점수를 표시
  const displayScore = hoveredStar || score;

  return (
    <div
      className="stars stars-interactive"
      aria-label="별점 선택"
      onMouseLeave={() => setHoveredStar(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`detail-star ${
            star <= displayScore ? "active" : ""
          }`}
          onMouseEnter={() => setHoveredStar(star)}
          onFocus={() => setHoveredStar(star)}
          onBlur={() => setHoveredStar(0)}
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
