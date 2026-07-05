import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Image, Settings, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const nav = [
  { to: '/admin', icon: <LayoutDashboard size={15} />, label: 'Записи', end: true },
  { to: '/admin/posts', icon: <FileText size={15} />, label: 'Посты' },
  { to: '/admin/works', icon: <Image size={15} />, label: 'Галерея' },
  { to: '/admin/settings', icon: <Settings size={15} />, label: 'Настройки' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161616',
            color: '#f0f0f0',
            border: '1px solid #282828',
            borderRadius: 0,
            fontSize: 13,
          },
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: '#0d0d0d',
          borderRight: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="font-display" style={{ fontSize: 20, color: '#c41515' }}>GMN</span>
            <span className="font-display" style={{ fontSize: 20, color: '#f0f0f0', opacity: 0.8 }}>CUSTOMS</span>
          </div>
          <p style={{ fontSize: 10, color: '#2e2e2e', marginTop: 4, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
            Панель управления
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? '#f0f0f0' : '#3a3a3a',
                background: isActive ? '#161616' : 'transparent',
                borderLeft: isActive ? '2px solid #c41515' : '2px solid transparent',
                transition: 'all 0.15s',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('161616')) {
                  e.currentTarget.style.color = '#8a8a8a';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes('161616')) {
                  e.currentTarget.style.color = '#3a3a3a';
                }
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid #1a1a1a' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#2e2e2e',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c41515')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2e2e2e')}
          >
            <LogOut size={15} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ marginLeft: 220, flex: 1, padding: '48px 56px', minWidth: 0, maxWidth: 'calc(1240px + 220px)' }}>
        <div style={{ maxWidth: 1100 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
