import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import './ImageUploader.css';

const API_BASE = 'http://localhost:8080';

export default function ImageUploader({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.data.imageUrl);
    } catch (err) {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = value
    ? value.startsWith('http') ? value : `${API_BASE}${value}`
    : null;

  return (
    <div className="img-uploader">
      <label className="img-uploader-label">{label}</label>

      {previewSrc && (
        <div className="img-preview-wrap">
          <img src={previewSrc} alt="preview" className="img-preview"
            onError={(e) => { e.target.style.display = 'none'; }} />
          <button className="img-remove-btn" onClick={() => onChange('')} title="Remove">✕</button>
        </div>
      )}

      <div className="img-upload-row">
        <label className="img-pick-btn">
          {uploading ? 'Uploading...' : '📁 Choose Image'}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} hidden />
        </label>
        <span className="img-or">or</span>
        <input
          type="text"
          className="img-url-input"
          placeholder="Paste image URL"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="img-error">{error}</p>}
    </div>
  );
}
