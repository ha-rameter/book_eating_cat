// 홈 화면 묶음: 검색 결과가 있으면 SearchResult, 없으면 PopularBooks, CategoryFilter, BookList
import { useState } from 'react';
import { searchBooks } from '../../../api';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import PopularBooks from './PopularBooks';
import CategoryFilter from './CategoryFilter';
import BookList from './BookList';
import StateBox from './StateBox';

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