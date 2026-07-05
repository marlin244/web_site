import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Container from './Container';

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/gallery', label: 'Работы' },
  { to: '/blog', label: 'Блог' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <nav
        style={{
          background: 'rgba(10,10,10,0.97)',
          borderBottom: '1px solid #1e1e1e',
          height: 60,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', flexShrink: 0 }}>
            <span className="font-display" style={{ fontSize: 22, color: '#c41515', lineHeight: 1 }}>GMN</span>
            <span className="font-display" style={{ fontSize: 22, color: '#f0f0f0', opacity: 0.88, lineHeight: 1 }}>CUSTOMS</span>
          </Link>

          {/* Desktop nav */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none', margin: 0, padding: 0 }} className="nav-desktop">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  style={({ isActive }) => ({
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? '#f0f0f0' : '#4a4a4a',
                    transition: 'color 0.15s',
                  })}
                  onMouseEnter={(e) => { if (e.target.style.color !== 'rgb(240, 240, 240)') e.target.style.color = '#8a8a8a'; }}
                  onMouseLeave={(e) => { if (e.target.style.color !== 'rgb(240, 240, 240)') e.target.style.color = '#4a4a4a'; }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              to="/booking"
              className="btn-red nav-cta"
              style={{ fontSize: 11, padding: '10px 22px' }}
            >
              Записаться
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="nav-burger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexDirection: 'column', gap: 5, display: 'none' }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: 22,
                    height: 1.5,
                    background: '#f0f0f0',
                    transition: 'all 0.2s',
                    transform:
                      i === 0 && open ? 'rotate(45deg) translateY(6.5px)' :
                      i === 2 && open ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
                    opacity: i === 1 && open ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: '#111',
            borderBottom: '1px solid #1e1e1e',
            padding: '24px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
          className="nav-mobile"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? '#f0f0f0' : '#4a4a4a',
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="btn-red"
            style={{ fontSize: 11, padding: '10px 22px', alignSelf: 'flex-start' }}
          >
            Записаться
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
