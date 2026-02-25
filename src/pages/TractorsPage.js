import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function TractorsPage() {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [hp, setHp] = useState('');
  const slowWarning = useSlowBackend(loading);

  useEffect(() => {
    fetchTractors();
    // eslint-disable-next-line
  }, []);

  const fetchTractors = async (params = {}) => {
    setLoading(true);
    try {
      const res = await API.get('/tractors/', {
        params: { ...params, for_rent: true }
      });
      const data = res.data;
      if (Array.isArray(data)) {
        setTractors(data);
      } else if (data.results && Array.isArray(data.results)) {
        setTractors(data.results);
      } else {
        setTractors([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchTractors({ search, state, hp });

  const handleReset = () => {
    setSearch(''); setState(''); setHp('');
    fetchTractors();
  };

  return (
    <div style={styles.container}>

      {/* Page Header */}
      <div style={styles.hero}>
        {/* <img src="/images/tractor1.png" alt="Tractor" style={styles.heroImage} /> */}
        <h1 style={styles.heroTitle}>Rent a Tractor</h1>
        <p style={styles.heroSubtitle}>
          Find tractors available for rent near you — by hour or by acre
        </p>
      </div>

      {/* Search filters */}
      <div style={styles.searchBox}>
        <input
          placeholder="Search brand, model, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.searchInput}
        />
        <input
          placeholder="State (Punjab...)"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={styles.smallInput}
        />
        <input
          placeholder="Min HP"
          type="number"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          style={styles.smallInput}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
        <button onClick={handleReset} style={styles.resetBtn}>Reset</button>
      </div>

      {!loading && (
        <p style={styles.count}>
          {tractors.length} tractor{tractors.length !== 1 ? 's' : ''} available for rent
        </p>
      )}

      <SlowBackendBanner show={slowWarning} />
      {loading && <div style={styles.loading}>Loading tractors...</div>}

      {!loading && tractors.length === 0 && (
        <div style={styles.empty}>
          <img src="/images/tractor1.png" alt="No tractors" style={{ width: '160px', borderRadius: '12px', marginBottom: '12px', opacity: 0.7 }} />
          <h3>No tractors found for rent</h3>
          <p>Try different search filters</p>
        </div>
      )}

      <div style={styles.grid}>
        {tractors.map(tractor => (
          <div key={tractor.id} style={styles.card}>
            <div style={styles.imageBox}>
              {tractor.images && tractor.images.length > 0 ? (
                <img
                  src={`${MEDIA_BASE}${tractor.images[0].image}`}
                  alt={tractor.brand}
                  style={styles.image}
                />
              ) : (
                <img
                  src={getPlaceholder(tractor.id)}
                  alt={tractor.brand || 'Tractor'}
                  style={styles.image}
                />
              )}
              <span style={{
                ...styles.badge,
                backgroundColor: tractor.status === 'available' ? '#15803d' : '#dc2626'
              }}>
                {tractor.status}
              </span>
            </div>

            <div style={styles.info}>
              <h3 style={styles.tractorName}>
                {tractor.brand} {tractor.model_name}
              </h3>
              <div style={styles.specs}>
                <span style={styles.spec}>⚡ {tractor.hp} HP</span>
                <span style={styles.spec}>📅 {tractor.year}</span>
                <span style={styles.spec}>⛽ {tractor.fuel_type}</span>
              </div>
              <div style={styles.location}>
                📍 {tractor.district}, {tractor.state}
              </div>

              {/* Rent prices only */}
              <div style={styles.pricing}>
                {tractor.rent_price_per_hour && (
                  <span style={styles.rentPrice}>
                    ₹{tractor.rent_price_per_hour}/hr
                  </span>
                )}
                {tractor.rent_price_per_acre && (
                  <span style={styles.rentPrice}>
                    ₹{tractor.rent_price_per_acre}/acre
                  </span>
                )}
              </div>

              {tractor.driver_available && (
                <div style={styles.driver}>👨‍🌾 Driver available</div>
              )}

              <Link to={`/tractors/${tractor.id}`} style={styles.viewBtn}>
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' },
  hero: { textAlign: 'center', marginBottom: '28px', padding: '32px', backgroundColor: '#f0fdf4', borderRadius: '16px' },
  heroImage: { width: '180px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
  heroTitle: { fontSize: '36px', fontWeight: 'bold', color: '#15803d', margin: '0 0 8px' },
  heroSubtitle: { color: '#4b7c59', fontSize: '16px', margin: '0' },
  searchBox: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  searchInput: { flex: 2, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', minWidth: '200px' },
  smallInput: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', minWidth: '100px' },
  searchBtn: { backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' },
  resetBtn: { backgroundColor: '#6b7280', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
  count: { color: '#6b7280', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  imageBox: { position: 'relative', height: '200px', backgroundColor: '#f3f4f6' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  noImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' },
  badge: { position: 'absolute', top: '12px', right: '12px', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  info: { padding: '16px' },
  tractorName: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' },
  specs: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' },
  spec: { fontSize: '13px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' },
  location: { fontSize: '14px', color: '#6b7280', marginBottom: '10px' },
  pricing: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' },
  rentPrice: { backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600' },
  driver: { fontSize: '13px', color: '#15803d', marginBottom: '8px' },
  viewBtn: { display: 'block', backgroundColor: '#15803d', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', marginTop: '8px' },
};