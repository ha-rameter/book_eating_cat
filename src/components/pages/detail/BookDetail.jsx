
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
  const [rated, setRated] = useState(false); // KJG - 별점을 이미 줬는지
  const [rateSaving, setRateSaving] = useState(false); // KJG - 별점 저장 중
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setError('');
      setBook(null);
      setRating(0);
      setRated(false); // KJG - 별점 주었는지 확인
      setShowDeleteModal(false);

      try {
        const data = await getBook(bookId);

        if (active) {
          setBook(data);
        }
      } catch (err) {
        console.error('도서 상세 불러오기 실패', err); // KJG - 개발자용은 콘솔로
        
        if (active) {
          setError('도서 정보를 불러오지 못했어요. 목록에서 다시 선택해 주세요.'); // 사용자에게 보여지는 에러
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (bookId === null || bookId === undefined) {
      setBook(null);
      // setError('도서 ID가 없습니다.');
      setError('도서 정보를 찾을 수 없어요. 목록에서 다시 선택해 주세요.'); // 수정
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
  // const handleRating = (score) => {
  //   setRating(score);
  //   onRate?.(book, score);
  // };
  // KJG - 별을 누르면 고르기만 하고 저장은 하지 않음
  const handleRating = (score) => {
    if (rated) return;
    setRating(score);
  };

  // KJG - 별점 주기 버튼을 눌렀을 때 한 번만 저장하고, 새 평균으로 화면 갱신
  const handleRateSubmit = async () => {
    if (!book || !onRate || rating === 0 || rated) return;

    setRateSaving(true);
    try {
      const updatedBook = await onRate(book, rating);
      if (updatedBook) {
        setBook(updatedBook);
        setRated(true);
      }
    } finally {
      setRateSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.(book.id);
  };

  if (loading) {
    return <div className="detail">도서 정보를 불러오는 중입니다...</div>;
  }

  // if (error) {
  //   return <div className="detail">오류: {error}</div>;
  // }
  // KJG - 돌아가기버튼 추가
  if (error) {
  return (
    <div className="detail">
      <p>{error}</p>
      <button type="button" className="btn detail-outline" onClick={onBack}>
        목록으로 돌아가기
      </button>
    </div>
  );
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
              <span>표지 없음</span>
            )}
          </div>

          <p className="cover-description">
            표지는 등록이나 수정 화면에서 만들어요.
          </p>
        </div>

        <div className="detail-information">
          <h1>{book.title}</h1>
          <p className="book-author"><em>by</em> {book.author}</p>

          <div className="detail-meta">
            {book.category && <span className="detail-tag">{book.category}</span>}
            {book.genre && <span className="detail-tag">{book.genre}</span>}

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
{/* KJG - 별점 추가 */}
            <div className="rating-row">
              <span className="rating-message">
                {rated
                  ? `내 별점 ${rating}점, 평가해 주셔서 고마워요`
                  : rating === 0
                    ? '별을 눌러 고른 뒤 별점 주기를 눌러 주세요'
                    : `내 별점 ${rating}점`}
              </span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRateSubmit}
                disabled={rating === 0 || rated || rateSaving}
              >
                {rated ? '평가 완료' : rateSaving ? '저장 중...' : '별점 주기'}
              </button>
            </div>
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
              onClick={() => onEdit?.(book.id, book)}
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
