import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, switchLang, currentLang, LANGUAGES } = useLang();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleLangSwitch = (code) => {
    switchLang(code);
    setLangDropdownOpen(false);
  };

  const navLinks = [
    { label: t('nav.flights'), icon: '✈️' },
    { label: t('nav.buses'), icon: '🚌' },
    { label: t('nav.hotels'), icon: '🏨' },
    { label: t('nav.packages'), icon: '📦' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-flag">🇮🇳</span>
          <span className="brand-name">Swadeshi<span>Travel</span></span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <button key={link.label} className="nav-link">
              <span>{link.icon}</span> {link.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">

          {/* ── Language Switcher Dropdown ── */}
          <div className="lang-dropdown-wrap">
            <button
              className="lang-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <span>{currentLang.flag}</span>
              <span className="lang-native">{currentLang.nativeLabel}</span>
              <span className="lang-arrow">▾</span>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown">
                <div className="lang-dropdown-title">Choose Language</div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    className={`lang-option ${lang === l.code ? 'active' : ''}`}
                    onClick={() => handleLangSwitch(l.code)}
                  >
                    <span className="lang-option-flag">{l.flag}</span>
                    <div className="lang-option-text">
                      <span className="lang-option-native">{l.nativeLabel}</span>
                      <span className="lang-option-english">{l.label}</span>
                    </div>
                    {lang === l.code && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="profile-avatar">{user.name?.[0]?.toUpperCase()}</span>
                <span className="profile-name">{user.name?.split(' ')[0]}</span>
                <span>▾</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                    🗺️ Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                    👤 {t('nav.profile')}
                  </Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-outline" style={{padding:'8px 20px', fontSize:'14px'}}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary" style={{padding:'8px 20px', fontSize:'14px'}}>
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
