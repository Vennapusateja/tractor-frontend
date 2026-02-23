import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const [tractors,  setTractors]  = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('tractors');
  const [error,     setError]     = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tractorRes, bookingRes] = await Promise.all([
        API.get('/tractors/mine/'),
        API.get('/bookings/'),
      ]);
      setTractors(tractorRes.data.results || tractorRes.data);
      setBookings(bookingRes.data.results || bookingRes.data);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await API.patch(`/bookings/${bookingId}/status/`, { status });
      fetchData();
    } catch {
      alert('Failed to update booking status.');
    }
  };

  const deleteTractor = async (tractorId) => {
    if (!window.confirm('Are you sure you want to delete this tractor?')) return;
    try {
      await API.delete(`/tractors/${tractorId}/`);
      fetchData();
    } catch {
      alert('Failed to delete tractor.');
    }
  };

  const statusColor = {
    pending:   { bg:'#fef3c7', color:'#d97706' },
    confirmed: { bg:'#dbeafe', color:'#1d4ed8' },
    active:    { bg:'#dcfce7', color:'#15803d' },
    completed: { bg:'#f3f4f6', color:'#374151' },
    cancelled: { bg:'#fee2e2', color:'#dc2626' },
  };

  const pendingBookings  = bookings.filter(b => b.status === 'pending');
  const activeBookings   = bookings.filter(b => b.status === 'active' || b.status === 'confirmed');
  const pastBookings     = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (loading) return (
    <div style={styles.center}>Loading dashboard...</div>
  );

  return (
    <div style={styles.container}>

      <h1 style={styles.pageTitle}>🛠 Owner Dashboard</h1>
      <p style={styles.welcome}>Welcome back, {user?.name}!</p>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{tractors.length}</span>
          <span style={styles.statLabel}>My Tractors</span>
        </div>
        <div style={styles.statBox}>
          <span style={{...styles.statNumber, color:'#d97706'}}>{pendingBookings.length}</span>
          <span style={styles.statLabel}>Pending Requests</span>
        </div>
        <div style={styles.statBox}>
          <span style={{...styles.statNumber, color:'#1d4ed8'}}>{activeBookings.length}</span>
          <span style={styles.statLabel}>Active Bookings</span>
        </div>
        <div style={styles.statBox}>
          <span style={{...styles.statNumber, color:'#6b7280'}}>{pastBookings.length}</span>
          <span style={styles.statLabel}>Completed</span>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('tractors')}
          style={{
            ...styles.tab,
            ...(activeTab === 'tractors' ? styles.activeTab : {})
          }}
        >
          🚜 My Tractors ({tractors.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            ...styles.tab,
            ...(activeTab === 'pending' ? styles.activeTab : {})
          }}
        >
          ⏳ Pending ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            ...styles.tab,
            ...(activeTab === 'active' ? styles.activeTab : {})
          }}
        >
          ✅ Active ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            ...styles.tab,
            ...(activeTab === 'past' ? styles.activeTab : {})
          }}
        >
          📋 Past ({pastBookings.length})
        </button>
      </div>

      {/* Tab content */}
      <div style={styles.tabContent}>

        {/* MY TRACTORS */}
        {activeTab === 'tractors' && (
          <div>
            <div style={styles.tabHeader}>
              <h2 style={styles.tabTitle}>My Tractors</h2>
              <Link to="/add-tractor" style={styles.addBtn}>
                + Add New Tractor
              </Link>
            </div>

            {tractors.length === 0 ? (
              <div style={styles.empty}>
                <div style={{fontSize:'48px'}}>🚜</div>
                <h3>No tractors listed yet</h3>
                <p>Add your first tractor to start getting bookings</p>
                <Link to="/add-tractor" style={styles.addBtnLarge}>
                  + Add Tractor
                </Link>
              </div>
            ) : (
              <div style={styles.tractorGrid}>
                {tractors.map(tractor => (
                  <div key={tractor.id} style={styles.tractorCard}>

                    <div style={styles.tractorImageBox}>
                      {tractor.images && tractor.images.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8000${tractor.images[0].image}`}
                          alt={tractor.brand}
                          style={styles.tractorImage}
                        />
                      ) : (
                        <div style={styles.noImage}>🚜</div>
                      )}
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: tractor.status === 'available'
                          ? '#15803d' : '#dc2626'
                      }}>
                        {tractor.status}
                      </span>
                    </div>

                    <div style={styles.tractorInfo}>
                      <h3 style={styles.tractorName}>
                        {tractor.brand} {tractor.model_name}
                      </h3>
                      <p style={styles.tractorSpecs}>
                        ⚡ {tractor.hp}HP • 📅 {tractor.year}
                      </p>
                      {tractor.rent_price_per_hour && (
                        <p style={styles.tractorPrice}>
                          ₹{tractor.rent_price_per_hour}/hr
                        </p>
                      )}

                      <div style={styles.tractorActions}>
                        <Link
                          to={`/tractors/${tractor.id}`}
                          style={styles.viewBtn}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteTractor(tractor.id)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PENDING BOOKINGS */}
        {activeTab === 'pending' && (
          <div>
            <h2 style={styles.tabTitle}>Pending Booking Requests</h2>
            {pendingBookings.length === 0 ? (
              <div style={styles.empty}>
                <div style={{fontSize:'48px'}}>📋</div>
                <h3>No pending requests</h3>
              </div>
            ) : (
              pendingBookings.map(booking => (
                <div key={booking.id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>
                        Booking #{booking.id}
                      </h3>
                      <p style={styles.bookingFarmer}>
                        👤 Farmer: {booking.farmer?.name} — 📱 {booking.farmer?.phone}
                      </p>
                    </div>
                    <span style={{
                      ...styles.bookingBadge,
                      backgroundColor: statusColor[booking.status]?.bg,
                      color: statusColor[booking.status]?.color,
                    }}>
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.bookingDetails}>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Tractor</span>
                      <span style={styles.detailValue}>
                        {booking.tractor?.brand} {booking.tractor?.model_name}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Dates</span>
                      <span style={styles.detailValue}>
                        {booking.start_date} → {booking.end_date}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Type</span>
                      <span style={styles.detailValue}>
                        {booking.quantity} {booking.rent_type}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Total</span>
                      <span style={{...styles.detailValue, color:'#15803d', fontWeight:'700'}}>
                        ₹{booking.total_price}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Address</span>
                      <span style={styles.detailValue}>
                        {booking.delivery_address || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  <div style={styles.bookingActions}>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      style={styles.confirmBtn}
                    >
                      ✅ Confirm Booking
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      style={styles.rejectBtn}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ACTIVE BOOKINGS */}
        {activeTab === 'active' && (
          <div>
            <h2 style={styles.tabTitle}>Active Bookings</h2>
            {activeBookings.length === 0 ? (
              <div style={styles.empty}>
                <div style={{fontSize:'48px'}}>✅</div>
                <h3>No active bookings</h3>
              </div>
            ) : (
              activeBookings.map(booking => (
                <div key={booking.id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>
                        Booking #{booking.id}
                      </h3>
                      <p style={styles.bookingFarmer}>
                        👤 {booking.farmer?.name} — 📱 {booking.farmer?.phone}
                      </p>
                    </div>
                    <span style={{
                      ...styles.bookingBadge,
                      backgroundColor: statusColor[booking.status]?.bg,
                      color: statusColor[booking.status]?.color,
                    }}>
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.bookingDetails}>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Dates</span>
                      <span style={styles.detailValue}>
                        {booking.start_date} → {booking.end_date}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Total</span>
                      <span style={{...styles.detailValue, color:'#15803d', fontWeight:'700'}}>
                        ₹{booking.total_price}
                      </span>
                    </div>
                  </div>

                  <div style={styles.bookingActions}>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      style={styles.confirmBtn}
                    >
                      ✅ Mark as Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PAST BOOKINGS */}
        {activeTab === 'past' && (
          <div>
            <h2 style={styles.tabTitle}>Past Bookings</h2>
            {pastBookings.length === 0 ? (
              <div style={styles.empty}>
                <div style={{fontSize:'48px'}}>📋</div>
                <h3>No past bookings yet</h3>
              </div>
            ) : (
              pastBookings.map(booking => (
                <div key={booking.id} style={{...styles.bookingCard, opacity:0.8}}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>
                        Booking #{booking.id}
                      </h3>
                      <p style={styles.bookingFarmer}>
                        👤 {booking.farmer?.name}
                      </p>
                    </div>
                    <span style={{
                      ...styles.bookingBadge,
                      backgroundColor: statusColor[booking.status]?.bg,
                      color: statusColor[booking.status]?.color,
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={styles.bookingDetails}>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Dates</span>
                      <span style={styles.detailValue}>
                        {booking.start_date} → {booking.end_date}
                      </span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <span style={styles.detailLabel}>Total</span>
                      <span style={{...styles.detailValue, fontWeight:'700'}}>
                        ₹{booking.total_price}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container:      { maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' },
  center:         { textAlign:'center', padding:'80px', fontSize:'18px', color:'#6b7280' },
  pageTitle:      { fontSize:'28px', fontWeight:'bold', color:'#111827', margin:'0' },
  welcome:        { color:'#6b7280', marginTop:'4px', marginBottom:'24px' },
  statsRow:       { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'24px' },
  statBox:        { backgroundColor:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', textAlign:'center', display:'flex', flexDirection:'column', gap:'4px' },
  statNumber:     { fontSize:'32px', fontWeight:'bold', color:'#15803d' },
  statLabel:      { fontSize:'13px', color:'#6b7280', fontWeight:'500' },
  error:          { backgroundColor:'#fee2e2', color:'#dc2626', padding:'12px', borderRadius:'8px', marginBottom:'16px' },
  tabs:           { display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' },
  tab:            { padding:'10px 20px', borderRadius:'8px', border:'2px solid #e5e7eb', backgroundColor:'white', cursor:'pointer', fontWeight:'600', fontSize:'14px', color:'#6b7280' },
  activeTab:      { backgroundColor:'#15803d', color:'white', borderColor:'#15803d' },
  tabContent:     { backgroundColor:'white', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', padding:'24px' },
  tabHeader:      { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  tabTitle:       { fontSize:'20px', fontWeight:'bold', color:'#111827', margin:'0 0 20px' },
  addBtn:         { backgroundColor:'#15803d', color:'white', padding:'10px 20px', borderRadius:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px' },
  addBtnLarge:    { display:'inline-block', marginTop:'16px', backgroundColor:'#15803d', color:'white', padding:'12px 24px', borderRadius:'8px', textDecoration:'none', fontWeight:'600' },
  empty:          { textAlign:'center', padding:'40px', color:'#6b7280' },
  tractorGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px' },
  tractorCard:    { border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden' },
  tractorImageBox:{ position:'relative', height:'160px', backgroundColor:'#f3f4f6' },
  tractorImage:   { width:'100%', height:'100%', objectFit:'cover' },
  noImage:        { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px' },
  statusBadge:    { position:'absolute', top:'8px', right:'8px', color:'white', padding:'3px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'600', textTransform:'capitalize' },
  tractorInfo:    { padding:'14px' },
  tractorName:    { fontSize:'16px', fontWeight:'bold', color:'#111827', margin:'0 0 4px' },
  tractorSpecs:   { fontSize:'13px', color:'#6b7280', margin:'0 0 4px' },
  tractorPrice:   { fontSize:'15px', fontWeight:'600', color:'#15803d', margin:'0 0 12px' },
  tractorActions: { display:'flex', gap:'8px' },
  viewBtn:        { flex:1, backgroundColor:'#f0fdf4', color:'#15803d', padding:'8px', borderRadius:'6px', textAlign:'center', textDecoration:'none', fontWeight:'600', fontSize:'13px' },
  deleteBtn:      { flex:1, backgroundColor:'#fee2e2', color:'#dc2626', padding:'8px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'13px' },
  bookingCard:    { border:'1px solid #e5e7eb', borderRadius:'12px', padding:'20px', marginBottom:'16px' },
  bookingHeader:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' },
  bookingTitle:   { fontSize:'16px', fontWeight:'bold', color:'#111827', margin:'0 0 4px' },
  bookingFarmer:  { fontSize:'13px', color:'#6b7280', margin:'0' },
  bookingBadge:   { padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', textTransform:'capitalize' },
  bookingDetails: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'12px', marginBottom:'16px' },
  bookingDetail:  { display:'flex', flexDirection:'column', gap:'2px' },
  detailLabel:    { fontSize:'11px', color:'#6b7280', textTransform:'uppercase', fontWeight:'600' },
  detailValue:    { fontSize:'14px', color:'#111827' },
  bookingActions: { display:'flex', gap:'8px' },
  confirmBtn:     { backgroundColor:'#dcfce7', color:'#15803d', padding:'10px 20px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
  rejectBtn:      { backgroundColor:'#fee2e2', color:'#dc2626', padding:'10px 20px', borderRadius:'8px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
};