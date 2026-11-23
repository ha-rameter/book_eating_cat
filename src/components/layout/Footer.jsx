// 푸터: 서비스명, 조 정보, GitHub 저장소 링크(새 탭), AI 생성 표지 안내
import { SERVICE_NAME, TEAM_NAME, GITHUB_URL } from '../../constants';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <strong className="site-footer-name">{SERVICE_NAME}</strong>
        <span>{TEAM_NAME}</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub 저장소
        </a>
      </div>
    </footer>
  );
}

export default Footer;