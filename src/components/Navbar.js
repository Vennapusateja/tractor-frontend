import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/auth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [rentalOpen, setRentalOpen] = useState(false);
  const [buyingOpen, setBuyingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await logoutUser(); } catch { }
    logout();
    navigate('/login');
  };

  const closeAll = () => {
    setRentalOpen(false);
    setBuyingOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={styles.nav}>

        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={closeAll}>
          🚜 TractorBazaar
        </Link>

        {/* Desktop center menu */}
        <div className="navbar-center">
        </div>

        {/* Desktop right menu */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/notifications" style={styles.notifBtn} onClick={closeAll}>
                🔔
              </Link>
              <Link to="/profile" style={styles.profileBtn} onClick={closeAll}>
                👤 {user.name}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn} onClick={closeAll}>Login</Link>
              <Link to="/register" style={styles.registerBtn} onClick={closeAll}>Register Free</Link>
            </>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">

          <p style={styles.mobileSection}>📅 Rental &amp; Booking</p>
          <Link to="/tractors" style={styles.mobileLink} onClick={closeAll}>🚜 Browse Tractors for Rent</Link>
          <Link to="/bookings" style={styles.mobileLink} onClick={closeAll}>📋 My Bookings</Link>
          <Link to="/add-tractor" style={styles.mobileLink} onClick={closeAll}>➕ List My Tractor for Rent</Link>
          <Link to="/dashboard" style={styles.mobileLink} onClick={closeAll}>🛠 Manage Bookings</Link>

          <div style={styles.mobileDivider} />

          <p style={styles.mobileSection}>🏪 Buy &amp; Sell Tractors</p>
          <Link to="/buy-tractors" style={styles.mobileLink} onClick={closeAll}>🔍 Browse Tractors for Sale</Link>
          <Link to="/equipment" style={styles.mobileLink} onClick={closeAll}>🔧 Browse Equipment</Link>
          <Link to="/add-tractor" style={styles.mobileLink} onClick={closeAll}>➕ List Tractor for Sale</Link>

          <div style={styles.mobileDivider} />

          {user ? (
            <>
              <Link to="/profile" style={styles.mobileLink} onClick={closeAll}>👤 {user.name}</Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={closeAll}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={closeAll}>Register Free</Link>
            </>
          )}

        </div>
      )}
    </>
  );
}

const styles = {
  nav: { backgroundColor: '#15803d', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  logo: { color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 },
  dropdown: { position: 'relative' },
  dropdownBtn: { backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' },
  dropdownMenu: { position: 'absolute', top: '48px', left: '0', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', minWidth: '240px', padding: '8px 0', zIndex: 2000 },
  dropdownHeader: { fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 16px 4px' },
  dropdownItem: { display: 'block', padding: '10px 16px', color: '#111827', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  dropdownDivider: { height: '1px', backgroundColor: '#f3f4f6', margin: '8px 0' },
  loginBtn: { color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  registerBtn: { backgroundColor: 'white', color: '#15803d', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' },
  profileBtn: { color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.15)', padding: '7px 12px', borderRadius: '20px', whiteSpace: 'nowrap' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  notifBtn: { color: 'white', textDecoration: 'none', fontSize: '20px', padding: '4px 8px' },
  mobileSection: { color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '12px 0 6px' },
  mobileLink: { color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  mobileDivider: { height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '12px 0' },
  mobileLogout: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', marginTop: '8px', textAlign: 'left' },
};