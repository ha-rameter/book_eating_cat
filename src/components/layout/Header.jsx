import { SERVICE_NAME } from '../../constants';

function Header({ onMenuOpen, onGoHome, onGoRegister }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="site-header-menu" type="button" onClick={onMenuOpen} aria-label="전체 메뉴 열기">
          <span aria-hidden="true">☰</span>
        </button>
        <button className="site-brand" type="button" onClick={onGoHome} aria-label={`${SERVICE_NAME} 홈으로 이동`}>
          <span className="site-brand-name" aria-hidden="true">
            <span className="site-brand-light">작가의</span> <span className="site-brand-strong">산책</span>
          </span>
        </button>
        <button className="btn btn-primary site-header-create" type="button" onClick={onGoRegister}>
          <span aria-hidden="true">+</span> 새 도서 등록
        </button>
      </div>
    </header>
  );
}

export default Header;
