import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, getMyBookings, downloadPdf } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const { user } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    Promise.all([getProfile(), getMyBookings()])
      .then(([profileRes, bookingsRes]) => {
        setProfile(profileRes.data);
        setForm(profileRes.data);
        setBookings(bookingsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: form.name, phone: form.phone, city: form.city, preferredLanguage: form.preferredLanguage });
      setProfile({ ...profile, ...form });
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }}></div>;

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <div className="profile-layout">

          {/* Left Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar-large">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <h3>{profile?.name}</h3>
            <p>{profile?.email}</p>
            <p className="profile-city">{profile?.city}</p>

            <div className="profile-tabs">
              <button
                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Info
              </button>
              <button
                className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
                onClick={() => setActiveTab('trips')}
              >
                My Trips ({bookings.length})
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            {activeTab === 'profile' ? (
              <div className="profile-info-card">
                <div className="profile-card-header">
                  <h2>{t('profile.title')}</h2>
                  {!editing ? (
                    <button className="btn-outline edit-btn" onClick={() => setEditing(true)}>
                      {t('profile.edit_btn')}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                      <button className="btn-primary edit-btn" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : t('profile.save_btn')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label>{t('profile.name')}</label>
                    {editing ? (
                      <input className="form-input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    ) : (
                      <span>{profile?.name}</span>
                    )}
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <span>{profile?.email}</span>
                  </div>
                  <div className="profile-field">
                    <label>{t('profile.phone')}</label>
                    {editing ? (
                      <input className="form-input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
                    ) : (
                      <span>{profile?.phone || 'Not set'}</span>
                    )}
                  </div>
                  <div className="profile-field">
                    <label>{t('profile.city')}</label>
                    {editing ? (
                      <input className="form-input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                    ) : (
                      <span>{profile?.city || 'Not set'}</span>
                    )}
                  </div>
                  <div className="profile-field">
                    <label>{t('profile.language')}</label>
                    {editing ? (
                      <select className="form-input" value={form.preferredLanguage || 'en'} onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}>
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                      </select>
                    ) : (
                      <span>{profile?.preferredLanguage === 'ta' ? 'தமிழ் (Tamil)' : profile?.preferredLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="trips-section">
                <h2>{t('profile.trip_history')}</h2>
                {bookings.length === 0 ? (
                  <div className="no-trips">
                    <p>No trips booked yet. Start planning your first trip!</p>
                  </div>
                ) : (
                  <div className="trips-list">
                    {bookings.map((b) => (
                      <div key={b.bookingId} className="trip-card">
                        <div className="trip-card-left">
                          <div className="trip-dest-icon">{b.destinationName?.[0]}</div>
                          <div>
                            <h4>{b.destinationName}</h4>
                            <p>{b.travelType} · {b.selectedPlaces?.length} places</p>
                            <p className="trip-date">{b.bookingDate}</p>
                          </div>
                        </div>
                        <div className="trip-card-right">
                          <div className={`trip-status ${b.paymentStatus?.toLowerCase()}`}>
                            {b.paymentStatus}
                          </div>
                          <strong>Rs. {b.totalCost?.toLocaleString()}</strong>
                          {b.paymentStatus === 'SUCCESS' && (
                            <button className="btn-outline download-trip-btn"
                              onClick={() => downloadPdf(b.bookingId)}>
                              Download PDF
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
