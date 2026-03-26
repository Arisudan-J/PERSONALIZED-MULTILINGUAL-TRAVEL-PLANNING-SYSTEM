import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllDestinations, searchDestinations, getFeaturedDestinations, getActiveOffers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './Dashboard.css';

const TRAVEL_TYPES = ['Solo', 'Couple', 'Family', 'Business'];

const imgSrc = (url, fallback) =>
  !url ? fallback : url.startsWith('http') ? url : `http://localhost:8080${url}`;

export default function Dashboard() {
  const [destinations, setDestinations] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDest, setSelectedDest] = useState(null);
  const [travelType, setTravelType] = useState('Family');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      getAllDestinations(),
      getFeaturedDestinations(),
      getActiveOffers(),
    ]).then(([destRes, featRes, offersRes]) => {
      setDestinations(destRes.data);
      setFeatured(featRes.data);
      setOffers(offersRes.data);
      if (location.state?.destination) {
        setSelectedDest(location.state.destination);
      }
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await searchDestinations(searchQuery);
      setDestinations(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanTrip = () => {
    if (!selectedDest) { alert('Please select a destination first!'); return; }
    navigate('/recommendations', {
      state: { destination: selectedDest, travelType, budget, duration }
    });
  };

  const DestCard = ({ dest, extra }) => (
    <div
      className={`dash-dest-card ${extra || ''} ${selectedDest?.id === dest.id ? 'selected' : ''}`}
      onClick={() => setSelectedDest(dest)}
    >
      <img
        src={imgSrc(dest.imageUrl, `https://source.unsplash.com/300x200/?india,${dest.name}`)}
        alt={dest.name}
        onError={(e) => { e.target.src = `https://source.unsplash.com/300x200/?india,${dest.name}`; }}
      />
      <div className="dash-dest-info">
        <h4>{dest.name}</h4>
        <span>{dest.state}</span>
        <span className="dest-tag">{dest.category}</span>
        {extra && <span className="featured-badge">⭐ Featured</span>}
      </div>
      {selectedDest?.id === dest.id && <div className="selected-check">✓</div>}
    </div>
  );

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        {/* Welcome Header */}
        <div className="dash-header">
          <div>
            <h1>{t('dashboard.welcome')}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p>Where would you like to travel today?</p>
          </div>
          <div className="dash-header-badge">
            <span>🇮🇳</span>
            <span>Jai Hind</span>
          </div>
        </div>

        {/* Search Panel */}
        <div className="search-panel">
          <h2>{t('dashboard.search_title')}</h2>
          <div className="search-grid">
            <div className="search-field">
              <label>🗺️ {t('dashboard.destination')}</label>
              <div className="search-input-wrap">
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search destinations..."
                  className="form-input"
                />
                <button onClick={handleSearch} className="btn-primary search-go">Search</button>
              </div>
              {selectedDest && (
                <div className="selected-dest-badge">
                  ✅ Selected: <strong>{selectedDest.name}</strong>
                  <button onClick={() => setSelectedDest(null)}>✕</button>
                </div>
              )}
            </div>
            <div className="search-field">
              <label>👥 {t('dashboard.travel_type')}</label>
              <div className="travel-type-btns">
                {TRAVEL_TYPES.map((type) => (
                  <button
                    key={type}
                    className={`travel-type-btn ${travelType === type ? 'active' : ''}`}
                    onClick={() => setTravelType(type)}
                  >
                    {type === 'Solo' ? '🚶' : type === 'Couple' ? '👫' : type === 'Family' ? '👨👩👧' : '💼'} {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-field">
              <label>💰 {t('dashboard.budget')}</label>
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 10000" className="form-input" />
            </div>
            <div className="search-field">
              <label>📅 {t('dashboard.duration')}</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3" className="form-input" />
            </div>
          </div>
          <button className="btn-primary plan-btn" onClick={handlePlanTrip}>
            {t('dashboard.search_btn')} — See Recommendations →
          </button>
        </div>

        {/* Active Offers */}
        {offers.length > 0 && (
          <div className="dash-section">
            <h2 className="section-title">🎁 Active Offers</h2>
            <div className="offers-grid">
              {offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-discount">{offer.discountPercent}% OFF</div>
                  <div className="offer-info">
                    <h4>{offer.name}</h4>
                    <p>{offer.destination?.name || 'All Destinations'}</p>
                    <span className="offer-expiry">Valid till: {offer.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Destinations */}
        {featured.length > 0 && (
          <div className="dash-section">
            <h2 className="section-title">⭐ Featured Destinations</h2>
            <div className="dash-dest-grid">
              {featured.map((dest) => <DestCard key={dest.id} dest={dest} extra="featured-card" />)}
            </div>
          </div>
        )}

        {/* All Destinations */}
        <div className="dash-section">
          <h2 className="section-title">All Destinations</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : destinations.length === 0 ? (
            <p className="no-results">No destinations found. Try a different search.</p>
          ) : (
            <div className="dash-dest-grid">
              {destinations.map((dest) => <DestCard key={dest.id} dest={dest} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
