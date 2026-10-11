import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import DataState from '../components/DataState';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Favorites({
  movies,
  loading,
  error,
  retry,
  favorites,
  favoritesLoading,
  toggleFavorite,
}) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const savedMovies = movies.filter((movie) => favorites.includes(movie.id));
  const ready = !loading && !error;

  return (
    <div className="page">
      <p className="eyebrow">
        YOUR OWN LITTLE COLLECTION
      </p>
      <h1>Your favorites</h1>
      <p className="max-w-xl text-muted">
        The Ghibli films you want to come back to. Saved to your account.
      </p>
      <DataState loading={loading} error={error} retry={retry} />
      {!authLoading && !user && <p><Link className="text-link" to="/login">Log in to view your favorites.</Link></p>}
      {user && ready && savedMovies.length > 0 && (
        <>
          <p className="my-6 text-sm text-muted">
            {savedMovies.length} saved movies
          </p>
          <MovieGrid
            movies={savedMovies}
            favorites={favorites}
            favoritesLoading={favoritesLoading}
            toggleFavorite={toggleFavorite}
          />
        </>
      )}
      {user && ready && savedMovies.length === 0 && (
        <div className="state-panel">
          <h2>A favorite story is waiting</h2>
          <p>Choose Save favorite on a movie to add it here.</p>
          <Link
            className="button"
            to="/browse"
          >
            Find a movie
          </Link>
        </div>
      )}
    </div>
  );
}
