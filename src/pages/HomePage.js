import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
    const { user } = useAuth();

    const stats = [
        { number: '500+', label: 'Tractors Listed' },
        { number: '1000+', label: 'Happy Farmers' },
        { number: '50+', label: 'Districts Covered' },
        { number: '24/7', label: 'Support Available' },
    ];

    const features = [
        {
            icon: '🚜',
            title: 'Rent a Tractor',
            desc: 'Find tractors for rent near you by hour or acre. Compare prices and book instantly.',
            link: '/tractors',
            btnText: 'Browse Rentals',
            color: '#15803d',
            bg: '#f0fdf4',
        },
        {
            icon: '🏪',
            title: 'Buy a Tractor',
            desc: 'Browse quality used and new tractors for sale at the best prices across India.',
            link: '/buy-tractors',
            btnText: 'Browse for Sale',
            color: '#d97706',
            bg: '#fef3c7',
        },
        {
            icon: '🔧',
            title: 'Farm Equipment',
            desc: 'Find rotavators, cultivators, sprayers and more equipment for rent or sale.',
            link: '/equipment',
            btnText: 'Browse Equipment',
            color: '#2563eb',
            bg: '#eff6ff',
        },
        {
            icon: '➕',
            title: 'List Your Tractor',
            desc: 'Earn money by listing your tractor for rent or sell it at the best price.',
            link: '/add-tractor',
            btnText: 'List Now',
            color: '#7c3aed',
            bg: '#f5f3ff',
        },
    ];

    const howItWorks = [
        { step: '1', icon: '📱', title: 'Register', desc: 'Create your free account as farmer, owner or dealer' },
        { step: '2', icon: '🔍', title: 'Search', desc: 'Browse tractors and equipment near your location' },
        { step: '3', icon: '📅', title: 'Book', desc: 'Book your tractor with dates and get confirmation' },
        { step: '4', icon: '🚜', title: 'Farm', desc: 'Tractor arrives at your farm and work begins' },
    ];

    const testimonials = [
        { name: 'Ranjit Singh', role: 'Farmer, Punjab', text: 'I found a Mahindra tractor for rent in just 10 minutes. Amazing service!', avatar: '👨🌾' },
        { name: 'Suresh Kumar', role: 'Owner, Haryana', text: 'Listed my tractor and got bookings within 2 days. Great platform!', avatar: '👨💼' },
        { name: 'Priya Devi', role: 'Farmer, UP', text: 'Very easy to use. Found equipment at half the market price.', avatar: '👩🌾' },
    ];

    return (
        <div style={styles.page}>

            {/* HERO SECTION */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        India's Smartest<br />
                        <span style={styles.heroHighlight}>Farm Equipment</span><br />
                        Marketplace
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Rent tractors, buy equipment, and connect with farmers across India.
                        The easiest way to access farm machinery.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/tractors" style={styles.heroBtnPrimary}>
                            🚜 Rent a Tractor
                        </Link>
                        <Link to="/buy-tractors" style={styles.heroBtnSecondary}>
                            🏪 Buy a Tractor
                        </Link>
                    </div>
                    {!user && (
                        <p style={styles.heroNote}>
                            Free to join! <Link to="/register" style={styles.heroLink}>Create account →</Link>
                        </p>
                    )}
                </div>
                <div style={styles.heroImage}>
                    <img
                        src="/images/tractor1.png"
                        alt="Tractor in field"
                        style={styles.heroImg}
                    />
                </div>
            </div>

            {/* STATS */}
            <div style={styles.statsSection}>
                {stats.map((stat, i) => (
                    <div key={i} style={styles.statBox}>
                        <span style={styles.statNumber}>{stat.number}</span>
                        <span style={styles.statLabel}>{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* FEATURES */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>What can you do on TractorBazaar?</h2>
                <p style={styles.sectionSubtitle}>Everything you need for farm equipment in one place</p>
                <div style={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <div key={i} style={{ ...styles.featureCard, backgroundColor: f.bg }}>
                            <div style={styles.featureIcon}>{f.icon}</div>
                            <h3 style={{ ...styles.featureTitle, color: f.color }}>{f.title}</h3>
                            <p style={styles.featureDesc}>{f.desc}</p>
                            <Link to={f.link} style={{ ...styles.featureBtn, backgroundColor: f.color }}>
                                {f.btnText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div style={{ ...styles.section, backgroundColor: '#f9fafb', padding: '60px 24px' }}>
                <h2 style={styles.sectionTitle}>How it works</h2>
                <p style={styles.sectionSubtitle}>Get a tractor in 4 simple steps</p>
                <div style={styles.stepsGrid}>
                    {howItWorks.map((step, i) => (
                        <div key={i} style={styles.stepCard}>
                            <div style={styles.stepNumber}>{step.step}</div>
                            <div style={styles.stepIcon}>{step.icon}</div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <p style={styles.stepDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>What farmers say</h2>
                <p style={styles.sectionSubtitle}>Trusted by thousands of farmers across India</p>
                <div style={styles.testimonialsGrid}>
                    {testimonials.map((t, i) => (
                        <div key={i} style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"{t.text}"</p>
                            <div style={styles.testimonialAuthor}>
                                <span style={styles.testimonialAvatar}>{t.avatar}</span>
                                <div>
                                    <p style={styles.testimonialName}>{t.name}</p>
                                    <p style={styles.testimonialRole}>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA SECTION */}
            <div style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Ready to get started?</h2>
                <p style={styles.ctaSubtitle}>
                    Join thousands of farmers and tractor owners on TractorBazaar
                </p>
                <div style={styles.ctaButtons}>
                    {user ? (
                        <>
                            <Link to="/tractors" style={styles.ctaBtnPrimary}>Browse Tractors</Link>
                            <Link to="/dashboard" style={styles.ctaBtnSecondary}>Go to Dashboard</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" style={styles.ctaBtnPrimary}>Create Free Account</Link>
                            <Link to="/login" style={styles.ctaBtnSecondary}>Login</Link>
                        </>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>
                        <h3 style={styles.footerLogo}>🚜 TractorBazaar</h3>
                        <p style={styles.footerTagline}>India's Smart Farm Equipment Marketplace</p>
                    </div>
                    <div style={styles.footerLinks}>
                        <h4 style={styles.footerHeading}>For Farmers</h4>
                        <Link to="/tractors" style={styles.footerLink}>Rent a Tractor</Link>
                        <Link to="/buy-tractors" style={styles.footerLink}>Buy a Tractor</Link>
                        <Link to="/equipment" style={styles.footerLink}>Farm Equipment</Link>
                    </div>
                    <div style={styles.footerLinks}>
                        <h4 style={styles.footerHeading}>For Owners</h4>
                        <Link to="/add-tractor" style={styles.footerLink}>List Your Tractor</Link>
                        <Link to="/dashboard" style={styles.footerLink}>Dashboard</Link>
                        <Link to="/profile" style={styles.footerLink}>My Profile</Link>
                    </div>
                    <div style={styles.footerLinks}>
                        <h4 style={styles.footerHeading}>Account</h4>
                        <Link to="/register" style={styles.footerLink}>Register Free</Link>
                        <Link to="/login" style={styles.footerLink}>Login</Link>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p style={styles.footerCopy}>© 2026 TractorBazaar. All rights reserved.</p>
                </div>
            </div>

        </div>
    );
}

const styles = {
    page: { backgroundColor: '#ffffff' },
    hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 80px', backgroundColor: '#f0fdf4', gap: '40px', flexWrap: 'wrap' },
    heroContent: { flex: 1, minWidth: '300px' },
    heroTitle: { fontSize: '48px', fontWeight: '900', color: '#111827', lineHeight: '1.2', margin: '0 0 20px' },
    heroHighlight: { color: '#15803d' },
    heroSubtitle: { fontSize: '18px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 32px', maxWidth: '500px' },
    heroButtons: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    heroBtnPrimary: { backgroundColor: '#15803d', color: 'white', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' },
    heroBtnSecondary: { backgroundColor: 'white', color: '#15803d', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '2px solid #15803d' },
    heroNote: { marginTop: '20px', fontSize: '14px', color: '#6b7280' },
    heroLink: { color: '#15803d', fontWeight: '600' },
    heroImage: { flex: 1, minWidth: '300px' },
    heroImg: { width: '100%', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    statsSection: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', backgroundColor: '#15803d' },
    statBox: { padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.2)' },
    statNumber: { fontSize: '36px', fontWeight: '900', color: 'white' },
    statLabel: { fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    section: { padding: '60px 80px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
    sectionTitle: { fontSize: '36px', fontWeight: 'bold', color: '#111827', textAlign: 'center', margin: '0 0 12px' },
    sectionSubtitle: { fontSize: '16px', color: '#6b7280', textAlign: 'center', margin: '0 0 48px' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
    featureCard: { padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    featureIcon: { fontSize: '48px' },
    featureTitle: { fontSize: '20px', fontWeight: 'bold', margin: '0' },
    featureDesc: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0', flex: 1 },
    featureBtn: { color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', textAlign: 'center', marginTop: '8px' },
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' },
    stepCard: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    stepNumber: { width: '40px', height: '40px', backgroundColor: '#15803d', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', margin: '0 auto 16px' },
    stepIcon: { fontSize: '40px', marginBottom: '12px' },
    stepTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' },
    stepDesc: { fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: '0' },
    testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
    testimonialCard: { backgroundColor: '#f9fafb', padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb' },
    testimonialText: { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 20px', fontStyle: 'italic' },
    testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
    testimonialAvatar: { fontSize: '36px' },
    testimonialName: { fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0' },
    testimonialRole: { fontSize: '13px', color: '#6b7280', margin: '0' },
    ctaSection: { backgroundColor: '#15803d', padding: '80px', textAlign: 'center' },
    ctaTitle: { fontSize: '40px', fontWeight: 'bold', color: 'white', margin: '0 0 16px' },
    ctaSubtitle: { fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: '0 0 40px' },
    ctaButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtnPrimary: { backgroundColor: 'white', color: '#15803d', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' },
    ctaBtnSecondary: { backgroundColor: 'transparent', color: 'white', padding: '16px 40px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '2px solid white' },
    footer: { backgroundColor: '#111827', padding: '60px 80px 0' },
    footerContent: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' },
    footerBrand: {},
    footerLogo: { color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px' },
    footerTagline: { color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' },
    footerLinks: { display: 'flex', flexDirection: 'column', gap: '8px' },
    footerHeading: { color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px' },
    footerLink: { color: '#9ca3af', textDecoration: 'none', fontSize: '14px' },
    footerBottom: { borderTop: '1px solid #374151', padding: '24px 0', textAlign: 'center' },
    footerCopy: { color: '#6b7280', fontSize: '14px', margin: '0' },
};
