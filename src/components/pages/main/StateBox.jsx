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
