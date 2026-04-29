import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function validate(email, password) {
  const errors = {};
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
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
        setApiError('Invalid email or password.');
      } else if (status === 409) {
        setApiError('An account with that email already exists.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(isLogin ? 'register' : 'login');
    setFieldErrors({});
    setApiError('');
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>

        {apiError && (
          <p role="alert" className="error-message">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              required
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="field-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              required
              minLength={8}
            />
            {fieldErrors.password && (
              <p id="password-error" role="alert" className="field-error">
                {fieldErrors.password}
              </p>
            )}
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
