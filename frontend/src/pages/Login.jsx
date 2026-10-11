import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import AuthWelcome from '../components/AuthWelcome';

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try { await login({ email, password }); navigate('/browse'); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  }

  if (user) { return <Navigate to="/browse" replace />; }
  return (
    <div className="page">
      <p className="eyebrow">YOUR GHIBLI COLLECTION</p><h1>Welcome back</h1>
      <div className="grid items-stretch gap-7 md:grid-cols-2 lg:grid-cols-[minmax(0,448px)_minmax(0,1fr)] lg:gap-10">
        <form className="flex min-w-0 flex-col gap-5 rounded-xl border border-line bg-paper p-6" onSubmit={submit}>
          <label className="input-label">Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="input-label">Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p role="alert" className="mb-0">{error}</p>}
          <button className="button" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
          <p className="mb-0 text-sm">New here? <Link className="text-link" to="/register">Create an account</Link></p>
        </form>
        <AuthWelcome />
      </div>
    </div>
  );
}
