import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `${window.location.origin}/api/webhook/vk`;

  function copyUrl() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('URL скопирован');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <p className="section-label">Интеграции</p>
        <h1 className="font-display" style={{ fontSize: 48, color: '#f0f0f0', lineHeight: 1 }}>НАСТРОЙКИ</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 680 }}>
        {/* Webhook block */}
        <div style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 1, background: '#c41515' }} />
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515' }}>
                VK Bot Webhook
              </p>
            </div>
          </div>
          <div style={{ padding: '28px' }}>
            <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.9, marginBottom: 24 }}>
              Укажите этот URL в настройках VK-бота. Бот отправляет POST-запрос с{' '}
              <code style={{ background: '#1a1a1a', padding: '1px 6px', color: '#c41515', fontSize: 12 }}>
                {'{"type":"get_pending"}'}
              </code>{' '}
              и получает список новых записей.
            </p>
            <div style={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
              <code
                style={{
                  flex: 1,
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  padding: '14px 18px',
                  fontSize: 12,
                  color: '#8a8a8a',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-all',
                  display: 'block',
                }}
              >
                {webhookUrl}
              </code>
              <button
                onClick={copyUrl}
                style={{
                  flexShrink: 0,
                  background: copied ? 'rgba(34,197,94,0.1)' : '#1a1a1a',
                  border: '1px solid #1e1e1e',
                  borderLeft: 'none',
                  color: copied ? '#22c55e' : '#5a5a5a',
                  padding: '0 20px',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 1, background: '#c41515' }} />
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515' }}>
                Инструкция
              </p>
            </div>
          </div>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              'Скопируйте webhook URL выше и добавьте в настройки бота.',
              'Бот периодически (раз в ~минуту) делает POST-запрос с телом: {"type":"get_pending","secret":"ВАШ_СЕКРЕТ"}',
              'Сервер возвращает массив непрочитанных заявок и помечает их как отправленные.',
              'Секрет задаётся переменной VK_WEBHOOK_SECRET в .env на сервере.',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <span
                  className="font-display"
                  style={{ fontSize: 28, color: '#1e1e1e', lineHeight: 1, flexShrink: 0, minWidth: 24 }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: 13, color: '#5a5a5a', lineHeight: 1.8, paddingTop: 4 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Response example */}
        <div style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 1, background: '#c41515' }} />
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c41515' }}>
                Пример ответа
              </p>
            </div>
          </div>
          <pre
            style={{
              padding: '24px 28px',
              fontSize: 12,
              color: '#4a4a4a',
              overflowX: 'auto',
              lineHeight: 1.8,
              background: '#080808',
              margin: 0,
            }}
          >
{`{
  "bookings": [
    {
      "id": "uuid",
      "name": "Иван Иванов",
      "phone": "+7 999 000-00-00",
      "service": "Аэрография",
      "date": "2026-06-15",
      "time_slot": "14:00",
      "comment": "Граффити на капот",
      "created_at": 1749200000000
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
