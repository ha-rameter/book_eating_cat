
import BookDetail from './BookDetail.jsx';

const API_URL = 'http://localhost:3000';

function App() {
  const handleBack = () => {
    console.log('목록으로 이동');
    alert('목록으로 돌아가기 버튼 클릭!');
  };

  const handleEdit = (id) => {
    console.log('수정할 도서 ID:', id);
    alert(`${id}번 도서 수정 요청`);
  };

  const handleDelete = (id) => {
    console.log('삭제할 도서 ID:', id);
    alert(`${id}번 도서 삭제 요청`);
  };

  const handleLike = async (book, liked) => {
    const nextLikeCount = Math.max(
      0,
      (book.likeCount ?? 0) + (liked ? 1 : -1)
    );

    const response = await fetch(
      `${API_URL}/books/${book.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likeCount: nextLikeCount,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('좋아요 저장 실패');
    }

    const updatedBook = await response.json();

    console.log('좋아요 저장 성공:', updatedBook.likeCount);

    return updatedBook;
  };

  return (
    <BookDetail
      bookId={1}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onLike={handleLike}
    />
  );
}

export default App;
