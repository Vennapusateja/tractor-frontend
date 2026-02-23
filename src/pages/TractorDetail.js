import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TractorDetail() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [tractor,  setTractor]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetchTractor();
    // eslint-disable-next-line
  }, [id]);

  const fetchTractor = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/tractors/${id}/`);
      setTractor(res.data);
    } catch (err) {
      setError('Tractor not found.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.center}>Loading tractor details...</div>
  );

  if (error) return (
    <div style={styles.center}>
      <div style={{fontSize:'48px'}}>😕</div>
      <h3>{error}</h3>
      <Link to="/tractors" style={styles.backBtn}>Back to Tractors</Link>
    </div>
  );

  if (!tractor) return null;

  return (
    <div style={styles.container}>

      <Link to="/tractors" style={styles.backLink}>
        ← Back to Tractors
      </Link>

      <div style={styles.mainGrid}>

        <div style={styles.imageSection}>
          <div style={styles.mainImageBox}>
            {tractor.images && tractor.images.length > 0 ? (
              <img
                src={`http://127.0.0.1:8000${tractor.images[activeImg].image}`}
                alt={tractor.brand}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.noImage}>🚜</div>
            )}
            <span style={{
              ...styles.badge,
              backgroundColor: tractor.status === 'available' ? '#15803d' : '#dc2626'
            }}>
              {tractor.status}
            </span>
          </div>

          {tractor.images && tractor.images.length > 1 && (
            <div style={styles.thumbnails}>
              {tractor.images.map((img, index) => (
                <img
                  key={img.id}
                  src={`http://127.0.0.1:8000${img.image}`}
                  alt={`view ${index}`}
                  style={{
                    ...styles.thumbnail,
                    border: activeImg === index
                      ? '3px solid #15803d'
                      : '3px solid transparent'
                  }}
                  onClick={() => setActiveImg(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div style={styles.detailSection}>

          <h1 style={styles.title}>
            {tractor.brand} {tractor.model_name}
          </h1>

          <div style={styles.ownerBox}>
            <span style={styles.ownerLabel}>Listed by:</span>
            <span style={styles.ownerName}>👤 {tractor.owner?.name}</span>
            {tractor.owner?.verified && (
              <span style={styles.verified}>✅ Verified</span>
            )}
          </div>

          <div style={styles.specsGrid}>
            <div style={styles.specItem}>
              <span style={styles.specLabel}>Horsepower</span>
              <span style={styles.specValue}>⚡ {tractor.hp} HP</span>
            </div>
            <div style={styles.specItem}>
              <span style={styles.specLabel}>Year</span>
              <span style={styles.specValue}>📅 {tractor.year}</span>
            </div>
            <div style={styles.specItem}>
              <span style={styles.specLabel}>Fuel Type</span>
              <span style={styles.specValue}>⛽ {tractor.fuel_type}</span>
            </div>
            <div style={styles.specItem}>
              <span style={styles.specLabel}>Driver</span>
              <span style={styles.specValue}>
                {tractor.driver_available ? '👨‍🌾 Available' : '❌ Not available'}
              </span>
            </div>
          </div>

          <div style={styles.locationBox}>
            📍 {tractor.location}, {tractor.district}, {tractor.state} — {tractor.pincode}
          </div>

          <div style={styles.pricingBox}>
            <h3 style={styles.pricingTitle}>Pricing</h3>
            <div style={styles.priceGrid}>
              {tractor.rent_price_per_hour && (
                <div style={styles.priceCard}>
                  <span style={styles.priceAmount}>₹{tractor.rent_price_per_hour}</span>
                  <span style={styles.priceUnit}>per hour</span>
                </div>
              )}
              {tractor.rent_price_per_acre && (
                <div style={styles.priceCard}>
                  <span style={styles.priceAmount}>₹{tractor.rent_price_per_acre}</span>
                  <span style={styles.priceUnit}>per acre</span>
                </div>
              )}
              {tractor.sell_price && (
                <div style={{...styles.priceCard, backgroundColor:'#fef3c7'}}>
                  <span style={{...styles.priceAmount, color:'#d97706'}}>
                    ₹{tractor.sell_price}
                  </span>
                  <span style={styles.priceUnit}>selling price</span>
                </div>
              )}
              {tractor.driver_available && (
                <div style={{...styles.priceCard, backgroundColor:'#ede9fe'}}>
                  <span style={{...styles.priceAmount, color:'#7c3aed'}}>
                    ₹{tractor.driver_charges}
                  </span>
                  <span style={styles.priceUnit}>driver charges</span>
                </div>
              )}
            </div>
          </div>

          {tractor.description && (
            <div style={styles.descBox}>
              <h3 style={styles.descTitle}>Description</h3>
              <p style={styles.descText}>{tractor.description}</p>
            </div>
          )}

          <div style={styles.actions}>
            {tractor.status === 'available' ? (
              user ? (
                <button
                  onClick={() => navigate(`/book/${tractor.id}`)}
                  style={styles.bookBtn}
                >
                  📅 Book This Tractor
                </button>
              ) : (
                <Link to="/login" style={styles.bookBtn}>
                  Login to Book
                </Link>
              )
            ) : (
              <button style={styles.unavailableBtn} disabled>
                Not Available Right Now
              </button>
            )}
            <a href={`tel:${tractor.owner?.phone}`} style={styles.callBtn}>
              📞 Call Owner
            </a>
          </div>

        </div>
      </div>

      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>⭐ Reviews</h2>
        {tractor.reviews && tractor.reviews.length > 0 ? (
          tractor.reviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewUser}>👤 {review.user?.name}</span>
                <span style={styles.reviewRating}>
                  {'⭐'.repeat(review.rating)}
                </span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
            </div>
          ))
        ) : (
          <p style={styles.noReviews}>No reviews yet.</p>
        )}
      </div>

    </div>
  );
}

const styles = {
  container:     { maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' },
  center:        { textAlign:'center', padding:'80px', fontSize:'18px', color:'#6b7280' },
  backLink:      { color:'#15803d', textDecoration:'none', fontWeight:'600', fontSize:'15px' },
  backBtn:       { display:'inline-block', marginTop:'16px', backgroundColor:'#15803d', color:'white', padding:'10px 20px', borderRadius:'8px', textDecoration:'none' },
  mainGrid:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', marginTop:'20px' },
  imageSection:  {},
  mainImageBox:  { position:'relative', height:'320px', backgroundColor:'#f3f4f6', borderRadius:'12px', overflow:'hidden' },
  mainImage:     { width:'100%', height:'100%', objectFit:'cover' },
  noImage:       { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'80px' },
  badge:         { position:'absolute', top:'12px', right:'12px', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', textTransform:'capitalize' },
  thumbnails:    { display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap' },
  thumbnail:     { width:'72px', height:'72px', objectFit:'cover', borderRadius:'8px', cursor:'pointer' },
  detailSection: {},
  title:         { fontSize:'28px', fontWeight:'bold', color:'#111827', margin:'0 0 12px 0' },
  ownerBox:      { display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', padding:'12px', backgroundColor:'#f9fafb', borderRadius:'8px' },
  ownerLabel:    { color:'#6b7280', fontSize:'14px' },
  ownerName:     { fontWeight:'600', color:'#111827' },
  verified:      { color:'#15803d', fontSize:'13px' },
  specsGrid:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' },
  specItem:      { backgroundColor:'#f9fafb', padding:'12px', borderRadius:'8px', display:'flex', flexDirection:'column', gap:'4px' },
  specLabel:     { fontSize:'12px', color:'#6b7280', textTransform:'uppercase' },
  specValue:     { fontSize:'15px', fontWeight:'600', color:'#111827' },
  locationBox:   { backgroundColor:'#f0fdf4', padding:'12px 16px', borderRadius:'8px', color:'#15803d', fontSize:'14px', marginBottom:'16px' },
  pricingBox:    { marginBottom:'16px' },
  pricingTitle:  { fontSize:'18px', fontWeight:'bold', color:'#111827', marginBottom:'12px' },
  priceGrid:     { display:'flex', gap:'12px', flexWrap:'wrap' },
  priceCard:     { backgroundColor:'#dcfce7', padding:'12px 16px', borderRadius:'10px', display:'flex', flexDirection:'column', alignItems:'center', minWidth:'100px' },
  priceAmount:   { fontSize:'20px', fontWeight:'bold', color:'#15803d' },
  priceUnit:     { fontSize:'12px', color:'#6b7280', marginTop:'2px' },
  descBox:       { marginBottom:'16px' },
  descTitle:     { fontSize:'16px', fontWeight:'bold', color:'#111827', marginBottom:'8px' },
  descText:      { color:'#4b5563', lineHeight:'1.6' },
  actions:       { display:'flex', gap:'12px', flexWrap:'wrap' },
  bookBtn:       { flex:1, backgroundColor:'#15803d', color:'white', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', border:'none', cursor:'pointer', textAlign:'center', textDecoration:'none', display:'block' },
  unavailableBtn:{ flex:1, backgroundColor:'#d1d5db', color:'#6b7280', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', border:'none', cursor:'not-allowed' },
  callBtn:       { flex:1, backgroundColor:'#2563eb', color:'white', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', textAlign:'center', textDecoration:'none', display:'block' },
  reviewsSection:{ marginTop:'40px', borderTop:'1px solid #e5e7eb', paddingTop:'24px' },
  reviewsTitle:  { fontSize:'22px', fontWeight:'bold', color:'#111827', marginBottom:'16px' },
  reviewCard:    { backgroundColor:'white', padding:'16px', borderRadius:'10px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', marginBottom:'12px' },
  reviewHeader:  { display:'flex', justifyContent:'space-between', marginBottom:'8px' },
  reviewUser:    { fontWeight:'600', color:'#111827' },
  reviewRating:  { fontSize:'14px' },
  reviewComment: { color:'#4b5563', margin:'0' },
  noReviews:     { color:'#6b7280' },
};
