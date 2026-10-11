import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { errorMessage } from '../services/api';

export default function FavoriteButton({ movie, favorites, favoritesLoading, toggleFavorite, compact = false }) {
  const { user, loading } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saved = favorites.includes(movie.id);
  const className = compact
    ? 'inline-flex min-h-11 w-full items-center justify-center rounded-md border border-line bg-transparent p-2 text-sm text-forest hover:bg-soft aria-pressed:bg-soft disabled:opacity-60'
    : 'button disabled:opacity-60';

  async function handleClick() {
    setBusy(true);
    setError('');
    try { await toggleFavorite(movie.id); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  }

  if (loading) { return <span className="text-sm text-muted">Checking login...</span>; }
  if (!user) { return <Link className={className} to="/login">Log in to save favorites</Link>; }
  return (
    <>
      <button className={className} aria-pressed={saved} disabled={busy || favoritesLoading}
        aria-label={`${saved ? 'Remove' : 'Save'} ${movie.title} ${saved ? 'from' : 'to'} favorites`}
        onClick={handleClick}>
        {favoritesLoading ? 'Loading favorites...' : busy ? 'Saving...' : saved ? (compact ? 'Saved' : 'Remove from favorites') : 'Save favorite'}
      </button>
      {error && <p className="mt-2 text-sm" role="alert">{error}</p>}
    </>
  );
}
