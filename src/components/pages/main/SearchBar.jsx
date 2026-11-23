// 검색창: 제목, 저자 드롭다운과 입력칸, 조회 버튼. 엔터로 조회, 빈 값이면 안내
import { useState } from "react";
function SearchBar({ onSearch, onReset }) {
  const [type, setType] = useState('title');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // KJG 오류 메세지 출력
  // 핸들값 가져와서...... 여기서 처리하자
  function handleSubmit(e) {
    e.preventDefault();
    const keyword = input.trim();

    // 검색어가 없을 때
    if (keyword === '') {
      setError('검색어를 입력해 주세요.');
      return;
    }
    setError('');
    onSearch(type, keyword);
  }

  function handleReset() {
    setInput('');
    setError('');
    onReset();
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search-row">
        <select className="input search-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="title">제목</option>
          <option value="author">저자</option>
        </select>
        <input
          className={error ? 'input search-input input-error' : 'input search-input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={type === 'title' ? '찾을 도서 제목을 입력하세요' : '찾을 저자 이름을 입력하세요'}
        />
        <button className="btn btn-primary" type="submit">
          조회
        </button>
        {input !== '' && (
          <button className="btn" type="button" onClick={handleReset}>
            초기화
          </button>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </form>
  );
}

export default SearchBar;
