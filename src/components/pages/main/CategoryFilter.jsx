import {CATEGORIES, CATEGORY_GENRES} from '../../../constants'

function CategoryFilter({ category, genre, onChange }) {
  // KJG - 카테고리/장르 받아오기
  const genres = category === ''? [] : CATEGORY_GENRES[category];

  return (
    <div className="filter">
      <div className='tabs'>
        <button className={category === '' ? 'tab active' : 'tab'} onClick={() => onChange('', '')}>
          종합
        </button>
        {CATEGORIES.map((item) => (
          <button key={item} className={category === item ? 'tab active' : 'tab'} onClick={() => onChange(item, '')}>
            {item}
          </button>
        ))}
      </div>
      

      {category !== '' && (
        <div className="chips">
          <button className={genre === '' ? 'chip active' : 'chip'} onClick={() => onChange(category, '')}>
            전체
          </button>
          {genres.map((item) => (
            <button key={item} className={genre === item ? 'chip active' : 'chip'} onClick={() => onChange(category, item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;
