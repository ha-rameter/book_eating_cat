// 불러오는 중, 오류, 비어 있음 공통 안내 상자. type은 loading, error, empty
function StateBox({ type, message, children }) {
  return (
    <div className={`state-box state-${type}`}>
      {type === 'loading' && <div className="spinner" />}
      <p>{message}</p>
      {children && <div className="state-actions">{children}</div>}
    </div>
  );
}

export default StateBox;
