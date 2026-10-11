export default function DataState({ loading, error, retry }) {
  if (loading) {
    return (
      <div
        className="state-panel"
        role="status"
      >
        Loading Ghibli movies...
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="state-panel"
        role="alert"
      >
        <h2>Movies could not load</h2>
        <p>{error}</p>
        <button
          className="button"
          onClick={retry}
        >
          Try again
        </button>
      </div>
    );
  }
  return null;
}
