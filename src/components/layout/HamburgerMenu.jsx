import { useEffect, useRef, useState } from 'react';
import { GITHUB_URL, SERVICE_NAME } from '../../constants';
import ServiceGuideModal from './ServiceGuideModal';

function HamburgerMenu({ open, current, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const helpTimerRef = useRef(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => () => window.clearTimeout(helpTimerRef.current), []);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = [...panelRef.current.querySelectorAll('button:not(:disabled), a[href]')];
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

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  function navigate(page) {
    onNavigate(page);
    onClose();
  }

  function openHelp() {
    onClose();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    helpTimerRef.current = window.setTimeout(() => setHelpOpen(true), reducedMotion ? 0 : 260);
  }

  return (
    <>
    <div className={`side-menu-root${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <button className="side-menu-backdrop" type="button" onClick={onClose} aria-label="메뉴 닫기" tabIndex={-1} />
      <aside className="side-menu" ref={panelRef} role="dialog" aria-modal="true" aria-label="전체 메뉴">
        <div className="side-menu-header">
          <span className="side-menu-brand">{SERVICE_NAME}</span>
          <button className="side-menu-close" ref={closeRef} type="button" onClick={onClose} aria-label="메뉴 닫기">×</button>
        </div>
        <nav className="side-menu-nav" aria-label="주 메뉴">
          <button className={`side-menu-link${current === 'home' ? ' is-current' : ''}`} type="button" aria-current={current === 'home' ? 'page' : undefined} onClick={() => navigate('home')}>
            홈
          </button>
          <button className={`side-menu-link${current === 'register' ? ' is-current' : ''}`} type="button" aria-current={current === 'register' ? 'page' : undefined} onClick={() => navigate('register')}>
            새 도서 등록
          </button>
          <button className="side-menu-link side-menu-link-soon" type="button" disabled>
            <span>독서 클럽</span>
            <span className="side-menu-soon-badge">준비 중</span>
          </button>
          <button className="side-menu-link" type="button" onClick={openHelp}>이용 안내</button>
        </nav>
        <a className="side-menu-github" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}>
          GitHub 저장소 <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </div>
    {helpOpen && <ServiceGuideModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}

export default HamburgerMenu;
