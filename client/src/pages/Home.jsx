import { Link } from 'react-router-dom';
import Container from '../components/Container';

const services = [
  { num: '01', title: 'Аэрография', desc: 'Любые рисунки, портреты, орнаменты. Работаем с кузовом, дисками, деталями салона.' },
  { num: '02', title: 'Винилирование', desc: 'Полная оклейка, частичные акценты, защитная плёнка. Любой цвет и фактура.' },
  { num: '03', title: 'Детейлинг', desc: 'Полировка, нанокерамика, защита стёкол. Восстанавливаем и защищаем покрытие.' },
  { num: '04', title: 'Тюнинг', desc: 'Обвесы, спойлеры, тонировка, подсветка. Комплексная кастомизация под ваш стиль.' },
];

const steps = [
  { n: 1, title: 'Консультация', text: 'Обсуждаем идею, выбираем материалы, оцениваем стоимость' },
  { n: 2, title: 'Эскиз', text: 'Разрабатываем визуализацию будущего результата' },
  { n: 3, title: 'Работа', text: 'Выполняем в срок без лишних согласований' },
  { n: 4, title: 'Приёмка', text: 'Осматриваете готовый автомобиль и забираете' },
];

export default function Home() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 0 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0a0a 0%, #130a0a 50%, #0a0a0a 100%)' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(196,21,21,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 32, height: 1, background: '#c41515' }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c41515' }}>
              Студия кастомизации
            </span>
          </div>

          <h1
            className="font-display"
            style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.92, color: '#f0f0f0', marginBottom: 48 }}
          >
            ТВОЙ{' '}
            <span style={{ color: '#c41515' }}>АВТО</span>
            <br />
            НАША РАБОТА
          </h1>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <p style={{ color: '#5a5a5a', fontSize: 15, maxWidth: 380, lineHeight: 1.8 }}>
              Аэрография, винилирование и детейлинг — превращаем обычные автомобили в уникальные произведения.
            </p>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <Link to="/booking" className="btn-red">Записаться</Link>
              <Link to="/gallery" className="btn-outline">Смотреть работы</Link>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 56,
              marginTop: 80,
              borderTop: '1px solid #1a1a1a',
              paddingTop: 40,
            }}
          >
            {[
              { val: '200+', label: 'Выполненных работ' },
              { val: '5 лет', label: 'На рынке' },
              { val: '100%', label: 'Довольных клиентов' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display" style={{ fontSize: 40, color: '#f0f0f0', lineHeight: 1 }}>{s.val}</p>
                <p style={{ color: '#3a3a3a', fontSize: 11, marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ borderTop: '1px solid #1a1a1a', padding: '96px 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, marginBottom: 64, flexWrap: 'wrap' }}>
            <div>
              <p className="section-label">Услуги</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, color: '#f0f0f0' }}>
                ЧТО МЫ<br />ДЕЛАЕМ
              </h2>
            </div>
            <p style={{ color: '#4a4a4a', fontSize: 14, maxWidth: 300, lineHeight: 1.9, alignSelf: 'flex-end' }}>
              Каждый проект — ручная работа. Никаких шаблонов, только индивидуальный подход.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#1a1a1a' }} className="services-grid">
            {services.map((s) => (
              <div
                key={s.num}
                style={{ background: '#0a0a0a', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 20, transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0f0f0f')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
              >
                <span className="font-display" style={{ fontSize: 13, color: '#c41515', letterSpacing: '0.1em' }}>{s.num}</span>
                <h3 className="font-display" style={{ fontSize: 28, color: '#f0f0f0', lineHeight: 1.1 }}>{s.title.toUpperCase()}</h3>
                <p style={{ color: '#4a4a4a', fontSize: 13, lineHeight: 1.9 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── PROCESS ─── */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '96px 0' }}>
        <Container>
          <p className="section-label">Как мы работаем</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 56px', marginTop: 48 }} className="steps-grid">
            {steps.map((step) => (
              <div key={step.n} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span className="font-display" style={{ fontSize: 64, color: '#181818', lineHeight: 1 }}>0{step.n}</span>
                <div style={{ width: 28, height: 1, background: '#c41515' }} />
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0', letterSpacing: '0.04em' }}>{step.title}</h4>
                <p style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.9 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '96px 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.05, color: '#f0f0f0' }}>
              ГОТОВЫ<br /><span style={{ color: '#c41515' }}>НАЧАТЬ?</span>
            </h2>
            <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ color: '#4a4a4a', fontSize: 14, lineHeight: 1.9 }}>
                Запишитесь на бесплатную консультацию — обсудим идею и дадим точную смету. Свяжемся в течение часа.
              </p>
              <div>
                <Link to="/booking" className="btn-red">Записаться на консультацию</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 48px 40px !important; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
