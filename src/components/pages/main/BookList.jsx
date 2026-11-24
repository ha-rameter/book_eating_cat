import { useState, useEffect } from 'react';
import { getLatestBooks } from '../../../api';
import BookCard from './BookCard';
import StateBox from './StateBox';

function BookList({ category, genre, onSelect, onLike, onRegister }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFirstPage() {
      try {
        setLoading(true);
        const data = await getLatestBooks(1, category, genre);
        setBooks(data.books);
        setTotal(data.total);
        setPage(1);
        setError('');
      } catch (err) {
        setError('도서 목록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.');
      } finally {
        setLoading(false);
      }
    }
    loadFirstPage();
  }, [category, genre]);

  async function handleMore() {
    try {
      setLoading(true);
      const data = await getLatestBooks(page + 1, category, genre);
      setBooks([...books, ...data.books]);
      setTotal(data.total);
      setPage(page + 1);
    } catch (err) {
      setError('다음 도서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(book, liked) {
    const saved = await onLike(book, liked);
    if (saved) {
      setBooks(books.map((item) => (item.id === saved.id ? saved : item)));
    }
    return saved;
  }

  if (error) {
    return <StateBox type="error" message={error} />;
  }

  if (!loading && books.length === 0) {
    return (
      <StateBox type="empty" message="이 길에는 아직 꽂힌 책이 없어요. 첫 책을 꽂아 주세요.">
        <button className="btn btn-primary" onClick={onRegister}>
          새 도서 등록하기
        </button>
      </StateBox>
    );
  }

  return (
    <>
      <div className="grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onSelect={onSelect} onLike={handleLike} />
        ))}
      </div>

      {loading && <StateBox type="loading" message="도서를 불러오는 중이에요..." />}

      {!loading && (
        <div className="more">
          {books.length < total ? (
            <button className="btn" onClick={handleMore}>
              더 보기 ({books.length} / {total}권)
            </button>
          ) : (
            <span className="section-sub">전체 {total}권을 모두 봤어요</span>
          )}
        </div>
      )}
    </>
  );
}

export default BookList;