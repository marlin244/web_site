import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, X } from 'lucide-react';

const CATEGORIES = ['Аэрография', 'Винилирование', 'Детейлинг', 'Другое'];

function WorkForm({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', image_url: '', category: 'Другое' });
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
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      toast.error('Название и фото обязательны');
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#0d0d0d',
          border: '1px solid #1e1e1e',
          width: '100%',
          maxWidth: 480,
          padding: '40px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#3a3a3a', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
        >
          <X size={18} />
        </button>

        <h2 className="font-display" style={{ fontSize: 28, color: '#f0f0f0', marginBottom: 32 }}>
          ДОБАВИТЬ РАБОТУ
        </h2>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <input
            placeholder="Название"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e', resize: 'none' }}
          />
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="field"
            style={{ background: '#111', border: 'none', borderBottom: '1px solid #1e1e1e' }}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Image upload */}
          <div style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              placeholder="URL фото"
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
              {uploading ? '...' : 'Фото'}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </label>
          </div>

          {form.image_url && (
            <img
              src={form.image_url}
              alt=""
              style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
            />
          )}

          <button type="submit" className="btn-red" style={{ marginTop: 24, justifyContent: 'center' }}>
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get('/works').then((r) => setWorks(r.data)).finally(() => setLoading(false));
  }, []);

  async function create(form) {
    try {
      const { data } = await api.post('/works', form);
      setWorks((w) => [data, ...w]);
      setCreating(false);
      toast.success('Работа добавлена');
    } catch {
      toast.error('Ошибка');
    }
  }

  async function remove(id) {
    if (!confirm('Удалить работу?')) return;
    await api.delete(`/works/${id}`);
    setWorks((w) => w.filter((x) => x.id !== id));
    toast.success('Удалено');
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
        <div>
          <p className="section-label">Контент</p>
          <h1 className="font-display" style={{ fontSize: 48, color: '#f0f0f0', lineHeight: 1 }}>ГАЛЕРЕЯ</h1>
        </div>
        <button onClick={() => setCreating(true)} className="btn-red" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={14} />
          Добавить
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Загрузка...</p>
      ) : works.length === 0 ? (
        <div style={{ border: '1px solid #1a1a1a', padding: '80px 24px', textAlign: 'center', color: '#2e2e2e', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Добавьте первую работу
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
          {works.map((w) => (
            <div
              key={w.id}
              style={{ position: 'relative', aspectRatio: '1', background: '#111', overflow: 'hidden' }}
              onMouseEnter={(e) => { e.currentTarget.querySelector('.del-btn').style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('.del-btn').style.opacity = 0; }}
            >
              <img
                src={w.image_url}
                alt={w.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>{w.title}</p>
                <p style={{ fontSize: 10, color: '#c41515', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                  {w.category}
                </p>
              </div>
              <button
                className="del-btn"
                onClick={() => remove(w.id)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(196,21,21,0.9)',
                  border: 'none',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {creating && <WorkForm onSave={create} onClose={() => setCreating(false)} />}
    </div>
  );
}
