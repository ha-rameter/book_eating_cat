import { useEffect, useRef } from "react";

function ServiceGuideModal({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding =
        parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [
        ...dialogRef.current.querySelectorAll("button:not(:disabled), a[href]"),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.querySelector(".site-header-menu")?.focus();
    };
  }, [onClose]);

  return (
    <div className="guide-modal-root">
      <button
        className="guide-modal-backdrop"
        type="button"
        aria-label="이용 안내 닫기"
        onClick={onClose}
        tabIndex={-1}
      />
      <section
        className="guide-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        <div className="guide-modal-heading">
          <div>
            <p className="guide-modal-kicker">작가의 산책</p>
            <h2 id="guide-modal-title">이용 안내</h2>
          </div>
          <button
            className="guide-modal-close"
            ref={closeRef}
            type="button"
            aria-label="이용 안내 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="guide-modal-content">
          <section>
            <h3>책 둘러보기</h3>
            <p>
              인기 있는 책과 새로 등록된 책을 살펴보세요. 제목이나 저자 이름으로
              찾거나, 관심 있는 구분과 장르를 골라 볼 수 있어요. 책을 누르면
              내용을 자세히 볼 수 있습니다.
            </p>
          </section>
          <section>
            <h3>책 등록하기</h3>
            <p>
              ‘새 도서 등록’을 눌러 제목, 저자, 책 내용을 적어 주세요. 구분과
              장르는 선택하지 않아도 됩니다.
            </p>
          </section>
          <section>
            <h3>표지 만들기</h3>
            <p>
              ‘AI 표지 2개 만들기’를 누르면 적어 주신 내용을 바탕으로 표지 두
              장을 그려 드려요. 마음에 드는 표지를 고르거나, 표지 없이 책을
              등록할 수도 있습니다. 나중에 ‘수정’을 눌러 표지를 추가해도 돼요.
            </p>
          </section>
          <section>
            <h3>마음에 드는 책에 참여하기</h3>
            <p>
              책을 열어 좋아요를 누르거나 별점을 남겨 보세요. 책 내용을
              바꾸거나 삭제하려면 해당 책의 ‘수정’ 또는 ‘삭제’를 누르면 됩니다.
            </p>
          </section>
        </div>
        <div className="guide-modal-footer">
          <button className="btn btn-primary" type="button" onClick={onClose}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}

export default ServiceGuideModal;
