
import { useState } from 'react';
import './styles.css';

function BookDetail({ book, onBack, onEdit, onDelete }) {
  const [rating, setRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!book) {
    return <p>도서 정보가 없습니다.</p>;
  }

  const likeCount = (book.likeCount ?? 0) + (liked ? 1 : 0);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString('ko-KR');
  };

  return (
    <main className="book-detail">
      <div className="detail-navigation">
        <span>도서 목록 &gt; <strong>{book.title}</strong></span>
        <button className="btn btn-outline" onClick={onBack}>
          목록으로 돌아가기
        </button>
      </div>

      <div className="detail-layout">
        <div className="cover-column">
          <div className="detail-cover">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={`${book.title} 표지`}
              />
            ) : (
              <span>AI 표지</span>
            )}
          </div>
          <p className="cover-description">
            표지는 등록이나 수정 화면에서 만들어요
          </p>
        </div>

        <div className="detail-information">
          <h1>{book.title}</h1>
          <p className="book-author">{book.author}</p>

          <div className="detail-meta">
            <span className="tag">{book.category}</span>
            <span className="tag">{book.genre}</span>
            <span className="average-rating">
              ★ {book.averageRating ?? '0.0'}
              <span className="rating-count">
                ({book.reviewCount ?? 0}명 참여)
              </span>
            </span>
          </div>

          <div className="date-row">
            <div>
              <span className="date-label">작성일</span>
              <strong>{formatDate(book.createdAt)}</strong>
            </div>
            <div>
              <span className="date-label">수정일</span>
              <strong>{formatDate(book.updatedAt)}</strong>
            </div>
          </div>

          <div className="detail-content">
            {book.contents || book.content || '등록된 내용이 없습니다.'}
          </div>

          <div className="rating-panel">
            <strong>이 책 어땠나요?</strong>

            <div className="rating-stars" aria-label="별점 선택">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= rating ? 'star active' : 'star'}
                  onClick={() => setRating(star)}
                  aria-label={`${star}점`}
                  aria-pressed={rating === star}
                >
                  ★
                </button>
              ))}
            </div>

            <span className="rating-message">
              {rating === 0
                ? '별을 눌러 평가해 주세요'
                : `내 별점 ${rating}점`}
            </span>
          </div>

          <div className="detail-actions">
            <button
              className={`btn btn-like ${liked ? 'liked' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              ♥ 좋아요 {likeCount}
            </button>

            <button className="btn btn-outline" onClick={onEdit}>
              수정
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-title">
              '{book.title}' 도서를 삭제할까요?
            </h3>
            <p>삭제하면 되돌릴 수 없어요.</p>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className="btn btn-danger-fill"
                onClick={() => {
                  setShowDeleteModal(false);
                  onDelete?.();
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BookDetail;
