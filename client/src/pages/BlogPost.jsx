import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => setPost(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px clamp(20px, 4vw, 64px)' }}>
        <div style={{ height: 12, background: '#111', width: '25%', marginBottom: 40 }} />
        <div style={{ height: 56, background: '#111', width: '70%', marginBottom: 20 }} />
        <div style={{ height: 200, background: '#111' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', color: '#2e2e2e' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Пост не найден</p>
        <Link to="/blog" style={{ color: '#c41515', fontSize: 13, marginTop: 16, display: 'inline-block', textDecoration: 'none' }}>← Вернуться в блог</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back nav */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '14px 0' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 clamp(20px, 4vw, 64px)' }}>
          <Link
            to="/blog"
            style={{ color: '#3a3a3a', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.target.style.color = '#c41515')}
            onMouseLeave={(e) => (e.target.style.color = '#3a3a3a')}
          >
            ← Блог
          </Link>
        </div>
      </div>

      {/* Cover */}
      {post.image_url && (
        <div style={{ width: '100%', height: 440, overflow: 'hidden', borderBottom: '1px solid #1a1a1a' }}>
          <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px clamp(20px, 4vw, 64px) 120px' }}>
        <p style={{ color: '#2e2e2e', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>
          {formatDate(post.created_at)}
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.02, color: '#f0f0f0', marginBottom: 32 }}>
          {post.title.toUpperCase()}
        </h1>
        <div style={{ width: 40, height: 2, background: '#c41515', marginBottom: 40 }} />
        <div
          style={{ color: '#7a7a7a', fontSize: 15, lineHeight: 1.95, whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </div>
  );
}
