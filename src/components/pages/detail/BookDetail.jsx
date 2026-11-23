
import { useEffect, useState } from 'react';
import { getBook } from '../../../api.js';
import LikeButton from './LikeButton.jsx';
import StarRating from './StarRating.jsx';
import './BookDetail.css';

// 도서 상세 화면 (API-07)
function BookDetail({ bookId, onBack, onEdit, onDelete, onLike, onRate }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setError('');
      setBook(null);
      setRating(0);
      setShowDeleteModal(false);

      try {
        const data = await getBook(bookId);

        if (active) {
          setBook(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (bookId === null || bookId === undefined) {
      setBook(null);
      setError('도서 ID가 없습니다.');
      setLoading(false);
    } else {
      loadBook();
    }

    return () => {
      active = false;
    };
  }, [bookId]);

  const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString('ko-KR');
  };

  // LikeButton에서 전달한 좋아요 상태를 상위 App에 전달
  const handleLike = async (nextLiked) => {
    if (!book || !onLike) return;

    const updatedBook = await onLike(book, nextLiked);

    if (!updatedBook) {
      throw new Error('좋아요 저장 결과가 없습니다.');
    }

    setBook(updatedBook);
  };

  // 별점 선택 및 상위 콜백 호출
  const handleRating = (score) => {
    setRating(score);
    onRate?.(book, score);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.(book.id);
  };

  if (loading) {
    return <div className="detail">도서 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="detail">오류: {error}</div>;
  }

  if (!book) {
    return <div className="detail">도서 정보가 없습니다.</div>;
  }

  return (
    <div className="detail">
      <div className="detail-navigation">
        <span>
          도서 목록 &gt; <strong>{book.title}</strong>
        </span>

        <button
          type="button"
          className="btn detail-outline"
          onClick={onBack}
        >
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
            표지는 등록이나 수정 화면에서 만들어요.
          </p>
        </div>

        <div className="detail-information">
          <h1>{book.title}</h1>
          <p className="book-author">{book.author}</p>

          <div className="detail-meta">
            <span className="detail-tag">{book.category}</span>
            <span className="detail-tag">{book.genre}</span>

            <StarRating
              value={book.review ?? 0}
              count={book.reviewCount ?? 0}
            />
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
            {book.contents || '등록된 내용이 없습니다.'}
          </div>

          <div className="rating-panel">
            <strong>이 책 어땠나요?</strong>

            <StarRating
              value={rating}
              onChange={handleRating}
            />

            <span className="rating-message">
              {rating === 0
                ? '별을 눌러 평가해 주세요'
                : `내 별점 ${rating}점`}
            </span>
          </div>

          <div className="detail-actions">
            <LikeButton
              key={book.id}
              likeCount={book.likeCount ?? 0}
              onLike={handleLike}
            />

            <button
              type="button"
              className="btn detail-outline"
              onClick={() => onEdit?.(book.id)}
            >
              수정
            </button>

            <button
              type="button"
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
          className="detail-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="detail-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="detail-delete-title">
              '{book.title}' 도서를 삭제할까요?
            </h3>
            <p>삭제하면 되돌릴 수 없어요.</p>

            <div className="detail-modal-actions">
              <button
                type="button"
                className="btn detail-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>

              <button
                type="button"
                className="btn detail-delete-confirm"
                onClick={handleDeleteConfirm}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
