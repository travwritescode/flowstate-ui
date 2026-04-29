import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
        saveToken(data.access_token);
        navigate('/tasks');
      } else {
        await register(email, password);
        const data = await login(email, password);
        saveToken(data.access_token);
        navigate('/tasks');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Invalid email or password.');
      } else if (status === 409) {
        setError('An account with that email already exists.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(isLogin ? 'register' : 'login');
    setError('');
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button type="button" className="btn-link" onClick={toggleMode}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Sign In'}
        </button>
      </div>
    </main>
  );
}
