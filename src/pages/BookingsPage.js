import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingsPage() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await API.get('/bookings/my/');
            const data = res.data;
            if (Array.isArray(data)) {
                setBookings(data);
            } else if (data.results) {
                setBookings(data.results);
            } else {
                setBookings([]);
            }
        } catch (err) {
            setError('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await API.patch(`/bookings/${id}/status/`, { status: 'cancelled' });
            fetchBookings();
        } catch {
            alert('Failed to cancel booking.');
        }
    };

    const statusColor = {
        pending: { bg: '#fef3c7', color: '#d97706' },
        confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
        active: { bg: '#dcfce7', color: '#15803d' },
        completed: { bg: '#f3f4f6', color: '#374151' },
        cancelled: { bg: '#fee2e2', color: '#dc2626' },
    };

    const tabs = [
        { key: 'all', label: 'All Bookings' },
        { key: 'pending', label: '⏳ Pending' },
        { key: 'confirmed', label: '✅ Confirmed' },
        { key: 'active', label: '🚜 Active' },
        { key: 'completed', label: '📋 Completed' },
        { key: 'cancelled', label: '❌ Cancelled' },
    ];

    const filteredBookings = activeTab === 'all'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    if (!user) return (
        <div style={styles.center}>
            <h2>Please login to view your bookings</h2>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
        </div>
    );

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>📋 My Bookings</h1>
            <p style={styles.subtitle}>Track all your tractor booking requests</p>

            {/* Stats */}
            <div style={styles.statsRow}>
                <div style={styles.statBox}>
                    <span style={styles.statNum}>{bookings.length}</span>
                    <span style={styles.statLabel}>Total</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{ ...styles.statNum, color: '#d97706' }}>
                        {bookings.filter(b => b.status === 'pending').length}
                    </span>
                    <span style={styles.statLabel}>Pending</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{ ...styles.statNum, color: '#1d4ed8' }}>
                        {bookings.filter(b => b.status === 'confirmed').length}
                    </span>
                    <span style={styles.statLabel}>Confirmed</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{ ...styles.statNum, color: '#15803d' }}>
                        {bookings.filter(b => b.status === 'active').length}
                    </span>
                    <span style={styles.statLabel}>Active</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{ ...styles.statNum, color: '#374151' }}>
                        {bookings.filter(b => b.status === 'completed').length}
                    </span>
                    <span style={styles.statLabel}>Completed</span>
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {/* Tabs */}
            <div style={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab.key ? styles.activeTab : {})
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading && <div style={styles.loading}>Loading bookings...</div>}

            {!loading && filteredBookings.length === 0 && (
                <div style={styles.empty}>
                    <div style={{ fontSize: '64px' }}>📋</div>
                    <h3>No bookings found</h3>
                    {activeTab === 'all' ? (
                        <>
                            <p>You have not made any bookings yet</p>
                            <Link to="/tractors" style={styles.browseBtn}>
                                Browse Tractors
                            </Link>
                        </>
                    ) : (
                        <p>No {activeTab} bookings</p>
                    )}
                </div>
            )}

            {/* Bookings list */}
            <div style={styles.bookingsList}>
                {filteredBookings.map(booking => (
                    <div key={booking.id} style={styles.bookingCard}>

                        {/* Header */}
                        <div style={styles.cardHeader}>
                            <div style={styles.cardHeaderLeft}>
                                <h3 style={styles.bookingId}>Booking #{booking.id}</h3>
                                <p style={styles.bookingDate}>
                                    Booked on {new Date(booking.created_at).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                            <span style={{
                                ...styles.statusBadge,
                                backgroundColor: statusColor[booking.status]?.bg,
                                color: statusColor[booking.status]?.color,
                            }}>
                                {booking.status}
                            </span>
                        </div>

                        {/* Tractor info */}
                        <div style={styles.tractorRow}>
                            <div style={styles.tractorImageBox}>
                                {booking.tractor?.images && booking.tractor.images.length > 0 ? (
                                    <img
                                        src={`https://tractor-backend-eey5.onrender.com${booking.tractor.images[0].image}`}
                                        alt={booking.tractor?.brand}
                                        style={styles.tractorImage}
                                    />
                                ) : (
                                    <div style={styles.noImage}>🚜</div>
                                )}
                            </div>
                            <div style={styles.tractorDetails}>
                                <h4 style={styles.tractorName}>
                                    {booking.tractor?.brand} {booking.tractor?.model_name}
                                </h4>
                                <p style={styles.tractorSpec}>
                                    ⚡ {booking.tractor?.hp} HP • 📍 {booking.tractor?.district}, {booking.tractor?.state}
                                </p>
                                <p style={styles.ownerInfo}>
                                    👤 Owner: {booking.tractor?.owner?.name} • 📱 {booking.tractor?.owner?.phone}
                                </p>
                            </div>
                        </div>

                        {/* Booking details */}
                        <div style={styles.detailsGrid}>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Start Date</span>
                                <span style={styles.detailValue}>{booking.start_date}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>End Date</span>
                                <span style={styles.detailValue}>{booking.end_date}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Rent Type</span>
                                <span style={styles.detailValue}>{booking.rent_type}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Quantity</span>
                                <span style={styles.detailValue}>{booking.quantity} {booking.rent_type}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Driver</span>
                                <span style={styles.detailValue}>
                                    {booking.driver_required ? '✅ Yes' : '❌ No'}
                                </span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Total Price</span>
                                <span style={{ ...styles.detailValue, color: '#15803d', fontWeight: '700', fontSize: '18px' }}>
                                    ₹{booking.total_price}
                                </span>
                            </div>
                        </div>

                        {booking.delivery_address && (
                            <div style={styles.addressBox}>
                                <span style={styles.detailLabel}>📍 Delivery Address</span>
                                <p style={styles.addressText}>{booking.delivery_address}</p>
                            </div>
                        )}

                        {booking.notes && (
                            <div style={styles.notesBox}>
                                <span style={styles.detailLabel}>📝 Notes</span>
                                <p style={styles.addressText}>{booking.notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={styles.cardActions}>
                            <Link
                                to={`/tractors/${booking.tractor?.id}`}
                                style={styles.viewTractorBtn}
                            >
                                View Tractor
                            </Link>
                            <a
                                href={`tel:${booking.tractor?.owner?.phone}`}
                                style={styles.callBtn}
                            >
                                📞 Call Owner
                            </a>
                            {booking.status === 'pending' && (
                                <button
                                    onClick={() => cancelBooking(booking.id)}
                                    style={styles.cancelBtn}
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {/* Browse more */}
            {!loading && bookings.length > 0 && (
                <div style={styles.browseMore}>
                    <Link to="/tractors" style={styles.browseBtn}>
                        🚜 Browse More Tractors
                    </Link>
                </div>
            )}

        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '24px 16px' },
    center: { textAlign: 'center', padding: '80px', },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0' },
    subtitle: { color: '#6b7280', marginTop: '4px', marginBottom: '24px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' },
    statBox: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' },
    statNum: { fontSize: '24px', fontWeight: 'bold', color: '#15803d' },
    statLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: { padding: '8px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#6b7280' },
    activeTab: { backgroundColor: '#15803d', color: 'white', borderColor: '#15803d' },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    bookingsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    bookingCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    cardHeaderLeft: {},
    bookingId: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px' },
    bookingDate: { fontSize: '13px', color: '#6b7280', margin: '0' },
    statusBadge: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' },
    tractorRow: { display: 'flex', gap: '16px', marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px' },
    tractorImageBox: { width: '100px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e5e7eb', flexShrink: 0 },
    tractorImage: { width: '100%', height: '100%', objectFit: 'cover' },
    noImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
    tractorDetails: { flex: 1 },
    tractorName: { fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px' },
    tractorSpec: { fontSize: '13px', color: '#6b7280', margin: '0 0 4px' },
    ownerInfo: { fontSize: '13px', color: '#374151', margin: '0' },
    detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' },
    detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
    detailLabel: { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' },
    detailValue: { fontSize: '14px', color: '#111827', fontWeight: '500' },
    addressBox: { backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '12px' },
    notesBox: { backgroundColor: '#fef9c3', padding: '12px', borderRadius: '8px', marginBottom: '12px' },
    addressText: { fontSize: '14px', color: '#374151', margin: '4px 0 0' },
    cardActions: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' },
    viewTractorBtn: { backgroundColor: '#f0fdf4', color: '#15803d', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
    callBtn: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
    cancelBtn: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    loginBtn: { backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '16px' },
    browseMore: { textAlign: 'center', marginTop: '32px' },
    browseBtn: { backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' },
};
