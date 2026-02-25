
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function AddTractorPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    model_name: '',
    hp: '',
    year: '',
    fuel_type: 'diesel',
    description: '',
    rent_price_per_hour: '',
    rent_price_per_acre: '',
    sell_price: '',
    driver_available: false,
    driver_charges: '',
    location: '',
    state: '',
    district: '',
    pincode: '',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    // Max 5 images
    if (files.length > 5) {
      setError('Maximum 5 images allowed.');
      return;
    }

    setImages(files);

    // Create previews
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use FormData to send images + fields together
      const data = new FormData();

      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach(image => {
        data.append('uploaded_images', image);
      });

      await API.post('/tractors/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msg = Object.values(data).flat().join(' ');
        setError(msg);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={styles.successContainer}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={styles.successTitle}>Tractor Listed Successfully!</h2>
        <p style={styles.successText}>
          Your tractor is now visible to farmers.
        </p>
        <div style={styles.successActions}>
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.dashboardBtn}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setImages([]);
              setPreviews([]);
              setFormData({
                brand: '', model_name: '', hp: '', year: '',
                fuel_type: 'diesel', description: '',
                rent_price_per_hour: '', rent_price_per_acre: '',
                sell_price: '', driver_available: false,
                driver_charges: '', location: '', state: '',
                district: '', pincode: '',
              });
            }}
            style={styles.addAnotherBtn}
          >
            Add Another Tractor
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>

      <Link to="/dashboard" style={styles.backLink}>
        ← Back to Dashboard
      </Link>

      <h1 style={styles.pageTitle}>🚜 Add New Tractor</h1>

      <div style={styles.formCard}>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* SECTION 1 — Photos */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📷 Tractor Photos</h3>
            <p style={styles.sectionNote}>
              Upload up to 5 photos. First photo will be the cover image.
            </p>

            {/* Upload box */}
            <label style={styles.uploadBox}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                style={{ display: 'none' }}
              />
              <div style={styles.uploadContent}>
                <span style={styles.uploadIcon}>📷</span>
                <span style={styles.uploadText}>
                  Click to upload photos
                </span>
                <span style={styles.uploadHint}>
                  JPG, PNG up to 5MB each • Max 5 photos
                </span>
              </div>
            </label>

            {/* Image previews */}
            {previews.length > 0 && (
              <div style={styles.previewGrid}>
                {previews.map((url, index) => (
                  <div key={index} style={styles.previewItem}>
                    <img
                      src={url}
                      alt={`preview ${index}`}
                      style={styles.previewImage}
                    />
                    {index === 0 && (
                      <span style={styles.coverBadge}>Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2 — Basic Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📋 Basic Information</h3>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Brand *</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Mahindra, John Deere, Sonalika..."
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Model Name *</label>
                <input
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                  placeholder="575 DI, 5050 D..."
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Horsepower (HP) *</label>
                <input
                  name="hp"
                  type="number"
                  value={formData.hp}
                  onChange={handleChange}
                  placeholder="45"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Year *</label>
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2020"
                  required
                  min="1990"
                  max={new Date().getFullYear()}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Fuel Type *</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your tractor condition, features, attachments..."
                rows={3}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* SECTION 3 — Pricing */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💰 Pricing</h3>
            <p style={styles.sectionNote}>Fill rent price, sell price or both</p>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rent Per Hour (₹)</label>
                <input
                  name="rent_price_per_hour"
                  type="number"
                  value={formData.rent_price_per_hour}
                  onChange={handleChange}
                  placeholder="500"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rent Per Acre (₹)</label>
                <input
                  name="rent_price_per_acre"
                  type="number"
                  value={formData.rent_price_per_acre}
                  onChange={handleChange}
                  placeholder="800"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Selling Price (₹)</label>
                <input
                  name="sell_price"
                  type="number"
                  value={formData.sell_price}
                  onChange={handleChange}
                  placeholder="500000"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                name="driver_available"
                id="driver"
                checked={formData.driver_available}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <label htmlFor="driver" style={styles.checkboxLabel}>
                Driver Available with Tractor
              </label>
            </div>

            {formData.driver_available && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Driver Charges (₹)</label>
                <input
                  name="driver_charges"
                  type="number"
                  value={formData.driver_charges}
                  onChange={handleChange}
                  placeholder="300"
                  style={styles.input}
                />
              </div>
            )}
          </div>

          {/* SECTION 4 — Location */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Location</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Village / City *</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Village Khanna"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State *</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Punjab"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>District *</label>
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Ludhiana"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pincode *</label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="141001"
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Adding Tractor...' : '🚜 Add Tractor'}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
  backLink: { color: '#15803d', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
  pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '16px 0 24px' },
  formCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
  section: { marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f3f4f6' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px', marginTop: '0' },
  sectionNote: { fontSize: '13px', color: '#6b7280', marginBottom: '16px', marginTop: '0' },
  uploadBox: { display: 'block', border: '2px dashed #d1d5db', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb', marginBottom: '16px' },
  uploadContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  uploadIcon: { fontSize: '40px' },
  uploadText: { fontSize: '16px', fontWeight: '600', color: '#374151' },
  uploadHint: { fontSize: '13px', color: '#6b7280' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
  previewItem: { position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' },
  previewImage: { width: '100%', height: '100%', objectFit: 'cover' },
  coverBadge: { position: 'absolute', bottom: '4px', left: '4px', backgroundColor: '#15803d', color: 'white', fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' },
  removeBtn: { position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  row: { display: 'flex', gap: '12px' },
  inputGroup: { flex: 1, marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' },
  checkboxGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  checkboxLabel: { fontSize: '15px', color: '#15803d', fontWeight: '500', cursor: 'pointer' },
  submitBtn: { width: '100%', backgroundColor: '#15803d', color: 'white', padding: '16px', borderRadius: '10px', fontSize: '18px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  successContainer: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  successCard: { backgroundColor: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '480px', width: '100%' },
  successIcon: { fontSize: '64px', marginBottom: '16px' },
  successTitle: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px' },
  successText: { color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' },
  successActions: { display: 'flex', gap: '12px', flexDirection: 'column' },
  dashboardBtn: { backgroundColor: '#15803d', color: 'white', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  addAnotherBtn: { backgroundColor: 'white', color: '#15803d', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', border: '2px solid #15803d', cursor: 'pointer' },
};
