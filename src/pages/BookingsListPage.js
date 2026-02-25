import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import useSlowBackend from '../hooks/useSlowBackend';
import SlowBackendBanner from '../components/SlowBackendBanner';

const STATUS_COLORS = {
    pending: { bg: '#fef3c7', color: '#d97706' },
    confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
    active: { bg: '#dcfce7', color: '#15803d' },
    completed: { bg: '#f3f4f6', color: '#6b7280' },
    rejected: { bg: '#fee2e2', color: '#dc2626' },
    cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export default function BookingsListPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const slowWarning = useSlowBackend(loading);

    useEffect(() => {
        API.get('/bookings/')
            .then(res => {
                const data = res.data;
                if (Array.isArray(data)) setBookings(data);
                else if (Array.isArray(data.results)) setBookings(data.results);
                else setBookings([]);
            })
            .catch(() => setError('Failed to load bookings. Please try again.'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line
    }, []);

    return (
        <div style={styles.container}>
            <Link to="/tractors" style={styles.backLink}>← Browse Tractors</Link>
            <h1 style={styles.title}>📅 My Bookings</h1>

            <SlowBackendBanner show={slowWarning} />
            {loading && <div style={styles.center}>Loading bookings...</div>}
            {error && <div style={styles.error}>{error}</div>}

            {!loading && !error && bookings.length === 0 && (
                <div style={styles.empty}>
                    <div style={{ fontSize: '64px' }}>📅</div>
                    <h3>No bookings yet</h3>
                    <p>Book a tractor to get started!</p>
                    <Link to="/tractors" style={styles.browseBtn}>Browse Tractors</Link>
                </div>
            )}

            <div style={styles.list}>
                {bookings.map(booking => {
                    const s = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
                    return (
                        <div key={booking.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <h3 style={styles.tractorName}>
                                        🚜 {booking.tractor_detail?.brand} {booking.tractor_detail?.model_name}
                                    </h3>
                                    <div style={styles.dates}>
                                        📅 {booking.start_date} → {booking.end_date}
                                    </div>
                                </div>
                                <span style={{ ...styles.statusBadge, backgroundColor: s.bg, color: s.color }}>
                                    {booking.status?.toUpperCase()}
                                </span>
                            </div>

                            <div style={styles.details}>
                                {booking.rent_type && (
                                    <span style={styles.detail}>Type: {booking.rent_type}</span>
                                )}
                                {booking.total_price && (
                                    <span style={styles.detail}>💰 ₹{Number(booking.total_price).toLocaleString('en-IN')}</span>
                                )}
                                {booking.contact_phone && (
                                    <span style={styles.detail}>📱 {booking.contact_phone}</span>
                                )}
                                {booking.delivery_address && (
                                    <span style={styles.detail}>📍 {booking.delivery_address}</span>
                                )}
                            </div>

                            {booking.tractor_detail?.id && (
                                <Link
                                    to={`/tractors/${booking.tractor_detail.id}`}
                                    style={styles.viewLink}
                                >
                                    View Tractor →
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
    backLink: { color: '#15803d', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '16px 0 24px' },
    center: { textAlign: 'center', padding: '60px', color: '#6b7280', fontSize: '18px' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
    empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    browseBtn: { display: 'inline-block', marginTop: '16px', backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
    list: { display: 'flex', flexDirection: 'column', gap: '16px' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '20px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' },
    tractorName: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px' },
    dates: { fontSize: '14px', color: '#6b7280' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
    details: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' },
    detail: { fontSize: '13px', backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: '6px' },
    viewLink: { color: '#15803d', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
};
