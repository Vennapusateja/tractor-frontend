import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [rentalOpen, setRentalOpen] = useState(false);
  const [buyingOpen, setBuyingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    navigate('/login');
  };

  const closeAll = () => {
    setRentalOpen(false);
    setBuyingOpen(false);
  };

  return (
    <nav style={styles.nav}>

      <Link to="/" style={styles.logo} onClick={closeAll}>
        🚜 VMMR 
        TractorBazaar
      </Link>

      <div style={styles.centerMenu}>

        {/* RENTAL DROPDOWN */}
        <div
          style={styles.dropdown}
          onMouseEnter={() => { setRentalOpen(true); setBuyingOpen(false); }}
          onMouseLeave={() => setRentalOpen(false)}
        >
          <button style={styles.dropdownBtn}>
            📅 Rental &amp; Booking ▾
          </button>
          {rentalOpen && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownHeader}>For Farmers</div>
              <Link to="/tractors" style={styles.dropdownItem} onClick={closeAll}>
                🚜 Browse Tractors for Rent
              </Link>
              <Link to="/bookings" style={styles.dropdownItem} onClick={closeAll}>
                📋 My Bookings
              </Link>
              <div style={styles.dropdownDivider} />
              <div style={styles.dropdownHeader}>For Owners</div>
              <Link to="/add-tractor" style={styles.dropdownItem} onClick={closeAll}>
                ➕ List My Tractor for Rent
              </Link>
              <Link to="/dashboard" style={styles.dropdownItem} onClick={closeAll}>
                🛠 Manage Bookings
              </Link>
            </div>
          )}
        </div>

        {/* BUY/SELL DROPDOWN */}
        <div
          style={styles.dropdown}
          onMouseEnter={() => { setBuyingOpen(true); setRentalOpen(false); }}
          onMouseLeave={() => setBuyingOpen(false)}
        >
          <button style={styles.dropdownBtn}>
            🏪 Buy &amp; Sell Tractors ▾
          </button>
          {buyingOpen && (
            <div style={styles.dropdownMenu}>
              <div style={styles.dropdownHeader}>For Buyers</div>
              <Link to="/buy-tractors" style={styles.dropdownItem} onClick={closeAll}>
                🔍 Browse Tractors for Sale
              </Link>
              <Link to="/equipment" style={styles.dropdownItem} onClick={closeAll}>
                🔧 Browse Equipment
              </Link>
              <div style={styles.dropdownDivider} />
              <div style={styles.dropdownHeader}>For Sellers</div>
              <Link to="/add-tractor" style={styles.dropdownItem} onClick={closeAll}>
                ➕ List Tractor for Sale
              </Link>
              <Link to="/dashboard" style={styles.dropdownItem} onClick={closeAll}>
                📊 My Listings
              </Link>
            </div>
          )}
        </div>

      </div>

      <div style={styles.rightMenu}>
        {user ? (
          <>
            <Link to="/profile" style={styles.profileBtn} onClick={closeAll}>
              👤 {user.name}
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.loginBtn}    onClick={closeAll}>Login</Link>
            <Link to="/register" style={styles.registerBtn} onClick={closeAll}>Register Free</Link>
          </>
        )}
      </div>

      <button
        style={styles.hamburger}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && (
        <div style={styles.mobileMenu}>
          <p style={styles.mobileSection}>📅 Rental &amp; Booking</p>
          <Link to="/tractors"    style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Browse Tractors for Rent</Link>
          <Link to="/bookings"    style={styles.mobileLink} onClick={() => setMobileOpen(false)}>My Bookings</Link>
          <Link to="/add-tractor" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>List My Tractor for Rent</Link>
          <Link to="/dashboard"   style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Manage Bookings</Link>

          <div style={styles.mobileDivider} />

          <p style={styles.mobileSection}>🏪 Buy &amp; Sell Tractors</p>
          <Link to="/buy-tractors" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Browse Tractors for Sale</Link>
          <Link to="/equipment"    style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Browse Equipment</Link>
          <Link to="/add-tractor"  style={styles.mobileLink} onClick={() => setMobileOpen(false)}>List Tractor for Sale</Link>

          <div style={styles.mobileDivider} />

          {user ? (
            <>
              <Link to="/profile" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>👤 {user.name}</Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>Register Free</Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
}

const styles = {
  nav:           { backgroundColor:'#15803d', padding:'0 24px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:1000, boxShadow:'0 2px 8px rgba(0,0,0,0.2)' },
  logo:          { color:'white', fontSize:'22px', fontWeight:'bold', textDecoration:'none', whiteSpace:'nowrap' },
  centerMenu:    { display:'flex', alignItems:'center', gap:'8px' },
  dropdown:      { position:'relative' },
  dropdownBtn:   { backgroundColor:'rgba(255,255,255,0.15)', color:'white', border:'none', padding:'10px 18px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', fontWeight:'600', whiteSpace:'nowrap' },
  dropdownMenu:  { position:'absolute', top:'48px', left:'0', backgroundColor:'white', borderRadius:'12px', boxShadow:'0 8px 30px rgba(0,0,0,0.15)', minWidth:'240px', padding:'8px 0', zIndex:2000 },
  dropdownHeader:{ fontSize:'11px', fontWeight:'700', color:'#6b7280', textTransform:'uppercase', letterSpacing:'1px', padding:'8px 16px 4px' },
  dropdownItem:  { display:'block', padding:'10px 16px', color:'#111827', textDecoration:'none', fontSize:'14px', fontWeight:'500' },
  dropdownDivider:{ height:'1px', backgroundColor:'#f3f4f6', margin:'8px 0' },
  rightMenu:     { display:'flex', alignItems:'center', gap:'12px' },
  loginBtn:      { color:'white', textDecoration:'none', fontSize:'15px', fontWeight:'500' },
  registerBtn:   { backgroundColor:'white', color:'#15803d', padding:'8px 16px', borderRadius:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px', whiteSpace:'nowrap' },
  profileBtn:    { color:'white', textDecoration:'none', fontSize:'14px', fontWeight:'500', backgroundColor:'rgba(255,255,255,0.15)', padding:'8px 14px', borderRadius:'20px', whiteSpace:'nowrap' },
  logoutBtn:     { backgroundColor:'transparent', color:'white', border:'1px solid white', padding:'7px 14px', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  hamburger:     { display:'none', backgroundColor:'transparent', border:'none', color:'white', fontSize:'24px', cursor:'pointer' },
  mobileMenu:    { position:'absolute', top:'64px', left:0, right:0, backgroundColor:'#15803d', padding:'16px 24px', display:'flex', flexDirection:'column', gap:'4px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', zIndex:1999 },
  mobileSection: { color:'rgba(255,255,255,0.7)', fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', margin:'8px 0 4px' },
  mobileLink:    { color:'white', textDecoration:'none', fontSize:'15px', fontWeight:'500', padding:'8px 0' },
  mobileDivider: { height:'1px', backgroundColor:'rgba(255,255,255,0.2)', margin:'8px 0' },
  mobileLogout:  { backgroundColor:'transparent', color:'white', border:'1px solid white', padding:'10px', borderRadius:'8px', cursor:'pointer', fontSize:'15px', marginTop:'8px', textAlign:'left' },
};
