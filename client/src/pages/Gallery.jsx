import { useState, useEffect } from 'react';
import api from '../api/client';
import Container from '../components/Container';

const CATEGORIES = ['Все', 'Аэрография', 'Винилирование', 'Детейлинг', 'Другое'];

export default function Gallery() {
  const [works, setWorks] = useState([]);
  const [category, setCategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const params = category !== 'Все' ? { category } : {};
    api.get('/works', { params }).then((r) => setWorks(r.data)).finally(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '56px 0 44px' }}>
        <Container>
          <p className="section-label">Портфолио</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.92, color: '#f0f0f0' }}>
            НАШИ<br />РАБОТЫ
          </h1>
        </Container>
      </div>

      {/* Filter tabs */}
      <div style={{ borderBottom: '1px solid #1a1a1a', overflowX: 'auto' }}>
        <Container style={{ padding: 0 }}>
          <div style={{ display: 'flex', paddingLeft: 'clamp(20px, 4vw, 64px)' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '15px 20px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderBottom: category === c ? '2px solid #c41515' : '2px solid transparent',
                  background: 'transparent',
                  color: category === c ? '#f0f0f0' : '#3a3a3a',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (category !== c) e.target.style.color = '#7a7a7a'; }}
                onMouseLeave={(e) => { if (category !== c) e.target.style.color = '#3a3a3a'; }}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Grid */}
      <Container style={{ padding: 'clamp(32px, 3vw, 56px) clamp(20px, 4vw, 64px) 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '4/3', background: '#111' }} />
            ))}
          </div>
        ) : works.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#2e2e2e', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Работы не найдены
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }} className="gallery-grid">
            {works.map((w, i) => (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                style={{
                  position: 'relative',
                  aspectRatio: i % 7 === 0 ? '16/7' : '4/3',
                  gridColumn: i % 7 === 0 ? '1 / -1' : 'auto',
                  overflow: 'hidden',
                  border: 'none',
                  cursor: 'pointer',
                  background: '#111',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.04)';
                  e.currentTarget.querySelector('.g-overlay').style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                  e.currentTarget.querySelector('.g-overlay').style.opacity = 0;
                }}
              >
                <img
                  src={w.image_url}
                  alt={w.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                />
                <div
                  className="g-overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 50%)',
                    opacity: 0, transition: 'opacity 0.25s',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: 24, textAlign: 'left',
                  }}
                >
                  <p style={{ color: '#c41515', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>{w.category}</p>
                  <p style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600 }}>{w.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* Lightbox */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: '1px solid #2a2a2a', color: '#6a6a6a', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}
          >×</button>
          <div style={{ maxWidth: 1000, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <img src={selected.image_url} alt={selected.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
            <div style={{ marginTop: 20 }}>
              <p style={{ color: '#c41515', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>{selected.category}</p>
              <p style={{ color: '#f0f0f0', fontSize: 17, fontWeight: 600, marginTop: 4 }}>{selected.title}</p>
              {selected.description && <p style={{ color: '#4a4a4a', fontSize: 13, marginTop: 6 }}>{selected.description}</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .gallery-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
