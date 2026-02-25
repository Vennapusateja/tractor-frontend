
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    state: user?.state || '',
    district: user?.district || '',
    pincode: user?.pincode || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await API.patch('/users/profile/', formData);
      login(localStorage.getItem('token'), res.data);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    farmer: { bg: '#dcfce7', color: '#15803d' },
    owner: { bg: '#dbeafe', color: '#1d4ed8' },
    dealer: { bg: '#fef3c7', color: '#d97706' },
    admin: { bg: '#fce7f3', color: '#9d174d' },
  };

  const roleStyle = roleColors[user?.role] || roleColors.farmer;

  return (
    <div style={styles.container}>

      <h1 style={styles.pageTitle}>👤 My Profile</h1>

      <div style={styles.mainGrid}>

        {/* LEFT — Profile card */}
        <div style={styles.profileCard}>

          {/* Avatar */}
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={styles.userName}>{user?.name}</h2>
            <span style={{
              ...styles.roleBadge,
              backgroundColor: roleStyle.bg,
              color: roleStyle.color,
            }}>
              {user?.role?.toUpperCase()}
            </span>
            {user?.verified && (
              <div style={styles.verifiedBadge}>✅ Verified Account</div>
            )}
          </div>

          {/* Info */}
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📱</span>
              <span style={styles.infoText}>{user?.phone}</span>
            </div>
            {user?.email && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>📧</span>
                <span style={styles.infoText}>{user?.email}</span>
              </div>
            )}
            {user?.state && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>📍</span>
                <span style={styles.infoText}>
                  {user?.district}, {user?.state}
                </span>
              </div>
            )}
            {user?.location && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🏠</span>
                <span style={styles.infoText}>{user?.location}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setEditing(!editing)}
            style={styles.editBtn}
          >
            {editing ? 'Cancel Editing' : '✏️ Edit Profile'}
          </button>
        </div>

        {/* RIGHT — Edit form or stats */}
        <div style={styles.rightSection}>

          {/* Success message */}
          {success && (
            <div style={styles.success}>{success}</div>
          )}

          {/* Error message */}
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {editing ? (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Edit Profile</h3>
              <form onSubmit={handleSave}>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Location / Village</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Village or city name"
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1, marginRight: '8px' }}>
                    <label style={styles.label}>State</label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Punjab"
                      style={styles.input}
                    />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>District</label>
                    <input
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Ludhiana"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="141001"
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={styles.saveBtn}
                >
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>

              </form>
            </div>
          ) : (
            <div style={styles.statsSection}>

              <h3 style={styles.statsTitle}>Account Summary</h3>

              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <span style={styles.statIcon}>📅</span>
                  <span style={styles.statLabel}>My Bookings</span>
                  <Link to="/bookings" style={styles.statLink}>View All</Link>
                </div>

                {(user?.role === 'owner' || user?.role === 'dealer') && (
                  <div style={styles.statCard}>
                    <span style={styles.statIcon}>🚜</span>
                    <span style={styles.statLabel}>My Tractors</span>
                    <Link to="/dashboard" style={styles.statLink}>View All</Link>
                  </div>
                )}

                <div style={styles.statCard}>
                  <span style={styles.statIcon}>⭐</span>
                  <span style={styles.statLabel}>My Reviews</span>
                  <Link to="/tractors" style={styles.statLink}>Browse</Link>
                </div>
              </div>

              <div style={styles.roleInfoCard}>
                <h4 style={styles.roleInfoTitle}>Your Role</h4>
                <p style={styles.roleInfoText}>
                  {user?.role === 'farmer' &&
                    '🌾 As a Farmer you can browse and book tractors for your fields.'}
                  {user?.role === 'owner' &&
                    '🚜 As an Owner you can list your tractors and manage bookings.'}
                  {user?.role === 'dealer' &&
                    '🏪 As a Dealer you can list tractors for sale and rent.'}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' },
  pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' },
  profileCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px', textAlign: 'center' },
  avatarBox: { marginBottom: '20px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#15803d', color: 'white', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  userName: { fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' },
  roleBadge: { display: 'inline-block', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' },
  verifiedBadge: { color: '#15803d', fontSize: '13px', marginTop: '8px' },
  infoList: { textAlign: 'left', marginTop: '20px', marginBottom: '20px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
  infoIcon: { fontSize: '18px' },
  infoText: { color: '#374151', fontSize: '14px' },
  editBtn: { width: '100%', backgroundColor: '#f3f4f6', color: '#374151', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  rightSection: {},
  success: { backgroundColor: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontWeight: '500' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  formCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' },
  formTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', marginTop: '0' },
  row: { display: 'flex' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  saveBtn: { width: '100%', backgroundColor: '#15803d', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  statsSection: {},
  statsTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' },
  statCard: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' },
  statIcon: { fontSize: '28px' },
  statLabel: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  statLink: { color: '#15803d', textDecoration: 'none', fontSize: '13px', fontWeight: '500' },
  roleInfoCard: { backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #86efac' },
  roleInfoTitle: { fontSize: '15px', fontWeight: 'bold', color: '#15803d', margin: '0 0 8px' },
  roleInfoText: { color: '#374151', fontSize: '14px', margin: '0', lineHeight: '1.6' },
};
