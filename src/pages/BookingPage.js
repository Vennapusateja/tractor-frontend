import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [tractor,  setTractor]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const [formData, setFormData] = useState({
    start_date:      '',
    end_date:        '',
    rent_type:       'hourly',
    quantity:        1,
    driver_required: false,
    contact_phone:   '',
    delivery_address:'',
    notes:           '',
  });

 useEffect(() => {
    fetchTractor();
    // eslint-disable-next-line
  }, [id]);
  const fetchTractor = async () => {
    try {
      const res = await API.get(`/tractors/${id}/`);
      setTractor(res.data);
      setFormData(prev => ({
        ...prev,
        contact_phone: user?.phone || '',
      }));
    } catch {
      setError('Tractor not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const calculateTotal = () => {
    if (!tractor) return 0;
    let price = 0;
    if (formData.rent_type === 'hourly') {
      price = (tractor.rent_price_per_hour || 0) * formData.quantity;
    } else {
      price = (tractor.rent_price_per_acre || 0) * formData.quantity;
    }
    if (formData.driver_required && tractor.driver_available) {
      price += parseFloat(tractor.driver_charges || 0);
    }
    return price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await API.post('/bookings/', {
        ...formData,
        tractor: id,
        quantity: parseFloat(formData.quantity),
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
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={styles.center}>Loading...</div>
  );

  if (!user) return (
    <div style={styles.center}>
      <h3>Please login to book a tractor</h3>
      <Link to="/login" style={styles.loginBtn}>Login</Link>
    </div>
  );

  if (success) return (
    <div style={styles.successContainer}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={styles.successTitle}>Booking Request Sent!</h2>
        <p style={styles.successText}>
          Your booking request has been sent to the owner.
          They will confirm it shortly.
        </p>
        <div style={styles.successActions}>
          <button
            onClick={() => navigate('/bookings')}
            style={styles.viewBookingsBtn}
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/tractors')}
            style={styles.browseBtn}
          >
            Browse More Tractors
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>

      <Link to={`/tractors/${id}`} style={styles.backLink}>
        ← Back to Tractor Details
      </Link>

      <h1 style={styles.pageTitle}>📅 Book Tractor</h1>

      <div style={styles.mainGrid}>

        {/* LEFT — Booking form */}
        <div style={styles.formSection}>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Dates */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  min={formData.start_date}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Rent type */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Rent Type</label>
              <select
                name="rent_type"
                value={formData.rent_type}
                onChange={handleChange}
                style={styles.input}
              >
                {tractor?.rent_price_per_hour && (
                  <option value="hourly">
                    Per Hour — ₹{tractor.rent_price_per_hour}/hr
                  </option>
                )}
                {tractor?.rent_price_per_acre && (
                  <option value="acre">
                    Per Acre — ₹{tractor.rent_price_per_acre}/acre
                  </option>
                )}
              </select>
            </div>

            {/* Quantity */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                {formData.rent_type === 'hourly'
                  ? 'Number of Hours'
                  : 'Number of Acres'}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                style={styles.input}
              />
            </div>

            {/* Driver */}
            {tractor?.driver_available && (
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="driver_required"
                  id="driver"
                  checked={formData.driver_required}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <label htmlFor="driver" style={styles.checkboxLabel}>
                  Include Driver (+₹{tractor.driver_charges})
                </label>
              </div>
            )}

            {/* Contact phone */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Your Contact Phone</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="Phone number for owner to contact"
                required
                style={styles.input}
              />
            </div>

            {/* Delivery address */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Delivery Address</label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="Village, District, State"
                rows={3}
                style={{...styles.input, resize:'vertical'}}
              />
            </div>

            {/* Notes */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Additional Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requirements..."
                rows={2}
                style={{...styles.input, resize:'vertical'}}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={styles.submitBtn}
            >
              {submitting ? 'Sending Request...' : '📅 Send Booking Request'}
            </button>

          </form>
        </div>

        {/* RIGHT — Summary */}
        <div style={styles.summarySection}>

          {/* Tractor info */}
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>🚜 Tractor Details</h3>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Tractor</span>
              <span style={styles.summaryValue}>
                {tractor?.brand} {tractor?.model_name}
              </span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Power</span>
              <span style={styles.summaryValue}>{tractor?.hp} HP</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Location</span>
              <span style={styles.summaryValue}>
                {tractor?.district}, {tractor?.state}
              </span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Owner</span>
              <span style={styles.summaryValue}>{tractor?.owner?.name}</span>
            </div>
          </div>

          {/* Price summary */}
          <div style={styles.priceCard}>
            <h3 style={styles.summaryTitle}>💰 Price Estimate</h3>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Rate</span>
              <span style={styles.summaryValue}>
                {formData.rent_type === 'hourly'
                  ? `₹${tractor?.rent_price_per_hour}/hr`
                  : `₹${tractor?.rent_price_per_acre}/acre`}
              </span>
            </div>

            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>
                {formData.rent_type === 'hourly' ? 'Hours' : 'Acres'}
              </span>
              <span style={styles.summaryValue}>{formData.quantity}</span>
            </div>

            {formData.driver_required && tractor?.driver_available && (
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Driver Charges</span>
                <span style={styles.summaryValue}>
                  ₹{tractor?.driver_charges}
                </span>
              </div>
            )}

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Estimate</span>
              <span style={styles.totalValue}>₹{calculateTotal()}</span>
            </div>

            <p style={styles.note}>
              * Final price confirmed by owner after booking approval
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container:       { maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' },
  center:          { textAlign:'center', padding:'80px', fontSize:'18px', color:'#6b7280' },
  backLink:        { color:'#15803d', textDecoration:'none', fontWeight:'600', fontSize:'15px' },
  loginBtn:        { display:'inline-block', marginTop:'16px', backgroundColor:'#15803d', color:'white', padding:'10px 20px', borderRadius:'8px', textDecoration:'none' },
  pageTitle:       { fontSize:'28px', fontWeight:'bold', color:'#111827', margin:'16px 0 24px' },
  mainGrid:        { display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'32px' },
  formSection:     { backgroundColor:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  error:           { backgroundColor:'#fee2e2', color:'#dc2626', padding:'12px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px' },
  row:             { display:'flex', gap:'12px' },
  inputGroup:      { flex:1, marginBottom:'16px' },
  label:           { display:'block', fontSize:'14px', fontWeight:'500', color:'#374151', marginBottom:'6px' },
  input:           { width:'100%', border:'1px solid #d1d5db', borderRadius:'8px', padding:'10px 14px', fontSize:'15px', outline:'none', boxSizing:'border-box', backgroundColor:'white' },
  checkboxGroup:   { display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', padding:'12px', backgroundColor:'#f0fdf4', borderRadius:'8px' },
  checkbox:        { width:'18px', height:'18px', cursor:'pointer' },
  checkboxLabel:   { fontSize:'15px', color:'#15803d', fontWeight:'500', cursor:'pointer' },
  submitBtn:       { width:'100%', backgroundColor:'#15803d', color:'white', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', border:'none', cursor:'pointer', marginTop:'8px' },
  summarySection:  { display:'flex', flexDirection:'column', gap:'16px' },
  summaryCard:     { backgroundColor:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  priceCard:       { backgroundColor:'#f0fdf4', padding:'20px', borderRadius:'12px', border:'2px solid #86efac' },
  summaryTitle:    { fontSize:'16px', fontWeight:'bold', color:'#111827', marginBottom:'16px', marginTop:'0' },
  summaryItem:     { display:'flex', justifyContent:'space-between', marginBottom:'10px' },
  summaryLabel:    { color:'#6b7280', fontSize:'14px' },
  summaryValue:    { fontWeight:'600', color:'#111827', fontSize:'14px' },
  totalRow:        { display:'flex', justifyContent:'space-between', borderTop:'2px solid #86efac', paddingTop:'12px', marginTop:'8px' },
  totalLabel:      { fontWeight:'bold', color:'#111827', fontSize:'16px' },
  totalValue:      { fontWeight:'bold', color:'#15803d', fontSize:'22px' },
  note:            { fontSize:'12px', color:'#6b7280', marginTop:'8px', marginBottom:'0' },
  successContainer:{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' },
  successCard:     { backgroundColor:'white', padding:'48px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', textAlign:'center', maxWidth:'480px', width:'100%' },
  successIcon:     { fontSize:'64px', marginBottom:'16px' },
  successTitle:    { fontSize:'24px', fontWeight:'bold', color:'#111827', margin:'0 0 12px' },
  successText:     { color:'#6b7280', lineHeight:'1.6', marginBottom:'24px' },
  successActions:  { display:'flex', gap:'12px', flexDirection:'column' },
  viewBookingsBtn: { backgroundColor:'#15803d', color:'white', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', border:'none', cursor:'pointer' },
  browseBtn:       { backgroundColor:'white', color:'#15803d', padding:'14px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', border:'2px solid #15803d', cursor:'pointer' },
};