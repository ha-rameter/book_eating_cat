
import BookDetail from './BookDetail.jsx';

function App() {
  const sampleBook = {
    id: 1,
    title: '별빛 아래의 서점',
    author: '홍길동',
    category: '에세이',
    genre: '일상',
    averageRating: 4.3,
    reviewCount: 15,
    contents: '작은 바닷가 마을의 오래된 서점에서 펼쳐지는 이야기입니다.',
    coverImageUrl: '',
    likeCount: 27,
    createdAt: '2026-11-17T18:00:00',
    updatedAt: '2026-11-18T10:20:00',
  };

  const handleBack = () => {
    console.log('목록으로 이동');
    alert('목록으로 돌아가기 버튼 클릭!');
  };

  const handleEdit = () => {
    console.log('수정 화면으로 이동');
    alert('도서 수정 버튼 클릭!');
  };

  const handleDelete = () => {
    console.log('도서 삭제 요청');
    alert('도서 삭제 요청이 정상적으로 전달되었습니다!');
  };

  return (
    <BookDetail
      book={sampleBook}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default App;
