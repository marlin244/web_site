import { useState, useEffect } from 'react';
import api from '../../api/client';

const STATUS = {
  new: { label: 'Новая', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  confirmed: { label: 'Подтверждена', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { label: 'Отменена', color: '#c41515', bg: 'rgba(196,21,21,0.08)' },
  done: { label: 'Выполнена', color: '#4a4a4a', bg: 'rgba(74,74,74,0.08)' },
};

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then((r) => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  async function changeStatus(id, status) {
    await api.patch(`/bookings/${id}/status`, { status });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  const stats = [
    { label: 'Всего', value: bookings.length },
    { label: 'Новых', value: bookings.filter((b) => b.status === 'new').length, accent: true },
    { label: 'Подтверждено', value: bookings.filter((b) => b.status === 'confirmed').length },
    { label: 'Выполнено', value: bookings.filter((b) => b.status === 'done').length },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 48, maxWidth: 1100 }}>
        <p className="section-label">Панель управления</p>
        <h1
          className="font-display"
          style={{ fontSize: 48, color: '#f0f0f0', lineHeight: 1 }}
        >
          ЗАПИСИ
        </h1>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: '#1a1a1a',
          marginBottom: 48,
          border: '1px solid #1a1a1a',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#0d0d0d',
              padding: '28px 24px',
              borderLeft: s.accent ? '2px solid #c41515' : 'none',
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 48, lineHeight: 1, color: s.accent ? '#c41515' : '#f0f0f0' }}
            >
              {loading ? '—' : s.value}
            </p>
            <p style={{ fontSize: 10, color: '#3a3a3a', marginTop: 8, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #1a1a1a' }}>
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3a3a3a' }}>
            Все записи
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Загрузка...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Записей нет
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Клиент', 'Телефон', 'Услуга', 'Дата / Время', 'Статус', 'Изменить'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#3a3a3a',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const s = STATUS[b.status] || STATUS.new;
                  return (
                    <tr
                      key={b.id}
                      style={{
                        borderBottom: i < bookings.length - 1 ? '1px solid #141414' : 'none',
                        background: b.status === 'new' ? 'rgba(196,21,21,0.02)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontSize: 14, color: '#f0f0f0', fontWeight: 500 }}>{b.name}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#5a5a5a' }}>{b.phone}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#5a5a5a' }}>{b.service}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: '#5a5a5a', whiteSpace: 'nowrap' }}>
                        {b.date} · {b.time_slot}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: s.color,
                            background: s.bg,
                          }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={b.status}
                          onChange={(e) => changeStatus(b.id, e.target.value)}
                          style={{
                            background: '#161616',
                            border: '1px solid #252525',
                            color: '#8a8a8a',
                            padding: '6px 10px',
                            fontSize: 11,
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="new">Новая</option>
                          <option value="confirmed">Подтверждена</option>
                          <option value="cancelled">Отменена</option>
                          <option value="done">Выполнена</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
