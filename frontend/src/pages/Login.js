import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, name, email, userId, preferredLanguage } = res.data;
      login({ name, email, userId, preferredLanguage }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">🇮🇳 Swadeshi Travel</div>
          <h1>Welcome Back, Explorer!</h1>
          <p>Your next Indian adventure awaits. Log in to continue planning your perfect trip.</p>
          <div className="auth-illustration">🏔️🏖️🛕🏛️</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>{t('nav.login')}</h2>
          <p className="auth-sub">Enter your credentials to continue</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                required className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Enter password"
                required className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : `${t('nav.login')} →`}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">{t('nav.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
