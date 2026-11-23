
import { useState } from 'react';

// 좋아요 버튼 (API-10)
function LikeButton({ likeCount, onLike }) {
  const [liked, setLiked] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleClick = async (event) => {
    event.stopPropagation();

    if (saving || !onLike) return;

    const nextLiked = !liked;
    setSaving(true);

    try {
      await onLike(nextLiked);
      setLiked(nextLiked);
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
    </div>
  );
}

export default LikeButton;
