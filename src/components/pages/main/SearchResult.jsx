import BookCard from './BookCard';
import StateBox from './StateBox';

function SearchResult({ type, keyword, results, onReset, onSelect, onRegister, onLike }) {
  const typeLabel = type === 'author' ? '저자' : '제목';

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">
          {typeLabel} '{keyword}' 검색 결과 <span className="count">{results.length}권</span>
        </h2>
        <button className="btn" onClick={onReset}>
          검색 초기화
        </button>
      </div>

      {results.length === 0 ? (
        <StateBox type="empty" message={`${typeLabel}에 '${keyword}'이(가) 들어간 도서가 없어요. 검색 기준을 바꾸거나 다른 단어로 찾아보세요.`}>
          <button className="btn" onClick={onReset}>
            전체 도서 보기
          </button>
          <button className="btn btn-primary" onClick={onRegister}>
            새 도서 등록하기
          </button>
        </StateBox>
      ) : (
        <>
          <p className="section-sub">좋아요 많은 순으로 보여 줘요. 하트 밖을 누르면 상세로 이동해요.</p>
          <div className="grid">
            {results.map((book) => (
              <BookCard key={book.id} book={book} keyword={type === 'title' ? keyword : ''} onSelect={onSelect} onLike={onLike} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default SearchResult;
