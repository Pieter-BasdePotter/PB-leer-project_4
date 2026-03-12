import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function NavBar() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  const initial = username ? username[0].toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fbNav">
      <Link to="/" className="fbNavLogo">GreenBook</Link>
      <div className="fbNavCenter">
        <Link to="/" className="fbNavLink">Home</Link>
        <Link to="/createpost" className="fbNavLink">New Post</Link>
      </div>
      <div className="fbNavRight">
        <div className="fbNavAvatar">{initial}</div>
        <span className="fbNavUsername">{username}</span>
        <button className="fbNavLogout" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
