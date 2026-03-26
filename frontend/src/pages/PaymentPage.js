import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { processPayment } from '../services/api';
import { useLang } from '../context/LangContext';
import './PaymentPage.css';

export default function PaymentPage() {
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'failed'

  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    navigate('/dashboard');
    return null;
  }

  const handlePayment = async () => {
    if (!upiId.trim()) { alert('Please enter a UPI ID'); return; }
    setLoading(true);
    try {
      const res = await processPayment({ bookingId: booking.bookingId, upiId });
      if (res.data.paymentStatus === 'SUCCESS') {
        setStatus('success');
        setTimeout(() => navigate('/itinerary', { state: { booking: res.data } }), 2000);
      } else {
        setStatus('failed');
      }
    } catch (err) {
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page page-wrapper">
      <div className="container">
        <div className="payment-layout">

          {/* Booking Summary */}
          <div className="payment-summary-card">
            <h2>Booking Summary</h2>
            <div className="summary-dest">
              <div className="summary-dest-icon">
                {booking.destinationName?.[0]}
              </div>
              <div>
                <h3>{booking.destinationName}</h3>
                <p>{booking.travelType} Trip</p>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>Booking ID</span>
                <strong>#{booking.bookingId}</strong>
              </div>
              <div className="detail-row">
                <span>Travel Type</span>
                <strong>{booking.travelType}</strong>
              </div>
              <div className="detail-row">
                <span>Places Selected</span>
                <strong>{booking.selectedPlaces?.length || 0}</strong>
              </div>
              <div className="detail-row">
                <span>Total Duration</span>
                <strong>{booking.totalDurationHours?.toFixed(1)} hours</strong>
              </div>
            </div>

            <div className="selected-places-list">
              <h4>Selected Places</h4>
              {booking.selectedPlaces?.map((p) => (
                <div key={p.id} className="place-row">
                  <span>{p.name}</span>
                  <span>Rs. {p.estimatedCost}</span>
                </div>
              ))}
            </div>

            <div className="payment-total">
              {booking.discountPercent > 0 && (
                <>
                  <div className="payment-total-row">
                    <span>Original Cost</span>
                    <span>Rs. {booking.originalCost?.toLocaleString()}</span>
                  </div>
                  <div className="payment-total-row discount-row">
                    <span>Discount ({booking.discountPercent}% OFF)</span>
                    <span>- Rs. {booking.discountAmount?.toFixed(0)}</span>
                  </div>
                </>
              )}
              <div className="payment-total-row final-row">
                <span>Total Amount</span>
                <strong>Rs. {booking.totalCost?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-card">
            {status === 'success' ? (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p>Redirecting to your itinerary...</p>
              </div>
            ) : status === 'failed' ? (
              <div className="payment-failed">
                <div className="failed-icon">✗</div>
                <h2>Payment Failed</h2>
                <p>Please check your UPI ID and try again.</p>
                <button className="btn-primary" onClick={() => setStatus(null)}>Try Again</button>
              </div>
            ) : (
              <>
                <h2>{t('payment.title')}</h2>
                <p className="payment-sub">Complete your payment securely using UPI</p>

                <div className="upi-logos">
                  <span>GPay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span>
                </div>

                <div className="upi-form">
                  <label>{t('payment.upi_label')}</label>
                  <div className="upi-input-wrap">
                    <span className="upi-icon">@</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder={t('payment.upi_placeholder')}
                      className="form-input upi-input"
                    />
                  </div>
                  <p className="upi-hint">
                    Example: yourname@okicici, yourname@ybl, yourname@paytm
                  </p>
                </div>

                <div className="amount-display">
                  <span>Amount to Pay</span>
                  <strong>Rs. {booking.totalCost?.toLocaleString()}</strong>
                </div>

                <button
                  className="btn-primary pay-btn"
                  onClick={handlePayment}
                  disabled={loading || !upiId}
                >
                  {loading ? 'Processing...' : `${t('payment.pay_btn')} - Rs. ${booking.totalCost?.toLocaleString()}`}
                </button>

                <p className="demo-note">{t('payment.demo_note')}</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
