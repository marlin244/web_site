import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import Container from '../components/Container';

const SERVICES = [
  'Аэрография',
  'Частичное винилирование',
  'Полное винилирование',
  'Полировка',
  'Керамическое покрытие',
  'Тонировка',
  'Обвес / тюнинг',
  'Консультация',
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function Label({ children }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2e2e2e', display: 'block', padding: '14px 16px 0', background: '#111', lineHeight: 1 }}>
      {children}
    </span>
  );
}

export default function Booking() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', service: '', date: '', time_slot: '', comment: '' });
  const [loading, setLoading] = useState(false);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service || !form.date || !form.time_slot) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      await api.post('/bookings', form);
      toast.success('Заявка принята. Свяжемся для подтверждения.');
      setTimeout(() => navigate('/'), 2500);
    } catch {
      toast.error('Ошибка. Попробуйте позже или напишите нам ВКонтакте.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '56px 0 44px' }}>
        <Container>
          <p className="section-label">Запись</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.92, color: '#f0f0f0' }}>
            ЗАПИСАТЬСЯ<br /><span style={{ color: '#c41515' }}>НА ПРИЁМ</span>
          </h1>
        </Container>
      </div>

      <Container style={{ padding: 'clamp(40px, 4vw, 64px) 0 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0 80px', alignItems: 'start' }} className="booking-grid">
          {/* Info sidebar */}
          <div style={{ paddingTop: 8 }}>
            <div style={{ width: 28, height: 1, background: '#c41515', marginBottom: 20 }} />
            <p style={{ color: '#4a4a4a', fontSize: 14, lineHeight: 1.9, marginBottom: 48 }}>
              Заполните форму — свяжемся для подтверждения в течение часа в рабочее время.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515', marginBottom: 10 }}>ВКонтакте</p>
                <a
                  href="https://vk.com/gmncustoms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4a4a4a', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#8a8a8a')}
                  onMouseLeave={(e) => (e.target.style.color = '#4a4a4a')}
                >
                  vk.com/gmncustoms
                </a>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515', marginBottom: 10 }}>Режим работы</p>
                <p style={{ color: '#4a4a4a', fontSize: 14, lineHeight: 1.9 }}>Пн – Сб: 09:00 – 18:00</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Name + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label>Имя *</Label>
                <input type="text" className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }} placeholder="Иван Иванов" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label>Телефон *</Label>
                <input type="tel" className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }} placeholder="+7 (999) 000-00-00" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
            </div>

            {/* Service */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Label>Услуга *</Label>
              <select className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }} value={form.service} onChange={(e) => set('service', e.target.value)}>
                <option value="">Выберите услугу</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Date + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label>Дата *</Label>
                <input type="date" className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e', colorScheme: 'dark' }} min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Label>Время *</Label>
                <select className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }} value={form.time_slot} onChange={(e) => set('time_slot', e.target.value)}>
                  <option value="">Выберите время</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Comment */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Label>Комментарий</Label>
              <textarea className="field" style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e', resize: 'none' }} rows={4} placeholder="Расскажите об автомобиле или пожеланиях..." value={form.comment} onChange={(e) => set('comment', e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="btn-red" style={{ marginTop: 24, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </Container>

      <style>{`
        @media (max-width: 900px) {
          .booking-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </div>
  );
}
