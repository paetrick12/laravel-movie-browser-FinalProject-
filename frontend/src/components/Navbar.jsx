import { NavLink, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { errorMessage } from '../services/api';

export default function Navbar({ favoriteCount }) {
  const { user, loading, logout } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    setBusy(true);
    setError('');
    try { await logout(); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  }
  return (
    <header className="border-b border-line bg-paper">
      <nav
        className="mx-auto flex min-h-24 w-9/10 max-w-290 flex-col items-start justify-between gap-4 pt-5 pb-3 md:flex-row md:items-center md:py-0 lg:gap-6"
        aria-label="Main navigation"
      >
        <Link
          className="flex items-center gap-3 text-xl leading-tight font-bold"
          to="/"
        >
          <img
            className="size-12 object-contain"
            src={`${import.meta.env.BASE_URL}studio-ghibli-symbol.png`}
            alt=""
          />
          <span>
            Studio Ghibli
            <small className="mt-1 block text-[10px] font-medium tracking-widest">
              MOVIE BROWSER
            </small>
          </span>
        </Link>
        <div className="flex w-full flex-wrap items-center justify-between gap-1 md:w-auto md:gap-2">
          <NavLink
            className="nav-link"
            to="/"
            end
          >
            Home
          </NavLink>
          <NavLink
            className="nav-link"
            to="/browse"
          >
            Browse
          </NavLink>
          {user && <NavLink
            className="nav-link"
            to="/favorites"
          >
            Favorites ({favoriteCount})
          </NavLink>}
          <NavLink
            className="nav-link"
            to="/about"
          >
            About
          </NavLink>
          {loading ? <span className="text-sm text-muted">Checking login...</span> : user ? (
            <>
              <span className="px-2 text-sm">{user.name}</span>
              <button className="nav-link" disabled={busy} onClick={handleLogout}>{busy ? 'Logging out...' : 'Logout'}</button>
            </>
          ) : (
            <><NavLink className="nav-link" to="/login">Login</NavLink><NavLink className="nav-link" to="/register">Register</NavLink></>
          )}
          {error && <span role="alert" className="w-full text-sm">{error}</span>}
        </div>
      </nav>
    </header>
  );
}
