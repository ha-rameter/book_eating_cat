
import { useState, useEffect } from 'react';
import LikeButton from './LikeButton.jsx';
import './styles.css';

const API_URL = 'http://localhost:3000';

function BookDetail({
  bookId,
  onBack,
  onEdit,
  onDelete,
  onLike,
  onRate,
  onSaveCover
}) {
  // 도서 정보 State
  const [book, setBook] = useState(null);

  // 조회 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI 상태
  const [rating, setRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeSaving, setLikeSaving] = useState(false);

  // bookId가 변경되면 도서 상세 정보 조회
  useEffect(() => {
    const controller = new AbortController();

    async function loadBook() {
      setLoading(true);
      setError('');
      setBook(null);

      // 다른 책을 선택하면 UI 상태 초기화
      setRating(0);
      setLiked(false);
      setShowDeleteModal(false);

      try {
        const response = await fetch(
          `${API_URL}/books/${bookId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('도서 정보를 불러오지 못했습니다.');
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setBook(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (bookId === undefined || bookId === null) {
      setBook(null);
      setError('도서 ID가 없습니다.');
      setLoading(false);
    } else {
      loadBook();
    }

    return () => controller.abort();
  }, [bookId]);

  // 날짜 표시 함수
  const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString('ko-KR');
  };


const handleLikeClick = async () => {
  if (!book || likeSaving || !onLike) return;

  const nextLiked = !liked;

  setLikeSaving(true);

  try {
    // App.jsx의 handleLike(book, liked) 호출
    const updatedBook = await onLike(book, nextLiked);

    // 서버에서 반환한 데이터를 State에 반영
    setBook(updatedBook);
    setLiked(nextLiked);

    console.log('좋아요 반영 완료:', updatedBook.likeCount);
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    alert('좋아요 저장에 실패했습니다.');
  } finally {
    setLikeSaving(false);
  }
};


  // 로딩 및 오류 처리
  if (loading) {
    return <p>도서 정보를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>오류: {error}</p>;
  }

  if (!book) {
    return <p>도서 정보가 없습니다.</p>;
  }

  // 현재 좋아요 수 (임시 UI State)
  const likeCount = book.likeCount ?? 0;

  return (
    <main className="book-detail">
      <div className="detail-navigation">
        <span>
          도서 목록 &gt; <strong>{book.title}</strong>
        </span>

        <button
          className="btn btn-outline"
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
            표지는 등록이나 수정 화면에서 만들어요
          </p>
        </div>

        <div className="detail-information">
          <h1>{book.title}</h1>

          <p className="book-author">
            {book.author}
          </p>

          <div className="detail-meta">
            <span className="tag">
              {book.category}
            </span>

            <span className="tag">
              {book.genre}
            </span>

            <span className="average-rating">
              ★ {book.averageRating ?? '0.0'}

              <span className="rating-count">
                ({book.reviewCount ?? 0}명 참여)
              </span>
            </span>
          </div>

          <div className="date-row">
            <div>
              <span className="date-label">
                작성일
              </span>

              <strong>
                {formatDate(book.createdAt)}
              </strong>
            </div>

            <div>
              <span className="date-label">
                수정일
              </span>

              <strong>
                {formatDate(book.updatedAt)}
              </strong>
            </div>
          </div>

          <div className="detail-content">
            {book.contents ||
              book.content ||
              '등록된 내용이 없습니다.'}
          </div>

          <div className="rating-panel">
            <strong>이 책 어땠나요?</strong>

            <div
              className="rating-stars"
              aria-label="별점 선택"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? 'star active'
                      : 'star'
                  }
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
            <LikeButton
              likeCount={likeCount}
              liked={liked}
              onLike={handleLikeClick}
              disabled={likeSaving}
            />

            <button
              className="btn btn-outline"
              onClick={() => onEdit?.(book.id)}
            >
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
                  onDelete?.(book.id);
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
