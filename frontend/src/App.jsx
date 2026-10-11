import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import { getMovies } from './services/movieService';
import { addFavorite, getFavorites, removeFavorite } from './services/favoriteService';
import { errorMessage } from './services/api';

export default function App() {
  return <BrowserRouter><MovieBrowser /></BrowserRouter>;
}

function MovieBrowser() {
  const location = useLocation();
  const { user, loading: authLoading, error: authError } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [favoriteState, setFavoriteState] = useState({ userId: null, records: [], error: '' });
  const [notice, setNotice] = useState(null);
  const userId = user?.id;
  if (notice && (notice.locationKey !== location.key || notice.userId !== userId)) {
    setNotice(null);
  }
  const favoritesLoading = Boolean(user && favoriteState.userId !== userId);
  const favoriteRecords = user && favoriteState.userId === userId ? favoriteState.records : [];
  const favorites = favoriteRecords.map((favorite) => favorite.movie_id);
  const favoritesError = user && favoriteState.userId === userId ? favoriteState.error : '';

  useEffect(() => {
    const controller = new AbortController();
    getMovies(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) { setMovies(data); setError(''); }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) { setError(errorMessage(failure)); }
      })
      .finally(() => { if (!controller.signal.aborted) { setLoading(false); } });
    return () => controller.abort();
  }, [retryCount]);

  useEffect(() => {
    if (!userId) { return; }
    const controller = new AbortController();
    getFavorites(controller.signal)
      .then((records) => {
        if (!controller.signal.aborted) { setFavoriteState({ userId, records, error: '' }); }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setFavoriteState({ userId, records: [], error: errorMessage(failure) });
        }
      });
    return () => controller.abort();
  }, [userId, retryCount]);

  function retry() {
    setError('');
    setLoading(true);
    setFavoriteState({ userId: null, records: [], error: '' });
    setRetryCount((count) => count + 1);
  }

  async function toggleFavorite(movieId) {
    if (!user || favoritesLoading || favoritesError) { throw new Error('Please reload your favorites first.'); }
    const favorite = favoriteRecords.find((record) => record.movie_id === movieId);
    const result = favorite ? await removeFavorite(favorite.id) : await addFavorite(movieId);
    setFavoriteState((current) => {
      if (current.userId !== userId) { return current; }
      const records = favorite
        ? current.records.filter((record) => record.id !== favorite.id)
        : [...current.records.filter((record) => record.movie_id !== movieId), result.data];
      return { ...current, records };
    });
    setNotice({ message: result.message, locationKey: location.key, userId });
  }

  const movieProps = { movies, loading, error, retry, favorites, favoritesLoading, toggleFavorite };

  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="fixed -top-25 left-4 z-10 bg-forest p-3 text-white focus:top-3">Skip to content</a>
      <Navbar favoriteCount={favorites.length} />
      <main className="min-h-[75vh]" id="main-content">
        {(authError || favoritesError) && (
          <div className="mx-auto mt-4 w-9/10 max-w-290" role="alert">
            {authError || favoritesError}
            {favoritesError && <button className="text-link ml-3" onClick={retry}>Retry</button>}
          </div>
        )}
        {notice && <p className="mx-auto mt-4 w-9/10 max-w-290 text-forest" role="status">{notice.message}</p>}
        <Routes>
          <Route path="/" element={<Home {...movieProps} />} />
          <Route path="/browse" element={<Browse {...movieProps} />} />
          <Route path="/favorites" element={<Favorites {...movieProps} loading={loading || authLoading || favoritesLoading} error={error || favoritesError} />} />
          <Route path="/movie/:id" element={<MovieDetails {...movieProps} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <div className="state-panel">
              <h1>Page not found</h1><p>The page you are looking for does not exist.</p>
              <Link className="button" to="/">Back to home</Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
