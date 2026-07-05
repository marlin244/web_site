import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';

function PostForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { title: '', body: '', preview: '', image_url: '', published: false }
  );
  const [uploading, setUploading] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/upload', fd);
      set('image_url', data.url);
    } catch {
      toast.error('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.body) {
      toast.error('Заголовок и текст обязательны');
      return;
    }
    await onSave(form);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 24px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: '1px solid #1e1e1e',
          width: '100%',
          maxWidth: 680,
          padding: '40px',
          position: 'relative',
          marginBottom: 32,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#3a3a3a',
            cursor: 'pointer',
            padding: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
        >
          <X size={18} />
        </button>

        <h2
          className="font-display"
          style={{ fontSize: 32, color: '#f0f0f0', marginBottom: 32 }}
        >
          {initial ? 'РЕДАКТИРОВАТЬ' : 'НОВЫЙ ПОСТ'}
        </h2>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <input
            placeholder="Заголовок"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          />
          <input
            placeholder="Краткое описание (превью)"
            value={form.preview}
            onChange={(e) => set('preview', e.target.value)}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          />

          {/* Image */}
          <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              placeholder="URL обложки"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', color: '#f0f0f0', fontSize: 14, outline: 'none' }}
            />
            <label
              style={{
                flexShrink: 0,
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#6a6a6a',
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Upload size={12} />
              {uploading ? '...' : 'Загрузить'}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </label>
          </div>

          {form.image_url && (
            <img
              src={form.image_url}
              alt=""
              style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
            />
          )}

          <textarea
            placeholder="Текст поста (поддерживается HTML)"
            value={form.body}
            onChange={(e) => set('body', e.target.value)}
            rows={14}
            className="field"
            style={{
              background: '#111',
              border: 'none',
              borderBottom: '1px solid #1e1e1e',
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
          />

          <div
            style={{
              background: '#111',
              borderBottom: '1px solid #1e1e1e',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              style={{ accentColor: '#c41515', width: 14, height: 14, cursor: 'pointer' }}
            />
            <label
              htmlFor="published"
              style={{ fontSize: 12, color: '#6a6a6a', cursor: 'pointer', letterSpacing: '0.08em' }}
            >
              Опубликовать сразу
            </label>
          </div>

          <button
            type="submit"
            className="btn-red"
            style={{ marginTop: 24, justifyContent: 'center' }}
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get('/posts?published=false').then((r) => setPosts(r.data)).finally(() => setLoading(false));
  }, []);

  async function create(form) {
    try {
      const { data } = await api.post('/posts', form);
      setPosts((p) => [data, ...p]);
      setCreating(false);
      toast.success('Пост создан');
    } catch {
      toast.error('Ошибка');
    }
  }

  async function save(form) {
    try {
      await api.put(`/posts/${editing.id}`, form);
      setPosts((p) => p.map((post) => (post.id === editing.id ? { ...post, ...form } : post)));
      setEditing(null);
      toast.success('Сохранено');
    } catch {
      toast.error('Ошибка');
    }
  }

  async function remove(id) {
    if (!confirm('Удалить пост?')) return;
    await api.delete(`/posts/${id}`);
    setPosts((p) => p.filter((post) => post.id !== id));
    toast.success('Удалено');
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
        <div>
          <p className="section-label">Контент</p>
          <h1 className="font-display" style={{ fontSize: 48, color: '#f0f0f0', lineHeight: 1 }}>ПОСТЫ</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-red"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={14} />
          Новый пост
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Загрузка...</p>
      ) : posts.length === 0 ? (
        <div style={{ border: '1px solid #1a1a1a', padding: '80px 24px', textAlign: 'center', color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Постов нет
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                border: '1px solid #1a1a1a',
                background: '#0d0d0d',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#111')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0d0d0d')}
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0, display: 'block' }}
                />
              )}
              <div style={{ flex: 1, padding: '20px 24px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </p>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      color: post.published ? '#22c55e' : '#3a3a3a',
                      background: post.published ? 'rgba(34,197,94,0.08)' : 'rgba(40,40,40,0.5)',
                    }}
                  >
                    {post.published ? 'Опубликован' : 'Черновик'}
                  </span>
                </div>
                {post.preview && (
                  <p style={{ fontSize: 12, color: '#3a3a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.preview}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 0, flexShrink: 0 }}>
                <button
                  onClick={() => setEditing(post)}
                  style={{
                    padding: '20px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#3a3a3a',
                    cursor: 'pointer',
                    borderLeft: '1px solid #1a1a1a',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(post.id)}
                  style={{
                    padding: '20px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#3a3a3a',
                    cursor: 'pointer',
                    borderLeft: '1px solid #1a1a1a',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c41515')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && <PostForm onSave={create} onClose={() => setCreating(false)} />}
      {editing && <PostForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
