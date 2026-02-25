import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinner} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

const styles = {
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
    spinner: {
        width: '40px', height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #15803d',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};

// Inject keyframes once
if (!document.getElementById('privateRoute-spin')) {
    const style = document.createElement('style');
    style.id = 'privateRoute-spin';
    style.innerHTML = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
}
