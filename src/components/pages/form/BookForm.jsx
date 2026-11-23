import { useState } from 'react';
import { CATEGORIES, CATEGORY_GENRES, LIMITS } from '../../../constants';

function validate(form) {
  const errors = {};
  for (const [name, rule] of Object.entries(LIMITS)) {
    const length = form[name].trim().length;
    if (length === 0) {
      errors[name] = `${rule.obj} 입력해 주세요.`;
    } else if (length < rule.min || length > rule.max) {
      errors[name] = `${rule.topic} ${rule.min}자 이상 ${rule.max}자 이하로 입력해 주세요.`;
    }
  }
  return errors;
}

function BookForm({ mode, initialBook, onSubmit, onCancel }) {
  const editing = mode === 'edit';
  const book = editing ? initialBook : null;
  const [form, setForm] = useState(() => ({
    title: book?.title ?? '',
    author: book?.author ?? '',
    contents: book?.contents ?? '',
    category: book?.category ?? '',
    genre: book?.genre ?? '',
  }));
  const [showErrors, setShowErrors] = useState(false);
  const errors = validate(form);
  const genres = CATEGORY_GENRES[form.category] ?? [];

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === 'category') return { ...current, category: value, genre: '' };
      return { ...current, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowErrors(true);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }

    // 등록은 입력값 전체를, 수정은 기존 도서와 달라진 값만 전달한다.
    const data = {};
    for (const [name, input] of Object.entries(form)) {
      const value = input.trim();
      if (!editing || value !== (book?.[name] ?? '').trim()) {
        data[name] = value;
      }
    }
    onSubmit(data);
  }

  function renderTextField(name, placeholder) {
    const { label, min, max } = LIMITS[name];
    const id = `book-${name}`;
    const error = showErrors && errors[name];
    const inputProps = {
      id,
      name,
      placeholder,
      value: form[name],
      onChange: handleChange,
      required: true,
      minLength: min,
      maxLength: max,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${id}-count ${id}-error` : `${id}-count`,
    };

    return (
      <p>
        <label htmlFor={id}>{label} (필수{min > 1 && `, ${min}자 이상`})</label><br />
        {name === 'contents' ? <textarea {...inputProps} rows={5} /> : <input {...inputProps} />}{' '}
        <small id={`${id}-count`}>{form[name].length} / {max}자</small>
        {error && <span id={`${id}-error`} role="alert"><br />{error}</span>}
      </p>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1>{editing ? '도서 정보 수정' : '새 도서 등록'}</h1>
      {renderTextField('title', '별빛 아래의 서점')}
      {renderTextField('author', '홍길동')}
      <p>
        <label htmlFor="book-category">구분 (선택)</label><br />
        <select id="book-category" name="category" value={form.category} onChange={handleChange}>
          <option value="">선택 안 함</option>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select>
      </p>
      <p>
        <label htmlFor="book-genre">장르 (선택)</label><br />
        <select
          id="book-genre"
          name="genre"
          value={form.genre}
          onChange={handleChange}
          disabled={!form.category}
        >
          <option value="">{form.category ? '선택 안 함' : '구분을 먼저 선택해 주세요'}</option>
          {genres.map((genre) => <option key={genre}>{genre}</option>)}
        </select>
      </p>
      {renderTextField('contents', '책의 내용과 분위기를 적어 주세요.')}
      <button type="button" className="btn" onClick={onCancel}>취소</button>{' '}
      <button type="submit" className="btn btn-primary">{editing ? '저장' : '등록'}</button>
    </form>
  );
}

export default BookForm;
