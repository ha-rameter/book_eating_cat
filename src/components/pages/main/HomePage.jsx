import { useState } from 'react';
import { searchBooks } from '../../../api';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import PopularBooks from './PopularBooks';
import CategoryFilter from './CategoryFilter';
import BookList from './BookList';
import StateBox from './StateBox';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return '맑은 아침, 어떤 이야기와 산책할까요?';
  if (hour >= 11 && hour < 17) return '나른한 오후, 짧은 이야기 한 편 어때요?';
  if (hour >= 17 && hour < 21) return '노을 지는 저녁, 천천히 걸어 볼 책을 골라 보세요.';
  return '늦은 밤, 오늘을 정리할 책 한 권 어때요?';
}

function HomePage({ onSelect, onRegister, onLike }) {
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [category, setCategory] = useState('');
  const [genre, setGenre] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  async function handleSearch(type, word) {
    try {
      setSearching(true);
      setSearchError('');
      const data = await searchBooks(type, word);
      setSearchType(type);
      setKeyword(word);
      setResults(data);
    } catch (err) {
      setSearchError('검색하지 못했어요. 잠시 후 다시 조회해 주세요.');
    } finally {
      setSearching(false);
    }
  }

  function handleReset() {
    setResults(null);
    setKeyword('');
    setSearchError('');
  }

  function handleFilter(nextCategory, nextGenre) {
    setCategory(nextCategory);
    setGenre(nextGenre);
  }

  async function handleLike(book, liked) {
    const saved = await onLike(book, liked);
    if (saved) {
      if (results) {
        setResults(results.map((item) => (item.id === saved.id ? saved : item)));
      }
      setReloadKey(reloadKey + 1);
    }
    return saved;
  }

  return (
    <>
      <p className="home-greeting">{getGreeting()}</p>
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {searching && <StateBox type="loading" message="검색하는 중이에요..." />}
      {!searching && searchError && <StateBox type="error" message={searchError} />}

      {!searching && !searchError && results !== null && (
        <SearchResult
          type={searchType}
          keyword={keyword}
          results={results}
          onReset={handleReset}
          onSelect={onSelect}
          onRegister={onRegister}
          onLike={handleLike}
        />
      )}

      {results === null && (
        <>
          <PopularBooks onSelect={onSelect} reloadKey={reloadKey} />

          <section className="section">
            <div className="section-head">
              <h2 className="section-title">
                도서 목록 <small>최신 등록순</small>
              </h2>
            </div>
            <CategoryFilter category={category} genre={genre} onChange={handleFilter} />
            <BookList category={category} genre={genre} onSelect={onSelect} onLike={handleLike} onRegister={onRegister} />
          </section>
        </>
      )}
    </>
  );
}

export default HomePage;