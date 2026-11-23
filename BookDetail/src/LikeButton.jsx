
function LikeButton({
  likeCount = 0,
  liked = false,
  onLike,
  disabled = false
}) {
  return (
    <button
      type="button"
      className={`btn btn-like ${liked ? 'liked' : ''}`}
      onClick={onLike}
      disabled={disabled}
    >
      ♥ 좋아요 {likeCount}
    </button>
  );
}

export default LikeButton;
