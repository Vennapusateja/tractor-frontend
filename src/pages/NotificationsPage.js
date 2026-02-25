import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function NotificationsPage() {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await API.get('/notifications/');
            const data = res.data;
            if (Array.isArray(data)) {
                setNotifications(data);
            } else if (data.results) {
                setNotifications(data.results);
            } else {
                setNotifications([]);
            }
        } catch {
            // If API not available use dummy data
            setNotifications(getDummyNotifications());
        } finally {
            setLoading(false);
        }
    };

    const getDummyNotifications = () => [
        {
            id: 1,
            type: 'booking_confirmed',
            title: 'Booking Confirmed!',
            message: 'Your booking for Mahindra 575 DI has been confirmed by the owner.',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            link: '/bookings',
        },
        {
            id: 2,
            type: 'booking_request',
            title: 'New Booking Request',
            message: 'Farmer Ranjit Singh has requested your John Deere 5050D for 3 days.',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            link: '/dashboard',
        },
        {
            id: 3,
            type: 'booking_cancelled',
            title: 'Booking Cancelled',
            message: 'Your booking #5 for Sonalika 60 has been cancelled.',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            link: '/bookings',
        },
        {
            id: 4,
            type: 'review',
            title: 'New Review Received',
            message: 'Suresh Kumar gave your tractor 5 stars! "Excellent service!"',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            link: '/dashboard',
        },
        {
            id: 5,
            type: 'payment',
            title: 'Payment Received',
            message: 'You received ₹2500 for booking #3. Amount will be transferred within 2 days.',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            link: '/dashboard',
        },
        {
            id: 6,
            type: 'system',
            title: 'Welcome to TractorBazaar!',
            message: 'Your account has been created successfully. Start browsing tractors now!',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
            link: '/tractors',
        },
    ];

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/`, { is_read: true });
        } catch { }
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        ));
    };

    const markAllRead = async () => {
        try {
            await API.post('/notifications/mark-all-read/');
        } catch { }
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 60) return `${mins} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    };

    const getIcon = (type) => {
        const icons = {
            booking_confirmed: '✅',
            booking_request: '📅',
            booking_cancelled: '❌',
            booking_completed: '🎉',
            review: '⭐',
            payment: '💰',
            system: '🔔',
        };
        return icons[type] || '🔔';
    };

    const getColor = (type) => {
        const colors = {
            booking_confirmed: '#15803d',
            booking_request: '#2563eb',
            booking_cancelled: '#dc2626',
            booking_completed: '#7c3aed',
            review: '#f59e0b',
            payment: '#15803d',
            system: '#6b7280',
        };
        return colors[type] || '#6b7280';
    };

    const getBg = (type) => {
        const bgs = {
            booking_confirmed: '#dcfce7',
            booking_request: '#dbeafe',
            booking_cancelled: '#fee2e2',
            booking_completed: '#f5f3ff',
            review: '#fef3c7',
            payment: '#dcfce7',
            system: '#f3f4f6',
        };
        return bgs[type] || '#f3f4f6';
    };

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'booking', label: 'Bookings' },
        { key: 'payment', label: 'Payments' },
        { key: 'review', label: 'Reviews' },
    ];

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.is_read;
        if (filter === 'booking') return n.type.includes('booking');
        if (filter === 'payment') return n.type === 'payment';
        if (filter === 'review') return n.type === 'review';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (!user) return (
        <div style={styles.center}>
            <h2>Please login to view notifications</h2>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
        </div>
    );

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        🔔 Notifications
                        {unreadCount > 0 && (
                            <span style={styles.unreadBadge}>{unreadCount}</span>
                        )}
                    </h1>
                    <p style={styles.subtitle}>Stay updated with your bookings and activity</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} style={styles.markAllBtn}>
                        ✅ Mark all as read
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            ...styles.tab,
                            ...(filter === tab.key ? styles.activeTab : {})
                        }}
                    >
                        {tab.label}
                        {tab.key === 'unread' && unreadCount > 0 && (
                            <span style={styles.tabBadge}>{unreadCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading && (
                <div style={styles.loading}>Loading notifications...</div>
            )}

            {!loading && filteredNotifications.length === 0 && (
                <div style={styles.empty}>
                    <div style={{ fontSize: '64px' }}>🔔</div>
                    <h3>No notifications</h3>
                    <p>You are all caught up!</p>
                </div>
            )}

            {/* Notifications list */}
            <div style={styles.list}>
                {filteredNotifications.map(notification => (
                    <div
                        key={notification.id}
                        style={{
                            ...styles.notificationCard,
                            backgroundColor: notification.is_read ? 'white' : '#f0fdf4',
                            borderLeft: `4px solid ${getColor(notification.type)}`,
                        }}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <div style={styles.notifLeft}>
                            <div style={{
                                ...styles.iconBox,
                                backgroundColor: getBg(notification.type),
                            }}>
                                <span style={{ fontSize: '24px' }}>
                                    {getIcon(notification.type)}
                                </span>
                            </div>
                        </div>

                        <div style={styles.notifContent}>
                            <div style={styles.notifHeader}>
                                <h3 style={{
                                    ...styles.notifTitle,
                                    fontWeight: notification.is_read ? '500' : '700',
                                }}>
                                    {notification.title}
                                    {!notification.is_read && (
                                        <span style={styles.newDot} />
                                    )}
                                </h3>
                                <span style={styles.timeAgo}>
                                    {getTimeAgo(notification.created_at)}
                                </span>
                            </div>
                            <p style={styles.notifMessage}>{notification.message}</p>
                            <div style={styles.notifActions}>
                                {notification.link && (
                                    <Link
                                        to={notification.link}
                                        style={{ ...styles.viewBtn, color: getColor(notification.type) }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View Details →
                                    </Link>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    style={styles.deleteBtn}
                                >
                                    ✕ Dismiss
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
    center: { textAlign: 'center', padding: '80px' },
    loginBtn: { backgroundColor: '#15803d', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '16px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0', display: 'flex', alignItems: 'center', gap: '12px' },
    unreadBadge: { backgroundColor: '#dc2626', color: 'white', fontSize: '14px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' },
    subtitle: { color: '#6b7280', marginTop: '4px' },
    markAllBtn: { backgroundColor: '#f0fdf4', color: '#15803d', padding: '10px 20px', borderRadius: '8px', border: '1px solid #15803d', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: { padding: '8px 16px', borderRadius: '8px', border: '2px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' },
    activeTab: { backgroundColor: '#15803d', color: 'white', borderColor: '#15803d' },
    tabBadge: { backgroundColor: '#dc2626', color: 'white', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' },
    loading: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    notificationCard: { display: 'flex', gap: '16px', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.1s' },
    notifLeft: { flexShrink: 0 },
    iconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    notifContent: { flex: 1 },
    notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
    notifTitle: { fontSize: '15px', color: '#111827', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' },
    newDot: { width: '8px', height: '8px', backgroundColor: '#15803d', borderRadius: '50%', display: 'inline-block' },
    timeAgo: { fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '8px' },
    notifMessage: { fontSize: '14px', color: '#4b5563', lineHeight: '1.5', margin: '0 0 10px' },
    notifActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    viewBtn: { fontSize: '13px', fontWeight: '600', textDecoration: 'none' },
    deleteBtn: { fontSize: '12px', color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0' },
};
