import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import BookingFlow from './pages/booking/BookingFlow'
import './index.css'

function App() {
  const user = localStorage.getItem('userEmail');
  const isAdmin = user === 'admin@admin.com';
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  const isAuthPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {/* Sidebar - Only show if logged in */}
      {!isAuthPage && user && (
        <aside className="sidebar">
          <div className="sidebar-logo">
            ✈️ JourneyGenie
          </div>
          <nav className="sidebar-nav">
            {isAdmin ? (
              <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>📊 Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>🎫 My Bookings</Link>
            )}
            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>👤 User Profile</Link>
          </nav>
        </aside>
      )}

      <main className="main-content" style={{ padding: isAuthPage ? '0' : '2rem', display: isAuthPage ? 'flex' : 'block', justifyContent: 'center' }}>
        
        {/* Topbar */}
        {!isAuthPage && user && (
          <div className="topbar">
            <button onClick={toggleTheme} className="btn-primary" style={{ marginRight: '1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <span style={{ marginRight: '1rem', fontWeight: '500' }}>Welcome, {user.split('@')[0]}</span>
            <button className="btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book/*" element={user ? <BookingFlow /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : (isAdmin ? <AdminDashboard /> : <Dashboard />)
          } />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
