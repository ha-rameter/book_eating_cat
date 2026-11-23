// 인기 도서 최대 10권을 5권씩 표시. 양옆 화살표로 한 칸씩 넘김, 위치 표시, 양 끝 비활성 (API-01)
import { useState, useEffect } from 'react';
import { getPopularBooks } from '../../../api';
import BookCard from './BookCard';
import StateBox from './StateBox';

const SHOW = 5;

function PopularBooks({ onSelect, reloadKey }) {
  const [popular, setPopular] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPopular() {
      try {
        const data = await getPopularBooks();
        setPopular(data);
        setError('');
      } catch (err) {
        setError('인기 도서를 불러오지 못했어요. 잠시 후 새로고침해 주세요.');
      } finally {
        setLoading(false);
      }
    }
    loadPopular();
  }, [reloadKey]);

  const canPrev = start > 0;
  const canNext = start + SHOW < popular.length;

  return (
    <section className="section" id="popular">
      <div className="section-head">
        <h2 className="section-title">
          인기 도서 <small>좋아요 많은 순, 같으면 별점, 최신 등록순</small>
        </h2>
        {popular.length > SHOW && (
          <span className="position">
            {start + 1}~{start + SHOW}위 / {popular.length}위
          </span>
        )}
      </div>

      {loading && <StateBox type="loading" message="인기 도서를 불러오는 중이에요..." />}
      {!loading && error && <StateBox type="error" message={error} />}
      {!loading && !error && popular.length === 0 && <StateBox type="empty" message="아직 인기 도서가 없어요." />}

      {!loading && !error && popular.length > 0 && (
        <div className="carousel">
          {popular.length > SHOW && (
            <button className="arrow" onClick={() => setStart(start - 1)} disabled={!canPrev} aria-label="이전 순위">
              ‹
            </button>
          )}
          <div className="carousel-view">
            <div className="carousel-track" style={{ transform: `translateX(calc(-${start} * (100% + 16px) / ${SHOW}))` }}>
              {popular.map((book, i) => (
                <div className="carousel-item" key={book.id}>
                  <BookCard book={book} rank={i + 1} onSelect={onSelect} />
                </div>
              ))}
            </div>
          </div>
          {popular.length > SHOW && (
            <button className="arrow" onClick={() => setStart(start + 1)} disabled={!canNext} aria-label="다음 순위">
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default PopularBooks;