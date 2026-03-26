import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '', preferredLanguage: 'en'
  });
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
      const res = await registerUser(form);
      const { token, name, email, userId, preferredLanguage } = res.data;
      login({ name, email, userId, preferredLanguage }, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">🇮🇳 Swadeshi Travel</div>
          <h1>Join India's Travel Community</h1>
          <p>Create your account and start discovering the incredible destinations India has to offer.</p>
          <div className="auth-illustration">✈️🌄🗺️🎒</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>{t('nav.register')}</h2>
          <p className="auth-sub">Create your free account</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>{t('profile.name')}</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" required className="form-input" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Create a strong password" required className="form-input" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('profile.phone')}</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="10-digit number" className="form-input" />
              </div>
              <div className="form-group">
                <label>{t('profile.city')}</label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  placeholder="Your city" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label>{t('profile.language')}</label>
              <select name="preferredLanguage" value={form.preferredLanguage}
                onChange={handleChange} className="form-input">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : `Create Account →`}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">{t('nav.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
