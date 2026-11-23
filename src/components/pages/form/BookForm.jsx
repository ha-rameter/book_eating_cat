import { useState } from 'react';
import { CATEGORIES, CATEGORY_GENRES, LIMITS } from '../../../constants';
import CoverPicker from './CoverPicker';
import './BookForm.css';

// 제목, 저자, 내용에서 앞뒤 공백을 뺀 뒤 항목별로 오류 문구를 모은다.
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

// 등록과 수정에서 같은 폼을 쓰고, 제출과 취소 동작은 부모가 넘긴 함수에 맡긴다.
function BookForm({ mode, initialBook, onSubmit, onCancel }) {
  const editing = mode === 'edit';
  const book = editing ? initialBook : null;
  // 폼을 처음 열면 등록은 빈 입력칸, 수정은 initialBook의 값으로 시작한다.
  const [form, setForm] = useState(() => ({
    title: book?.title ?? '',
    author: book?.author ?? '',
    contents: book?.contents ?? '',
    category: book?.category ?? '',
    genre: book?.genre ?? '',
    coverImageUrl: book?.coverImageUrl ?? '',
  }));

  // 오류는 입력이 바뀔 때마다 계산하고, 첫 제출 시도부터 화면에 보여 준다.
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false); // KJG - 저장중 잠금
  const errors = validate(form);
  // 현재 구분에서 선택할 수 있는 장르 목록을 가져온다.
  const genres = CATEGORY_GENRES[form.category] ?? [];
  // KJG - 등록은 전체 입력값, 수정은 달라진 값만 확인.
  const changes = {};
  for (const [name, input] of Object.entries(form)) {
    const value = input.trim();
    if (!editing || value !== (book?.[name] ?? '').trim()) {
      changes[name] = value;
    }
  }
  const changedCount = Object.keys(changes).length;
  // 입력칸의 name으로 form에서 바꿀 항목을 찾는다.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      // 구분을 바꾸면 이전 구분에서 고른 장르를 비운다.
      if (name === 'category') return { ...current, category: value, genre: '' };
      return { ...current, [name]: value };
    });
  }

  // function handleSubmit(event) {
  //   // React에서 제출을 처리하도록 브라우저의 기본 제출 동작을 막는다.
  //   event.preventDefault();
  //   setShowErrors(true);
  //   // 오류가 있다면 첫 번째 오류가 난 입력칸으로 포커스를 옮긴다.
  //   const firstInvalid = Object.keys(errors)[0];
  //   if (firstInvalid) {
  //     event.currentTarget.elements.namedItem(firstInvalid).focus();
  //     return;
  //   }
  // KJG - Error Event / 버그수정
  async function handleSubmit(event) {
    event.preventDefault();
    setShowErrors(true);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }
    // KJG - 뮤텍스처럼 일단 등록중에 수정 불가능하게 변경... 차후 백엔드 고려
    if (submitting || (editing && changedCount === 0)) return;

    setSubmitting(true);
    await onSubmit(changes);
    setSubmitting(false);
  }

// 제목, 저자, 내용에서 라벨과 글자 수, 오류 표시를 같은 형식으로 보여 준다.
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
    'data-changed': editing && name in changes, // KJG - 동기화
    'aria-describedby': error ? `${id}-count ${id}-error` : `${id}-count`,
  };

  return (
    <div className="book-form-field">
      <label htmlFor={id}>
        {label}{' '}
        <span className="book-form-required">(필수{min > 1 && `, ${min}자 이상`})</span>
      </label>
      {name === 'contents' ? <textarea {...inputProps} rows={5} /> : <input {...inputProps} />}
      <div className="book-form-field-notes">
        {error && <small className="book-form-error" id={`${id}-error`} role="alert">{error}</small>}
        <small className="book-form-count" id={`${id}-count`}>{form[name].length} / {max}자</small>
      </div>
    </div>
  );
}

// noValidate로 기본 검사 팝업을 끄고 입력칸 아래에 오류 문구를 보여 준다.
return (
  <form className="book-form" onSubmit={handleSubmit} noValidate>
    <div className="book-form-heading">
      <h1>{editing ? '도서 정보 수정' : '새 도서 등록'}</h1>
      <p>도서 내용은 AI 표지를 만들 때 사용돼요.</p>
    </div>
    <div className="book-form-layout">
      <div className="book-form-fields">
        {renderTextField('title', '별빛 아래의 서점')}
        {renderTextField('author', '홍길동')}
        <div className="book-form-select-row">
          <div className="book-form-field">
            <label htmlFor="book-category">구분 <span className="book-form-optional">(선택)</span></label>
            <select id="book-category" name="category" value={form.category} onChange={handleChange}>
              <option value="">선택 안 함</option>
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>
          <div className="book-form-field">
            <label htmlFor="book-genre">장르 <span className="book-form-optional">(선택)</span></label>
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
          </div>
        </div>
        {renderTextField('contents', '책의 내용과 분위기를 적어 주세요.')}
      </div>
      <CoverPicker
        book={form}
        onSelect={(coverImageUrl) => setForm((current) => ({ ...current, coverImageUrl }))}
      />
    </div>
    <div className="book-form-actions">
      <button type="button" className="btn" onClick={onCancel}>취소</button>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting || (editing && changedCount === 0)}
      >
        {submitting
          ? '저장 중...'
          : editing
            ? changedCount === 0
              ? '바뀐 내용이 없어요'
              : `바뀐 항목 ${changedCount}개 저장`
            : form.coverImageUrl
              ? '선택한 표지와 함께 등록'
              : '표지 없이 등록'}
      </button>
    </div>
  </form>
);
}

export default BookForm;
