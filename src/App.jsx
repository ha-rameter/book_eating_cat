import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import HamburgerMenu from "./components/layout/HamburgerMenu";
import Footer from "./components/layout/Footer";
import HomePage from "./components/pages/main/HomePage";
import BookDetail from "./components/pages/detail/BookDetail";
import BookForm from "./components/pages/form/BookForm";
import { updateBook } from "./api.js";

function App() {
  // 화면 전환: home, detail, register, edit
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // 성공, 실패 알림 { type: 'success' 또는 'error', text }
  const [notice, setNotice] = useState(null);

  function goHome() {
    setPage("home");
    setSelectedId(null);
  }

  function goDetail(id) {
    setSelectedId(id);
    setEditingBook(null);
    setNotice(null);
    setPage("detail");
  }

  function goRegister() {
    setPage("register");
  }

  // 상세 화면에서 읽어 온 책을 수정 폼의 초기값으로 사용한다.
  function goEdit(id, book) {
    setSelectedId(id);
    setEditingBook(book);
    setPage("edit");
  }

  // 처리 함수 자리 (API 설계서 번호)
  async function handleCreate(form) {} // API-08
  async function handleUpdate(id, changes) {
    try {
      if (Object.keys(changes).length > 0) {
        await updateBook(id, { ...changes, updatedAt: new Date().toISOString() });
      }
      goDetail(id);
    } catch {
      setNotice({ type: "error", text: "도서 정보를 저장하지 못했어요. 다시 시도해 주세요." });
    }
  }
  async function handleDelete(id) {} // API-11

  async function handleLike(book, liked) {
    // API-10
    const nextLikeCount = Math.max(0, (book.likeCount ?? 0) + (liked ? 1 : -1));

    return await updateBook(book.id, {
      likeCount: nextLikeCount,
      updatedAt: new Date().toISOString(),
    });
  }

  async function handleRate(book, score) {} // API-15

  return (
    <div className="app">
      <Header
        onMenuOpen={() => setMenuOpen(true)}
        onGoHome={goHome}
        onGoRegister={goRegister}
      />
      <HamburgerMenu
        open={menuOpen}
        current={page}
        onClose={() => setMenuOpen(false)}
        onNavigate={setPage}
      />
      {notice && (
        <div className={`notice notice-${notice.type}`}>{notice.text}</div>
      )}

      <main className="main">
        {page === "home" && (
          <HomePage
            onSelect={goDetail}
            onRegister={goRegister}
            onLike={handleLike}
          />
        )}

        {page === "detail" && (
          <BookDetail
            bookId={selectedId}
            onBack={goHome}
            onEdit={goEdit}
            onDelete={handleDelete}
            onLike={handleLike}
            onRate={handleRate}
          />
        )}

        {page === "register" && (
          <BookForm mode="register" onSubmit={handleCreate} onCancel={goHome} />
        )}

        {page === "edit" && (
          <BookForm
            mode="edit"
            initialBook={editingBook}
            onSubmit={(changes) => handleUpdate(selectedId, changes)}
            onCancel={() => goDetail(selectedId)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
