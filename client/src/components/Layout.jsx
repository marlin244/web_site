import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161616',
            color: '#f0f0f0',
            border: '1px solid #282828',
            borderRadius: 0,
            fontSize: 13,
          },
        }}
      />
      <Navbar />
      <main style={{ flex: 1, paddingTop: 60 }}>{children}</main>
      <Footer />
    </div>
  );
}
