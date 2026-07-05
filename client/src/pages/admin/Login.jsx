import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch {
      toast.error('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="font-display" style={{ fontSize: 28, color: '#c41515' }}>GMN</span>
            <span className="font-display" style={{ fontSize: 28, color: '#f0f0f0', opacity: 0.85 }}>CUSTOMS</span>
          </div>
          <p
            style={{
              fontSize: 10,
              color: '#2e2e2e',
              marginTop: 6,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Панель управления
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <input
            type="text"
            placeholder="Логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-red"
            style={{ marginTop: 24, justifyContent: 'center', opacity: loading ? 0.6 : 1, width: '100%' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
