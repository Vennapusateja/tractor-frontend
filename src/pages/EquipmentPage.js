
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import useSlowBackend from '../hooks/useSlowBackend';
import SlowBackendBanner from '../components/SlowBackendBanner';

const MEDIA_BASE = (process.env.REACT_APP_API_URL || 'https://tractor-backend-eey5.onrender.com/api').replace('/api', '');
const TRACTOR_PLACEHOLDERS = [
  '/images/tractor1.png',
  '/images/tractor2.png',
  '/images/tractor3.png',
];
const getPlaceholder = (id) => TRACTOR_PLACEHOLDERS[(id || 0) % TRACTOR_PLACEHOLDERS.length];

export default function EquipmentPage() {
  const { user } = useAuth();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const slowWarning = useSlowBackend(loading);

  const [formData, setFormData] = useState({
    name: '', type: 'rotavator', brand: '', description: '',
    rent_price: '', sell_price: '', location: '', state: '', district: '',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchEquipment();
    // eslint-disable-next-line
  }, []);

  const fetchEquipment = async (params = {}) => {
    setLoading(true);
    try {
      const res = await API.get('/equipment/', { params });
      const data = res.data;
      if (Array.isArray(data)) {
        setEquipment(data);
      } else if (data.results && Array.isArray(data.results)) {
        setEquipment(data.results);
      } else {
        setEquipment([]);
      }
    } catch {
      setError('Failed to load equipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchEquipment({ search, type: typeFilter });

  const handleReset = () => {
    setSearch('');
    setTypeFilter('');
    fetchEquipment();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') data.append(key, formData[key]);
      });
      images.forEach(img => data.append('images', img));
      await API.post('/equipment/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Equipment listed successfully!');
      setShowForm(false);
      setFormData({
        name: '', type: 'rotavator', brand: '', description: '',
        rent_price: '', sell_price: '', location: '', state: '', district: '',
      });
      setImages([]);
      setPreviews([]);
      fetchEquipment();
    } catch {
      setError('Failed to list equipment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const equipmentTypes = [
    { value: '', label: 'All Types' },
    { value: 'plow', label: '🌾 Plow' },
    { value: 'cultivator', label: '🔧 Cultivator' },
    { value: 'seeder', label: '🌱 Seeder' },
    { value: 'harvester', label: '🌾 Harvester' },
    { value: 'sprayer', label: '💧 Sprayer' },
    { value: 'trailer', label: '🚛 Trailer' },
    { value: 'rotavator', label: '⚙️ Rotavator' },
    { value: 'other', label: '📦 Other' },
  ];

  const typeEmoji = {
    plow: '🌾', cultivator: '🔧', seeder: '🌱',
    harvester: '🌾', sprayer: '💧', trailer: '🚛',
    rotavator: '⚙️', other: '📦',
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔧 Farm Equipment</h1>
          <p style={styles.subtitle}>Browse and list farm equipment for rent or sale</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} style={styles.listBtn}>
            {showForm ? '✕ Cancel' : '➕ List Your Equipment'}
          </button>
        )}
      </div>

      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ List New Equipment</h3>
          <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Photos</label>
              <label style={styles.uploadBox}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  style={{ display: 'none' }}
                />
                <div style={styles.uploadContent}>
                  <span style={{ fontSize: '28px' }}>📷</span>
                  <span style={styles.uploadText}>Click to upload photos</span>
                </div>
              </label>
              {previews.length > 0 && (
                <div style={styles.previewGrid}>
                  {previews.map((url, i) => (
                    <div key={i} style={styles.previewItem}>
                      <img src={url} alt="" style={styles.previewImage} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={styles.removeBtn}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Equipment Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rotavator, Cultivator..."
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={styles.input}
                >
                  {equipmentTypes.slice(1).map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Brand</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Fieldking, Sonalika..."
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Condition, size, features..."
                rows={2}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rent Price (₹/day)</label>
                <input
                  name="rent_price"
                  type="number"
                  value={formData.rent_price}
                  onChange={handleChange}
                  placeholder="400"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sell Price (₹)</label>
                <input
                  name="sell_price"
                  type="number"
                  value={formData.sell_price}
                  onChange={handleChange}
                  placeholder="85000"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Location *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Village/City"
                  required
                  style={styles.input}
                />
              </div>
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={styles.submitBtn}
            >
              {submitting ? 'Listing...' : '➕ List Equipment'}
            </button>

          </form>
        </div>
      )}

      <div style={styles.searchBox}>
        <input
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.searchInput}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.typeSelect}
        >
          {equipmentTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
        <button onClick={handleReset} style={styles.resetBtn}>Reset</button>
      </div>

      {!loading && (
        <p style={styles.count}>
          {equipment.length} item{equipment.length !== 1 ? 's' : ''} found
        </p>
      )}

      <SlowBackendBanner show={slowWarning} />
      {loading && <div style={styles.loading}>Loading equipment...</div>}

      {!loading && equipment.length === 0 && (
        <div style={styles.empty}>
          <img src="/images/tractor3.png" alt="No equipment" style={{ width: '160px', borderRadius: '12px', marginBottom: '12px', opacity: 0.7 }} />
          <h3>No equipment found</h3>
          <p>Be the first to list your equipment!</p>
        </div>
      )}

      <div style={styles.grid}>
        {equipment.map(item => (
          <div key={item.id} style={styles.card}>

            <div style={styles.imageBox}>
              {item.images && item.images.length > 0 ? (
                <img
                  src={`${MEDIA_BASE}${item.images[0].image}`}
                  alt={item.name}
                  style={styles.image}
                />
              ) : (
                <img
                  src={getPlaceholder(item.id)}
                  alt={item.name || 'Equipment'}
                  style={styles.image}
                />
              )}
              <span style={styles.typeBadge}>
                {typeEmoji[item.type]} {item.type}
              </span>
            </div>

            <div style={styles.cardInfo}>
              <h3 style={styles.itemName}>{item.name}</h3>
              {item.brand && <p style={styles.brand}>🏷️ {item.brand}</p>}
              <p style={styles.location}>📍 {item.district}, {item.state}</p>
              {item.description && (
                <p style={styles.description}>
                  {item.description.slice(0, 80)}
                  {item.description.length > 80 ? '...' : ''}
                </p>
              )}
              <div style={styles.pricing}>
                {item.rent_price && (
                  <span style={styles.rentPrice}>₹{item.rent_price}/day</span>
                )}
                {item.sell_price && (
                  <span style={styles.sellPrice}>Buy: ₹{item.sell_price}</span>
                )}
              </div>
              <div style={styles.ownerRow}>
                <span style={styles.ownerName}>👤 {item.owner?.name}</span>
                <a href={`tel:${item.owner?.phone}`} style={styles.callBtn}>
                  📞 Call
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0' },
  subtitle: { color: '#6b7280', marginTop: '4px' },
  listBtn: { backgroundColor: '#15803d', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  success: { backgroundColor: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontWeight: '500' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  formCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' },
  formTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', marginTop: '0' },
  formRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  inputGroup: { flex: 1, marginBottom: '14px', minWidth: '150px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' },
  uploadBox: { display: 'block', border: '2px dashed #d1d5db', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb', marginBottom: '12px' },
  uploadContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  uploadText: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  previewGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  previewItem: { position: 'relative', width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', objectFit: 'cover' },
  removeBtn: { position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' },
  submitBtn: { width: '100%', backgroundColor: '#15803d', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '8px' },
  searchBox: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  searchInput: { flex: 2, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', minWidth: '180px' },
  typeSelect: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', minWidth: '140px', backgroundColor: 'white' },
  searchBtn: { backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' },
  resetBtn: { backgroundColor: '#6b7280', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
  count: { color: '#6b7280', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' },
  imageBox: { position: 'relative', height: '180px', backgroundColor: '#f3f4f6' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' },
  typeBadge: { position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
  cardInfo: { padding: '16px' },
  itemName: { fontSize: '17px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px' },
  brand: { fontSize: '13px', color: '#6b7280', margin: '0 0 4px' },
  location: { fontSize: '13px', color: '#6b7280', margin: '0 0 8px' },
  description: { fontSize: '13px', color: '#4b5563', margin: '0 0 10px', lineHeight: '1.5' },
  pricing: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  rentPrice: { backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' },
  sellPrice: { backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' },
  ownerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ownerName: { fontSize: '13px', color: '#374151', fontWeight: '500' },
  callBtn: { backgroundColor: '#2563eb', color: 'white', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' },
};
