import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  getAnalytics, adminGetUsers, adminToggleUser, adminDeleteUser,
  adminGetBookings, getAllDestinations, getPlacesByDestination,
  adminAddDestination, adminUpdateDestination, adminDeleteDestination, adminToggleFeatured,
  adminAddPlace, adminUpdatePlace, adminDeletePlace,
  getAllGuides, adminAddGuide, adminUpdateGuide, adminDeleteGuide,
  adminGetOffers, adminCreateOffer, adminUpdateOffer, adminDeleteOffer,
} from '../services/api';
import './AdminDashboard.css';

const SECTIONS = ['Analytics', 'Users', 'Destinations', 'Places', 'Guides', 'Offers', 'Bookings'];

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('Analytics');

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [offers, setOffers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal states
  const [modal, setModal] = useState(null); // { type, data }
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!isAdmin()) { navigate('/admin'); return; }
  }, [isAdmin, navigate]);

  const loadAnalytics = useCallback(async () => {
    try { const r = await getAnalytics(); setAnalytics(r.data); } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    try { const r = await adminGetUsers(); setUsers(r.data); } catch {}
  }, []);

  const loadDestinations = useCallback(async () => {
    try { const r = await getAllDestinations(); setDestinations(r.data); } catch {}
  }, []);

  const loadPlaces = useCallback(async () => {
    try {
      if (destinations.length === 0) return;
      const all = await Promise.all(destinations.map(d => getPlacesByDestination(d.id)));
      setPlaces(all.flatMap(r => r.data));
    } catch {}
  }, [destinations]);

  const loadGuides = useCallback(async () => {
    try { const r = await getAllGuides(); setGuides(r.data); } catch {}
  }, []);

  const loadOffers = useCallback(async () => {
    try { const r = await adminGetOffers(); setOffers(r.data); } catch {}
  }, []);

  const loadBookings = useCallback(async () => {
    try { const r = await adminGetBookings(dateFrom || null, dateTo || null); setBookings(r.data); } catch {}
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (active === 'Analytics') loadAnalytics();
    else if (active === 'Users') loadUsers();
    else if (active === 'Destinations') loadDestinations();
    else if (active === 'Places') { loadDestinations(); }
    else if (active === 'Guides') loadGuides();
    else if (active === 'Offers') { loadDestinations(); loadOffers(); }
    else if (active === 'Bookings') loadBookings();
  }, [active]); // eslint-disable-line

  useEffect(() => {
    if (active === 'Places' && destinations.length > 0) loadPlaces();
  }, [destinations, active, loadPlaces]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const openModal = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ---- User actions ----
  const handleToggleUser = async (id) => {
    await adminToggleUser(id); loadUsers(); flash('User status updated.');
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminDeleteUser(id); loadUsers(); flash('User deleted.');
  };

  // ---- Destination actions ----
  const handleSaveDest = async () => {
    try {
      if (form.id) await adminUpdateDestination(form.id, form);
      else await adminAddDestination(form);
      loadDestinations(); closeModal(); flash('Destination saved.');
    } catch (e) { flash('Error: ' + (e.response?.data?.error || e.message)); }
  };
  const handleDeleteDest = async (id) => {
    if (!window.confirm('Delete destination?')) return;
    await adminDeleteDestination(id); loadDestinations(); flash('Destination deleted.');
  };

  // ---- Place actions ----
  const handleSavePlace = async () => {
    try {
      const payload = { ...form, destination: { id: form.destinationId } };
      if (form.id) await adminUpdatePlace(form.id, payload);
      else await adminAddPlace(payload);
      loadPlaces(); closeModal(); flash('Place saved.');
    } catch (e) { flash('Error: ' + (e.response?.data?.error || e.message)); }
  };
  const handleDeletePlace = async (id) => {
    if (!window.confirm('Delete place?')) return;
    await adminDeletePlace(id); loadPlaces(); flash('Place deleted.');
  };

  // ---- Guide actions ----
  const handleSaveGuide = async () => {
    try {
      const payload = { ...form, destination: { id: form.destinationId } };
      if (form.id) await adminUpdateGuide(form.id, payload);
      else await adminAddGuide(payload);
      loadGuides(); closeModal(); flash('Guide saved.');
    } catch (e) { flash('Error: ' + (e.response?.data?.error || e.message)); }
  };
  const handleDeleteGuide = async (id) => {
    if (!window.confirm('Delete guide?')) return;
    await adminDeleteGuide(id); loadGuides(); flash('Guide deleted.');
  };

  // ---- Offer actions ----
  const handleSaveOffer = async () => {
    try {
      if (form.id) await adminUpdateOffer(form.id, form);
      else await adminCreateOffer(form);
      loadOffers(); closeModal(); flash('Offer saved.');
    } catch (e) { flash('Error: ' + (e.response?.data?.error || e.message)); }
  };
  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete offer?')) return;
    await adminDeleteOffer(id); loadOffers(); flash('Offer deleted.');
  };

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">🛡️ Admin Panel</div>
        <nav>
          {SECTIONS.map(s => (
            <button key={s} className={`admin-nav-btn ${active === s ? 'active' : ''}`}
              onClick={() => setActive(s)}>{s}</button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {msg && <div className="admin-flash">{msg}</div>}

        {/* ===== ANALYTICS ===== */}
        {active === 'Analytics' && analytics && (
          <div>
            <h2 className="admin-section-title">Analytics Dashboard</h2>
            <div className="stat-grid">
              <StatCard label="Total Users" value={analytics.totalUsers} icon="👥" color="#3b82f6" />
              <StatCard label="Total Destinations" value={analytics.totalDestinations} icon="🗺️" color="#10b981" />
              <StatCard label="Total Bookings" value={analytics.totalBookings} icon="📋" color="#f59e0b" />
              <StatCard label="Total Revenue" value={`₹${analytics.totalRevenue?.toFixed(0)}`} icon="💰" color="#8b5cf6" />
              <StatCard label="Active Offers" value={analytics.activeOffers} icon="🎁" color="#ef4444" />
              <StatCard label="Top Destination" value={analytics.mostBookedDestination} icon="🏆" color="#06b6d4" />
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <h3>Monthly Bookings ({new Date().getFullYear()})</h3>
                <MonthlyBarChart data={analytics.monthlyBookings} />
              </div>
              <div className="chart-card">
                <h3>Travel Type Distribution</h3>
                <TravelPieChart data={analytics.travelTypeDistribution} />
              </div>
            </div>
          </div>
        )}

        {/* ===== USERS ===== */}
        {active === 'Users' && (
          <div>
            <h2 className="admin-section-title">Manage Users</h2>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.city || '-'}</td>
                    <td><span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn-sm btn-warn" onClick={() => handleToggleUser(u.id)}>
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                      {u.role !== 'ADMIN' && (
                        <button className="btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== DESTINATIONS ===== */}
        {active === 'Destinations' && (
          <div>
            <div className="section-header">
              <h2 className="admin-section-title">Manage Destinations</h2>
              <button className="btn-primary" onClick={() => openModal('dest')}>+ Add Destination</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>State</th><th>Category</th><th>Base Cost</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {destinations.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td><td>{d.name}</td><td>{d.state}</td><td>{d.category}</td>
                    <td>₹{d.baseCost}</td>
                    <td><span className={`badge ${d.featured ? 'badge-green' : 'badge-gray'}`}>{d.featured ? 'Yes' : 'No'}</span></td>
                    <td>
                      <button className="btn-sm btn-info" onClick={() => openModal('dest', { ...d })}>Edit</button>
                      <button className="btn-sm btn-warn" onClick={async () => { await adminToggleFeatured(d.id); loadDestinations(); }}>
                        {d.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button className="btn-sm btn-danger" onClick={() => handleDeleteDest(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== PLACES ===== */}
        {active === 'Places' && (
          <div>
            <div className="section-header">
              <h2 className="admin-section-title">Manage Places</h2>
              <button className="btn-primary" onClick={() => openModal('place')}>+ Add Place</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Destination</th><th>Category</th><th>Cost</th><th>Duration</th><th>Actions</th></tr></thead>
              <tbody>
                {places.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td><td>{p.name}</td><td>{p.destination?.name}</td>
                    <td>{p.category}</td><td>₹{p.estimatedCost}</td><td>{p.visitDurationHours}h</td>
                    <td>
                      <button className="btn-sm btn-info" onClick={() => openModal('place', { ...p, destinationId: p.destination?.id })}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDeletePlace(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== GUIDES ===== */}
        {active === 'Guides' && (
          <div>
            <div className="section-header">
              <h2 className="admin-section-title">Manage Guides</h2>
              <button className="btn-primary" onClick={() => openModal('guide')}>+ Add Guide</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Destination</th><th>Languages</th><th>Experience</th><th>Charge/Day</th><th>Actions</th></tr></thead>
              <tbody>
                {guides.map(g => (
                  <tr key={g.id}>
                    <td>{g.id}</td><td>{g.name}</td><td>{g.destination?.name}</td>
                    <td>{g.languages}</td><td>{g.experience}</td><td>₹{g.perDayCharge}</td>
                    <td>
                      <button className="btn-sm btn-info" onClick={() => openModal('guide', { ...g, destinationId: g.destination?.id })}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDeleteGuide(g.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== OFFERS ===== */}
        {active === 'Offers' && (
          <div>
            <div className="section-header">
              <h2 className="admin-section-title">Offer Management</h2>
              <button className="btn-primary" onClick={() => openModal('offer', { status: 'ACTIVE' })}>+ Add Offer</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Discount</th><th>Destination</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {offers.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td><td>{o.name}</td><td>{o.discountPercent}%</td>
                    <td>{o.destination?.name || 'All'}</td><td>{o.expiryDate}</td>
                    <td><span className={`badge ${o.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{o.status}</span></td>
                    <td>
                      <button className="btn-sm btn-info" onClick={() => openModal('offer', { ...o, destinationId: o.destination?.id })}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDeleteOffer(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== BOOKINGS ===== */}
        {active === 'Bookings' && (
          <div>
            <h2 className="admin-section-title">Manage Bookings</h2>
            <div className="filter-row">
              <label>From: <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></label>
              <label>To: <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></label>
              <button className="btn-primary" onClick={loadBookings}>Filter</button>
              <button className="btn-secondary" onClick={() => { setDateFrom(''); setDateTo(''); loadBookings(); }}>Clear</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>User</th><th>Destination</th><th>Travel Type</th><th>Cost</th><th>Payment</th><th>Date</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.user?.name}</td>
                    <td>{b.destination?.name}</td>
                    <td>{b.travelType}</td>
                    <td>₹{b.totalCost?.toFixed(0)}</td>
                    <td><span className={`badge ${b.paymentStatus === 'SUCCESS' ? 'badge-green' : b.paymentStatus === 'FAILED' ? 'badge-red' : 'badge-warn'}`}>{b.paymentStatus}</span></td>
                    <td>{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ===== MODALS ===== */}
      {modal === 'dest' && (
        <Modal title={form.id ? 'Edit Destination' : 'Add Destination'} onClose={closeModal} onSave={handleSaveDest}>
          <Field label="Name" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} />
          <Field label="State" value={form.state || ''} onChange={v => setForm({ ...form, state: v })} />
          <Field label="Category" value={form.category || ''} onChange={v => setForm({ ...form, category: v })} />
          <Field label="Base Cost" type="number" value={form.baseCost || ''} onChange={v => setForm({ ...form, baseCost: v })} />
          <ImageUploader label="Destination Image" value={form.imageUrl || ''} onChange={v => setForm({ ...form, imageUrl: v })} />
          <Field label="Description" value={form.description || ''} onChange={v => setForm({ ...form, description: v })} textarea />
        </Modal>
      )}

      {modal === 'place' && (
        <Modal title={form.id ? 'Edit Place' : 'Add Place'} onClose={closeModal} onSave={handleSavePlace}>
          <Field label="Name" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} />
          <Field label="Category" value={form.category || ''} onChange={v => setForm({ ...form, category: v })} />
          <Field label="Estimated Cost (₹)" type="number" value={form.estimatedCost || ''} onChange={v => setForm({ ...form, estimatedCost: v })} />
          <Field label="Visit Duration (hrs)" type="number" value={form.visitDurationHours || ''} onChange={v => setForm({ ...form, visitDurationHours: v })} />
          <ImageUploader label="Place Image" value={form.imageUrl || ''} onChange={v => setForm({ ...form, imageUrl: v })} />
          <div className="modal-field">
            <label>Destination</label>
            <select value={form.destinationId || ''} onChange={e => setForm({ ...form, destinationId: e.target.value })}>
              <option value="">Select destination</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <Field label="Description" value={form.description || ''} onChange={v => setForm({ ...form, description: v })} textarea />
        </Modal>
      )}

      {modal === 'guide' && (
        <Modal title={form.id ? 'Edit Guide' : 'Add Guide'} onClose={closeModal} onSave={handleSaveGuide}>
          <Field label="Name" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} />
          <Field label="Languages" value={form.languages || ''} onChange={v => setForm({ ...form, languages: v })} />
          <Field label="Contact" value={form.contact || ''} onChange={v => setForm({ ...form, contact: v })} />
          <Field label="Experience" value={form.experience || ''} onChange={v => setForm({ ...form, experience: v })} />
          <Field label="Per Day Charge (₹)" type="number" value={form.perDayCharge || ''} onChange={v => setForm({ ...form, perDayCharge: v })} />
          <ImageUploader label="Guide Photo" value={form.imageUrl || ''} onChange={v => setForm({ ...form, imageUrl: v })} />
          <div className="modal-field">
            <label>Destination</label>
            <select value={form.destinationId || ''} onChange={e => setForm({ ...form, destinationId: e.target.value })}>
              <option value="">Select destination</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal === 'offer' && (
        <Modal title={form.id ? 'Edit Offer' : 'Add Offer'} onClose={closeModal} onSave={handleSaveOffer}>
          <Field label="Offer Name" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} />
          <Field label="Discount %" type="number" value={form.discountPercent || ''} onChange={v => setForm({ ...form, discountPercent: v })} />
          <Field label="Expiry Date" type="date" value={form.expiryDate || ''} onChange={v => setForm({ ...form, expiryDate: v })} />
          <div className="modal-field">
            <label>Destination</label>
            <select value={form.destinationId || ''} onChange={e => setForm({ ...form, destinationId: e.target.value })}>
              <option value="">All Destinations</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label>Status</label>
            <select value={form.status || 'ACTIVE'} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---- Sub-components ----

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function MonthlyBarChart({ data }) {
  if (!data || Object.keys(data).length === 0) return <p className="no-data">No data yet</p>;
  const chartData = Object.entries(data).map(([month, count]) => ({ month, count }));
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bookings" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TravelPieChart({ data }) {
  if (!data || Object.keys(data).length === 0) return <p className="no-data">No data yet</p>;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
          {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', textarea }) {
  return (
    <div className="modal-field">
      <label>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}
