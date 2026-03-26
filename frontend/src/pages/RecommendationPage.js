import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPlacesByDestination, getGuidesByDestination, createBooking } from '../services/api';
import { useLang } from '../context/LangContext';
import './RecommendationPage.css';

const imgSrc = (url, fallback) =>
  !url ? fallback : url.startsWith('http') ? url : `http://localhost:8080${url}`;

export default function RecommendationPage() {
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, travelType } = location.state || {};

  useEffect(() => {
    if (!destination) { navigate('/dashboard'); return; }
    Promise.all([
      getPlacesByDestination(destination.id),
      getGuidesByDestination(destination.id),
    ]).then(([placesRes, guidesRes]) => {
      setPlaces(placesRes.data);
      setGuides(guidesRes.data);
    }).finally(() => setLoading(false));
  }, [destination]);

  const togglePlace = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedPlaces = places.filter((p) => selectedIds.includes(p.id));
  const totalCost = selectedPlaces.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const totalHours = selectedPlaces.reduce((sum, p) => sum + (p.visitDurationHours || 0), 0);

  const handleConfirm = async () => {
    if (selectedIds.length === 0) { alert('Please select at least one place!'); return; }
    setSubmitting(true);
    try {
      const res = await createBooking({
        destinationId: destination.id,
        travelType: travelType || 'Family',
        selectedPlaceIds: selectedIds,
      });
      navigate('/payment', { state: { booking: res.data } });
    } catch (err) {
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }}></div>;

  return (
    <div className="recommend-page page-wrapper">
      <div className="container">
        <div className="recommend-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>Back</button>
          <div>
            <h1>{t('recommend.title')}</h1>
            <p>Destination: {destination?.name} | Travel Type: {travelType}</p>
          </div>
        </div>

        <div className="recommend-layout">
          <div className="places-section">
            <h2>{t('recommend.subtitle')}</h2>
            <div className="places-grid">
              {places.map((place) => {
                const isSelected = selectedIds.includes(place.id);
                return (
                  <div
                    key={place.id}
                    className={`place-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => togglePlace(place.id)}
                  >
                    <div className="place-img-wrap">
                      <img src={imgSrc(place.imageUrl, 'https://via.placeholder.com/400x250?text=' + place.name)} alt={place.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=' + place.name; }} />
                      <div className={`place-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </div>
                      <span className="place-category">{place.category}</span>
                    </div>
                    <div className="place-info">
                      <h3>{place.name}</h3>
                      <p>{place.description}</p>
                      <div className="place-meta">
                        <span className="place-cost">Rs. {place.estimatedCost}</span>
                        <span className="place-time">{place.visitDurationHours} hrs</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {guides.length > 0 && (
              <div className="guides-section">
                <h2>Local Guides for {destination?.name}</h2>
                <div className="guides-grid">
                  {guides.map((g) => (
                    <div key={g.id} className="guide-card">
                      <div className="guide-avatar">
                        {g.imageUrl
                          ? <img src={g.imageUrl.startsWith('http') ? g.imageUrl : `http://localhost:8080${g.imageUrl}`} alt={g.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                          : g.name?.[0]
                        }
                      </div>
                      <div className="guide-info">
                        <h4>{g.name}</h4>
                        <p>Languages: {g.languages}</p>
                        <p>Experience: {g.experience}</p>
                        <p className="guide-cost">Rs. {g.perDayCharge}/day</p>
                        <p className="guide-contact">Contact: {g.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="summary-panel">
            <h3>Your Selection</h3>
            <div className="summary-count">{selectedIds.length} places selected</div>
            {selectedPlaces.length === 0 ? (
              <p className="summary-empty">Click on places to add them to your plan</p>
            ) : (
              <ul className="summary-list">
                {selectedPlaces.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span>Rs. {p.estimatedCost}</span>
                  </li>
                ))}
              </ul>
            )}
            <hr />
            <div className="summary-total">
              <div className="summary-row">
                <span>Total Cost</span>
                <strong>Rs. {totalCost.toLocaleString()}</strong>
              </div>
              <div className="summary-row">
                <span>Total Duration</span>
                <strong>{totalHours.toFixed(1)} hrs</strong>
              </div>
            </div>
            <button
              className="btn-primary confirm-btn"
              onClick={handleConfirm}
              disabled={submitting || selectedIds.length === 0}
            >
              {submitting ? 'Creating Plan...' : t('recommend.confirm_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
