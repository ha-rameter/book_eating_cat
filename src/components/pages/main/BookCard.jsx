import LikeButton from '../detail/LikeButton';

function highlight(title, keyword) {
  if (!keyword) return title;
  const index = title.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <mark>{title.slice(index, index + keyword.length)}</mark>
      {title.slice(index + keyword.length)}
    </>
  );
}

function BookCard({ book, rank, keyword, onSelect, onLike }) {
  const createdAt =
    book.createdAt && !Number.isNaN(Date.parse(book.createdAt))
      ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(book.createdAt))
      : "날짜 없음";

  return (
    <article className="book-card">
      <button
        className="book-card-main"
        type="button"
        onClick={() => onSelect(book.id)}
      >
        <span className="book-card-cover">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={`${book.title} 표지`}
              loading="lazy"
            />
          ) : (
            <span className="book-card-no-cover">표지 없음</span>
          )}
          {rank != null && <span className="book-card-rank">{rank}위</span>}
          {book.contents && (
            <span className="book-card-overlay" aria-hidden="true">
              <span className="book-card-overlay-meta">
                <span>{[book.category, book.genre].filter(Boolean).join(" > ") || "미분류"}</span>
                <span>♥ {book.likeCount || 0}</span>
              </span>
              <span className="book-card-overlay-text">{book.contents}</span>
            </span>
          )}
        </span>
        <span className="book-card-content">
          <strong className="book-card-title">
            {keyword && book.title.includes(keyword) ? (
              <>
                {book.title.split(keyword)[0]}
                <mark>{keyword}</mark>
                {book.title.slice(book.title.indexOf(keyword) + keyword.length)}
              </>
            ) : (
              book.title
            )}
          </strong>
          <span className="book-card-author"><em>by</em> {book.author}</span>
          <span className="book-card-meta">
            {[book.category, book.genre].filter(Boolean).join(", ") || "미분류"}
          </span>
          <span className="book-card-stats">
            <span className="book-card-rating">
              <span aria-hidden="true">★</span>{" "}
              {Number(book.review || 0).toFixed(1)} ({book.reviewCount || 0})
            </span>
            {rank != null && (
              <span className="book-card-likes">
                <span aria-hidden="true">♥</span> {book.likeCount || 0}
              </span>
            )}
          </span>
          <span className="book-card-date">등록일 {createdAt}</span>
        </span>
      </button>
      {onLike && (
        <div className="book-card-like-slot">
          <LikeButton likeCount={book.likeCount || 0} onLike={(liked) => onLike(book, liked)} />
        </div>
      )}
    </article>
  );
}

export default BookCard;