import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDestinations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './Home.css';

const CATEGORIES = ['All', 'Hill Station', 'Beach', 'Heritage', 'Pilgrimage'];

const imgSrc = (url, fallback) =>
  !url ? fallback : url.startsWith('http') ? url : `http://localhost:8080${url}`;

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    getAllDestinations()
      .then((res) => {
        setDestinations(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    setFiltered(cat === 'All' ? destinations : destinations.filter((d) => d.category === cat));
  };

  const handleExplore = (dest) => {
    if (!user) { navigate('/login'); return; }
    navigate('/dashboard', { state: { destination: dest } });
  };

  return (
    <div className="home page-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content container">
          <div className="hero-badge">🇮🇳 Swadeshi Travel</div>
          <h1 className="hero-title">{t('home.hero_title')}</h1>
          <p className="hero-subtitle">{t('home.hero_subtitle')}</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder={t('home.search_placeholder')}
              className="hero-input"
              onKeyDown={(e) => e.key === 'Enter' && (user ? navigate('/dashboard') : navigate('/login'))}
            />
            <button className="btn-primary hero-search-btn" onClick={() => user ? navigate('/dashboard') : navigate('/login')}>
              {t('home.explore_btn')} →
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span>500+</span><p>Destinations</p></div>
            <div className="stat"><span>50K+</span><p>Happy Travelers</p></div>
            <div className="stat"><span>28</span><p>Indian States</p></div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="categories-section container">
        <h2 className="section-title">{t('home.popular')}</h2>
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => filterByCategory(cat)}
            >
              {cat === 'Hill Station' ? '🏔️' : cat === 'Beach' ? '🏖️' : cat === 'Heritage' ? '🏛️' : cat === 'Pilgrimage' ? '🛕' : '🗺️'} {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="destinations-grid">
            {filtered.map((dest, i) => (
              <div key={dest.id} className="dest-card fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="dest-img-wrapper">
                  <img src={imgSrc(dest.imageUrl, `https://source.unsplash.com/400x300/?india,${dest.name}`)} alt={dest.name} className="dest-img"
                    onError={(e) => { e.target.src = `https://source.unsplash.com/400x300/?india,${dest.name}`; }} />
                  <span className="dest-category-badge">{dest.category}</span>
                </div>
                <div className="dest-info">
                  <h3>{dest.name}</h3>
                  <p className="dest-state">📍 {dest.state}</p>
                  <p className="dest-desc">{dest.description?.slice(0, 80)}...</p>
                  <div className="dest-footer">
                    <span className="dest-cost">From ₹{dest.baseCost?.toLocaleString()}</span>
                    <button className="btn-primary dest-btn" onClick={() => handleExplore(dest)}>
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center', marginBottom:'40px'}}>Why Swadeshi Travel?</h2>
          <div className="features-grid">
            {[
              { icon: '🗺️', title: 'Custom Itinerary', desc: 'Pick your own places and build a personalized travel plan' },
              { icon: '💳', title: 'UPI Payment', desc: 'Pay easily with any UPI app - simple and secure' },
              { icon: '📄', title: 'PDF Itinerary', desc: 'Download your travel plan as a beautiful PDF' },
              { icon: '🧭', title: 'Local Guides', desc: 'Connect with expert local guides who know the region' },
              { icon: '🌐', title: 'Multilingual', desc: 'Available in English and Tamil for your comfort' },
              { icon: '🇮🇳', title: 'Made for India', desc: 'Designed specifically for Indian travelers and destinations' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>🇮🇳 Swadeshi Travel — B.Tech IT Mini Project &nbsp;|&nbsp; Made with ❤️ for India</p>
      </footer>
    </div>
  );
}
