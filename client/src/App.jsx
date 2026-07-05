import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import RequireAuth from './components/RequireAuth';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Booking from './pages/Booking';

import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminWorks from './pages/admin/Works';
import AdminSettings from './pages/admin/Settings';

function AdminApp({ children }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
        <Route path="/booking" element={<Layout><Booking /></Layout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminApp><Dashboard /></AdminApp>} />
        <Route path="/admin/bookings" element={<AdminApp><Dashboard /></AdminApp>} />
        <Route path="/admin/posts" element={<AdminApp><AdminPosts /></AdminApp>} />
        <Route path="/admin/works" element={<AdminApp><AdminWorks /></AdminApp>} />
        <Route path="/admin/settings" element={<AdminApp><AdminSettings /></AdminApp>} />
      </Routes>
    </BrowserRouter>
  );
}
