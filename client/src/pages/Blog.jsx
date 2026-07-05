import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Container from '../components/Container';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts').then((r) => setPosts(r.data)).finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '56px 0 44px' }}>
        <Container>
          <p className="section-label">Блог</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.92, color: '#f0f0f0' }}>
            НОВОСТИ<br />И ПРОЕКТЫ
          </h1>
        </Container>
      </div>

      <Container style={{ padding: 'clamp(32px, 3vw, 56px) 0 96px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 120, background: '#111' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p style={{ color: '#2e2e2e', textAlign: 'center', padding: '80px 0', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Постов пока нет
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Featured */}
            {featured && (
              <Link
                to={`/blog/${featured.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: featured.image_url ? '1fr 1fr' : '1fr',
                  border: '1px solid #1a1a1a',
                  textDecoration: 'none',
                  marginBottom: 2,
                  transition: 'border-color 0.15s',
                }}
                className="featured-post"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}
              >
                {featured.image_url && (
                  <div style={{ overflow: 'hidden' }}>
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                  </div>
                )}
                <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0d0d0d', minHeight: 340 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                      <div style={{ width: 20, height: 1, background: '#c41515' }} />
                      <span style={{ fontSize: 10, color: '#c41515', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Главная статья</span>
                    </div>
                    <h2 className="font-display" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)', lineHeight: 1.05, color: '#f0f0f0', marginBottom: 16 }}>
                      {featured.title.toUpperCase()}
                    </h2>
                    {featured.preview && <p style={{ color: '#4a4a4a', fontSize: 14, lineHeight: 1.9 }}>{featured.preview}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
                    <span style={{ color: '#2a2a2a', fontSize: 12 }}>{formatDate(featured.created_at)}</span>
                    <span style={{ color: '#c41515', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Читать →</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest */}
            {rest.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                style={{ display: 'flex', border: '1px solid #1a1a1a', borderTop: 'none', textDecoration: 'none', background: '#0a0a0a', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0d0d0d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
              >
                {post.image_url && (
                  <div style={{ width: 180, flexShrink: 0, overflow: 'hidden' }}>
                    <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f0f0f0', marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
                    {post.preview && <p style={{ color: '#3a3a3a', fontSize: 13, lineHeight: 1.9 }}>{post.preview}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                    <span style={{ color: '#2a2a2a', fontSize: 12 }}>{formatDate(post.created_at)}</span>
                    <span style={{ color: '#c41515', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Читать →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>

      <style>{`
        @media (max-width: 768px) { .featured-post { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
