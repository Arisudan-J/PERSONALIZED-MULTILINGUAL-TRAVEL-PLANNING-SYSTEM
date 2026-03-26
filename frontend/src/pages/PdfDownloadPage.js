import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { downloadPdf } from '../services/api';
import { useLang } from '../context/LangContext';
import './PdfDownloadPage.css';

export default function PdfDownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    navigate('/dashboard');
    return null;
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPdf(booking.bookingId);
    } catch (err) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pdf-page page-wrapper">
      <div className="container">
        <div className="pdf-card">
          <div className="pdf-success-banner">
            <div className="pdf-check">✓</div>
            <h1>{t('pdf.title')}</h1>
            <p>Your travel plan for <strong>{booking.destinationName}</strong> is ready to download</p>
          </div>

          <div className="pdf-booking-grid">
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.booking_id')}</span>
              <strong>#{booking.bookingId}</strong>
            </div>
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.destination')}</span>
              <strong>{booking.destinationName}</strong>
            </div>
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.travel_type')}</span>
              <strong>{booking.travelType}</strong>
            </div>
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.total_cost')}</span>
              <strong>Rs. {booking.totalCost?.toLocaleString()}</strong>
            </div>
            {booking.discountPercent > 0 && (
              <>
                <div className="pdf-booking-item">
                  <span className="pdf-label">Original Cost</span>
                  <strong>Rs. {booking.originalCost?.toLocaleString()}</strong>
                </div>
                <div className="pdf-booking-item" style={{color:'#16a34a'}}>
                  <span className="pdf-label">Discount Applied</span>
                  <strong>{booking.discountPercent}% OFF (-Rs. {booking.discountAmount?.toFixed(0)})</strong>
                </div>
              </>
            )}
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.duration')}</span>
              <strong>{booking.totalDurationHours?.toFixed(1)} hours</strong>
            </div>
            <div className="pdf-booking-item">
              <span className="pdf-label">{t('pdf.date')}</span>
              <strong>{booking.bookingDate}</strong>
            </div>
          </div>

          <div className="pdf-places-preview">
            <h3>Places in Your Itinerary</h3>
            <div className="pdf-places-list">
              {booking.selectedPlaces?.map((p, i) => (
                <div key={p.id} className="pdf-place-row">
                  <span className="pdf-place-num">{i + 1}</span>
                  <span className="pdf-place-name">{p.name}</span>
                  <span className="pdf-place-cat">{p.category}</span>
                  <span className="pdf-place-cost">Rs. {p.estimatedCost}</span>
                  <span className="pdf-place-time">{p.visitDurationHours}h</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdf-actions">
            <button className="btn-primary pdf-download-btn" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Preparing PDF...' : `${t('pdf.download_btn')} (PDF)`}
            </button>
            <button className="btn-outline" onClick={() => navigate('/dashboard')}>
              {t('pdf.new_trip')}
            </button>
            <button className="btn-outline" onClick={() => navigate('/profile')}>
              View My Trips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
