import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password2: '',
    role: 'farmer',
    state: '',
    district: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.phone) setError('Phone number already registered.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.emoji}>🚜</div>
          <h2 style={styles.title}>TractorBazaar</h2>
          <p style={styles.subtitle}>Create your account</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Phone */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email (optional)</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* Role */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="farmer">Farmer — I want to rent tractors</option>
              <option value="owner">Owner — I want to list my tractor</option>
              <option value="dealer">Dealer — I want to sell tractors</option>
            </select>
          </div>

          {/* State and District */}
          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1, marginRight: '8px'}}>
              <label style={styles.label}>State</label>
              <input
                name="state"
                placeholder="Punjab"
                value={formData.state}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>District</label>
              <input
                name="district"
                placeholder="Ludhiana"
                value={formData.district}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="password2"
              type="password"
              placeholder="Repeat your password"
              value={formData.password2}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* Login link */}
        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  emoji: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#15803d',
    margin: '0',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '4px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '14px',
  },
  row: {
    display: 'flex',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    backgroundColor: '#15803d',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
  },
  loginText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '24px',
    fontSize: '14px',
  },
  link: {
    color: '#15803d',
    fontWeight: '600',
    textDecoration: 'none',
  },
};