import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewsPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [tractor, setTractor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
    });

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tractorRes, reviewsRes] = await Promise.all([
                API.get(`/tractors/${id}/`),
                API.get(`/reviews/?tractor=${id}`),
            ]);
            setTractor(tractorRes.data);
            const data = reviewsRes.data;
            if (Array.isArray(data)) {
                setReviews(data);
            } else if (data.results) {
                setReviews(data.results);
            } else {
                setReviews([]);
            }
        } catch {
            setError('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await API.post('/reviews/', {
                tractor: id,
                rating: formData.rating,
                comment: formData.comment,
            });
            setSuccess('Review submitted successfully!');
            setShowForm(false);
            setFormData({ rating: 5, comment: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderStars = (rating, size = '20px') => {
        return [1, 2, 3, 4, 5].map(star => (
            <span key={star} style={{ fontSize: size, color: star <= rating ? '#f59e0b' : '#d1d5db' }}>
                ★
            </span>
        ));
    };

    const renderClickableStars = () => {
        return [1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                onClick={() => setFormData({ ...formData, rating: star })}
                style={{
                    fontSize: '36px',
                    color: star <= formData.rating ? '#f59e0b' : '#d1d5db',
                    cursor: 'pointer',
                }}
            >
                ★
            </span>
        ));
    };

    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rev => rev.rating === r).length,
        percent: reviews.length > 0
            ? Math.round((reviews.filter(rev => rev.rating === r).length / reviews.length) * 100)
            : 0,
    }));

    if (loading) return (
        <div style={styles.center}>Loading reviews...</div>
    );

    return (
        <div style={styles.container}>

            <Link to={`/tractors/${id}`} style={styles.backLink}>
                ← Back to Tractor
            </Link>

            {/* Tractor info */}
            {tractor && (
                <div style={styles.tractorCard}>
                    <div style={styles.tractorInfo}>
                        <h1 style={styles.tractorName}>
                            {tractor.brand} {tractor.model_name}
                        </h1>
                        <p style={styles.tractorSpec}>
                            ⚡ {tractor.hp} HP • 📍 {tractor.district}, {tractor.state}
                        </p>
                    </div>
                    <div style={styles.overallRating}>
                        <span style={styles.ratingNumber}>{avgRating}</span>
                        <div style={styles.stars}>{renderStars(Math.round(avgRating), '24px')}</div>
                        <span style={styles.ratingCount}>{reviews.length} reviews</span>
                    </div>
                </div>
            )}

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            {/* Rating breakdown */}
            {reviews.length > 0 && (
                <div style={styles.breakdownCard}>
                    <h3 style={styles.breakdownTitle}>Rating Breakdown</h3>
                    {ratingCounts.map(r => (
                        <div key={r.rating} style={styles.breakdownRow}>
                            <span style={styles.breakdownLabel}>{r.rating} ★</span>
                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${r.percent}%`,
                                    backgroundColor: r.rating >= 4 ? '#15803d' : r.rating === 3 ? '#f59e0b' : '#dc2626',
                                }} />
                            </div>
                            <span style={styles.breakdownCount}>{r.count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Add review button */}
            <div style={styles.reviewHeader}>
                <h2 style={styles.reviewsTitle}>
                    Reviews ({reviews.length})
                </h2>
                {user && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={styles.addReviewBtn}
                    >
                        {showForm ? '✕ Cancel' : '✍️ Write Review'}
                    </button>
                )}
                {!user && (
                    <Link to="/login" style={styles.addReviewBtn}>
                        Login to Review
                    </Link>
                )}
            </div>

            {/* Review form */}
            {showForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Write Your Review</h3>
                    <form onSubmit={handleSubmit}>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Rating</label>
                            <div style={styles.starsRow}>
                                {renderClickableStars()}
                                <span style={styles.ratingText}>
                                    {formData.rating === 5 ? 'Excellent' :
                                        formData.rating === 4 ? 'Good' :
                                            formData.rating === 3 ? 'Average' :
                                                formData.rating === 2 ? 'Poor' : 'Very Poor'}
                                </span>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Comment *</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="Share your experience with this tractor..."
                                rows={4}
                                required
                                style={{ ...styles.input, resize: 'vertical' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={styles.submitBtn}
                        >
                            {submitting ? 'Submitting...' : '✍️ Submit Review'}
                        </button>

                    </form>
                </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 && !showForm && (
                <div style={styles.empty}>
                    <div style={{ fontSize: '64px' }}>⭐</div>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this tractor!</p>
                </div>
            )}

            <div style={styles.reviewsList}>
                {reviews.map(review => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.reviewHeader2}>
                            <div style={styles.reviewerInfo}>
                                <div style={styles.avatar}>
                                    {review.farmer?.name?.[0] || '👤'}
                                </div>
                                <div>
                                    <p style={styles.reviewerName}>{review.farmer?.name || 'Anonymous'}</p>
                                    <p style={styles.reviewDate}>
                                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div style={styles.reviewStars}>
                                {renderStars(review.rating, '18px')}
                            </div>
                        </div>
                        <p style={styles.reviewComment}>{review.comment}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
    center: { textAlign: 'center', padding: '80px', color: '#6b7280' },
    backLink: { color: '#15803d', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
    tractorCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px', margin: '20px 0' },
    tractorInfo: {},
    tractorName: { fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' },
    tractorSpec: { fontSize: '14px', color: '#6b7280', margin: '0' },
    overallRating: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
    ratingNumber: { fontSize: '48px', fontWeight: '900', color: '#111827' },
    stars: { display: 'flex' },
    ratingCount: { fontSize: '13px', color: '#6b7280' },
    error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
    success: { backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
    breakdownCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' },
    breakdownTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' },
    breakdownRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
    breakdownLabel: { fontSize: '14px', color: '#374151', width: '30px', textAlign: 'right' },
    progressBar: { flex: 1, height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
    breakdownCount: { fontSize: '14px', color: '#6b7280', width: '20px' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    reviewsTitle: { fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0' },
    addReviewBtn: { backgroundColor: '#15803d', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', textDecoration: 'none' },
    formCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '24px' },
    formTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' },
    starsRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    ratingText: { fontSize: '16px', color: '#f59e0b', fontWeight: '600', marginLeft: '8px' },
    input: { width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    submitBtn: { width: '100%', backgroundColor: '#15803d', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px' },
    empty: { textAlign: 'center', padding: '60px', color: '#6b7280' },
    reviewsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    reviewCard: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px' },
    reviewHeader2: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
    reviewerInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '44px', height: '44px', backgroundColor: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' },
    reviewerName: { fontSize: '15px', fontWeight: '600', color: '#111827', margin: '0 0 2px' },
    reviewDate: { fontSize: '12px', color: '#6b7280', margin: '0' },
    reviewStars: { display: 'flex' },
    reviewComment: { fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0' },
};
