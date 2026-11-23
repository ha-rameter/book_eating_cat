
import { useState } from 'react';

// 좋아요 버튼 (API-10)
function LikeButton({ likeCount, onLike }) {
  const [liked, setLiked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [effectId, setEffectId] = useState(0);

  const handleClick = async (event) => {
    event.stopPropagation();

    if (saving || !onLike) return;

    const nextLiked = !liked;
    setSaving(true);

    try {
      await onLike(nextLiked);
      setLiked(nextLiked);

      // 좋아요 저장 성공 시에만 애니메이션
      if (nextLiked) {
        setEffectId((prev) => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 저장 오류:', err);
      alert('좋아요 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="like-btn">
      <button
        type="button"
        className={`btn detail-like-button ${liked ? 'liked' : ''}`}
        onClick={handleClick}
        disabled={saving || !onLike}
        aria-pressed={liked}
      >
        ♥ 좋아요 {likeCount ?? 0}
      </button>

      {liked && effectId > 0 && (
        <span
          key={effectId}
          className="like-pop-effect"
          aria-hidden="true"
        >
          <span className="like-pop-thumb">❤️</span>
          <span className="like-pop-spark like-pop-spark-1">✦</span>
          <span className="like-pop-spark like-pop-spark-2">✦</span>
          <span className="like-pop-spark like-pop-spark-3">✦</span>
        </span>
      )}
    </div>
  );
}

export default LikeButton;
