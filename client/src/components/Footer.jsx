import { Link } from 'react-router-dom';
import Container from './Container';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1a1a1a', background: '#0a0a0a' }}>
      <Container style={{ padding: '56px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 80px' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
              <span className="font-display" style={{ fontSize: 22, color: '#c41515' }}>GMN</span>
              <span className="font-display" style={{ fontSize: 22, color: '#f0f0f0', opacity: 0.8 }}>CUSTOMS</span>
            </div>
            <p style={{ fontSize: 13, color: '#3a3a3a', lineHeight: 1.8, maxWidth: 280 }}>
              Студия кастомизации автомобилей. Аэрография, винилирование, детейлинг.
            </p>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515', marginBottom: 4 }}>
              Разделы
            </p>
            {[
              { to: '/', label: 'Главная' },
              { to: '/gallery', label: 'Работы' },
              { to: '/blog', label: 'Блог' },
              { to: '/booking', label: 'Записаться' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ color: '#3a3a3a', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.target.style.color = '#8a8a8a')}
                onMouseLeave={(e) => (e.target.style.color = '#3a3a3a')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515', marginBottom: 4 }}>
              Контакты
            </p>
            <a
              href="https://vk.com/gmncustoms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3a3a3a', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.target.style.color = '#8a8a8a')}
              onMouseLeave={(e) => (e.target.style.color = '#3a3a3a')}
            >
              ВКонтакте
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #141414', marginTop: 48, paddingTop: 24 }}>
          <p style={{ color: '#282828', fontSize: 12 }}>© {new Date().getFullYear()} GMN Customs</p>
        </div>
      </Container>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  );
}
