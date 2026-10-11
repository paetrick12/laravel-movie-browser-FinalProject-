import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { errorMessage } from '../services/api';
import AuthWelcome from '../components/AuthWelcome';

export default function Register() {
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try { await register(form); navigate('/browse'); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  }

  if (user) { return <Navigate to="/browse" replace />; }
  return (
    <div className="page">
      <p className="eyebrow">YOUR GHIBLI COLLECTION</p><h1>Create an account</h1>
      <div className="grid items-stretch gap-7 md:grid-cols-2 lg:grid-cols-[minmax(0,448px)_minmax(0,1fr)] lg:gap-10">
        <form className="flex min-w-0 flex-col gap-5 rounded-xl border border-line bg-paper p-6" onSubmit={submit}>
          <label className="input-label">Name<input name="name" autoComplete="name" value={form.name} onChange={change} maxLength={255} required /></label>
          <label className="input-label">Email<input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required /></label>
          <label className="input-label">Password<input name="password" type="password" autoComplete="new-password" value={form.password} onChange={change} minLength={8} required /></label>
          <label className="input-label">Confirm password<input name="password_confirmation" type="password" autoComplete="new-password" value={form.password_confirmation} onChange={change} required /></label>
          {error && <p role="alert" className="mb-0">{error}</p>}
          <button className="button" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
          <p className="mb-0 text-sm">Already registered? <Link className="text-link" to="/login">Login</Link></p>
        </form>
        <AuthWelcome registering />
      </div>
    </div>
  );
}
