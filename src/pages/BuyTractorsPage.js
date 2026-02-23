import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function BuyTractorsPage() {
  const [tractors, setTractors] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [state,    setState]    = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchTractors();
    // eslint-disable-next-line
  }, []);

  const fetchTractors = async (params = {}) => {
    setLoading(true);
    try {
      const res = await API.get('/tractors/', {
        params: { ...params, for_sale: true }
      });
      setTractors(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchTractors({ search, state, max_price: maxPrice });

  const handleReset = () => {
    setSearch(''); setState(''); setMaxPrice('');
    fetchTractors();
  };

  return (
    <div style={styles.container}>

      {/* Page Header */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🏪 Buy a Tractor</h1>
        <p style={styles.heroSubtitle}>
          Find quality tractors for sale at the best prices
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
          placeholder="Max Price (₹)"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={styles.smallInput}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
        <button onClick={handleReset}  style={styles.resetBtn}>Reset</button>
      </div>

      {!loading && (
        <p style={styles.count}>
          {tractors.length} tractor{tractors.length !== 1 ? 's' : ''} available for sale
        </p>
      )}

      {loading && <div style={styles.loading}>Loading tractors...</div>}

      {!loading && tractors.length === 0 && (
        <div style={styles.empty}>
          <div style={{fontSize:'64px'}}>🚜</div>
          <h3>No tractors found for sale</h3>
          <p>Try different search filters</p>
        </div>
      )}

      <div style={styles.grid}>
        {tractors.map(tractor => (
          <div key={tractor.id} style={styles.card}>
            <div style={styles.imageBox}>
              {tractor.images && tractor.images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${tractor.images[0].image}`}
                  alt={tractor.brand}
                  style={styles.image}
                />
              ) : (
                <div style={styles.noImage}>🚜</div>
              )}
              <span style={styles.saleBadge}>FOR SALE</span>
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

              {/* Sale price only */}
              {tractor.sell_price && (
                <div style={styles.priceBox}>
                  <span style={styles.priceLabel}>Selling Price</span>
                  <span style={styles.sellPrice}>₹{Number(tractor.sell_price).toLocaleString('en-IN')}</span>
                </div>
              )}

              {tractor.description && (
                <p style={styles.description}>
                  {tractor.description.slice(0, 80)}
                  {tractor.description.length > 80 ? '...' : ''}
                </p>
              )}

              <div style={styles.actions}>
                <Link to={`/tractors/${tractor.id}`} style={styles.viewBtn}>
                  View Details
                </Link>
                <a href={`tel:${tractor.owner?.phone}`} style={styles.callBtn}>
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
  container:   { maxWidth:'1200px', margin:'0 auto', padding:'24px 16px' },
  hero:        { textAlign:'center', marginBottom:'28px', padding:'32px', backgroundColor:'#fef3c7', borderRadius:'16px' },
  heroTitle:   { fontSize:'36px', fontWeight:'bold', color:'#d97706', margin:'0 0 8px' },
  heroSubtitle:{ color:'#92400e', fontSize:'16px', margin:'0' },
  searchBox:   { display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' },
  searchInput: { flex:2, padding:'12px 16px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'15px', minWidth:'200px' },
  smallInput:  { flex:1, padding:'12px 16px', borderRadius:'8px', border:'1px solid #d1d5db', fontSize:'15px', minWidth:'100px' },
  searchBtn:   { backgroundColor:'#d97706', color:'white', padding:'12px 24px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:'600' },
  resetBtn:    { backgroundColor:'#6b7280', color:'white', padding:'12px 24px', borderRadius:'8px', border:'none', cursor:'pointer' },
  count:       { color:'#6b7280', marginBottom:'16px' },
  loading:     { textAlign:'center', padding:'60px', fontSize:'18px', color:'#6b7280' },
  empty:       { textAlign:'center', padding:'60px', color:'#6b7280' },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'24px' },
  card:        { backgroundColor:'white', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', overflow:'hidden' },
  imageBox:    { position:'relative', height:'200px', backgroundColor:'#f3f4f6' },
  image:       { width:'100%', height:'100%', objectFit:'cover' },
  noImage:     { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px' },
  saleBadge:   { position:'absolute', top:'12px', right:'12px', backgroundColor:'#d97706', color:'white', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' },
  info:        { padding:'16px' },
  tractorName: { fontSize:'18px', fontWeight:'bold', color:'#111827', margin:'0 0 8px' },
  specs:       { display:'flex', gap:'8px', marginBottom:'8px', flexWrap:'wrap' },
  spec:        { fontSize:'13px', color:'#6b7280', backgroundColor:'#f3f4f6', padding:'4px 8px', borderRadius:'6px' },
  location:    { fontSize:'14px', color:'#6b7280', marginBottom:'10px' },
  priceBox:    { display:'flex', flexDirection:'column', marginBottom:'10px' },
  priceLabel:  { fontSize:'11px', color:'#6b7280', textTransform:'uppercase', fontWeight:'600' },
  sellPrice:   { fontSize:'22px', fontWeight:'bold', color:'#d97706' },
  description: { fontSize:'13px', color:'#4b5563', marginBottom:'12px', lineHeight:'1.5' },
  actions:     { display:'flex', gap:'8px' },
  viewBtn:     { flex:1, backgroundColor:'#d97706', color:'white', padding:'10px', borderRadius:'8px', textAlign:'center', textDecoration:'none', fontWeight:'600' },
  callBtn:     { flex:1, backgroundColor:'#2563eb', color:'white', padding:'10px', borderRadius:'8px', textAlign:'center', textDecoration:'none', fontWeight:'600' },
};