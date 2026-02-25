/**
 * Renders a pulsing "backend waking up" banner.
 * Pass `show={true}` when loading has taken too long.
 */
export default function SlowBackendBanner({ show }) {
    if (!show) return null;
    return (
        <div style={styles.banner}>
            <span style={styles.icon}>☕</span>
            <div>
                <strong>Backend is waking up...</strong>
                <br />
                <span style={styles.sub}>
                    The server was asleep (free tier). First load can take 30–60 seconds. Hang tight!
                </span>
            </div>
        </div>
    );
}

const styles = {
    banner: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#92400e',
        animation: 'pulse 2s ease-in-out infinite',
    },
    icon: { fontSize: '28px', flexShrink: 0 },
    sub: { fontSize: '13px', color: '#b45309' },
};

// Inject pulse keyframes once
if (!document.getElementById('slowBackend-pulse')) {
    const s = document.createElement('style');
    s.id = 'slowBackend-pulse';
    s.innerHTML = '@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }';
    document.head.appendChild(s);
}
