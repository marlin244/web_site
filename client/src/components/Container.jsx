export default function Container({ children, style }) {
  return (
    <div
      style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '0 clamp(20px, 4vw, 64px)',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
