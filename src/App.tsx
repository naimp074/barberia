import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ClientView from './components/ClientView';
import { storage } from './utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(storage.getAuth());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    storage.saveAuth(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    storage.clearAuth();
  };

  return (
    <Router>
      <div className="App">
        {/* Navegación principal - solo se muestra en rutas públicas */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<MainNav />} />
        </Routes>

        <Routes>
          {/* Ruta principal - Vista del cliente */}
          <Route path="/" element={<ClientView />} />
          
          {/* Rutas de admin */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminPanel onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Redirect para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

const MainNav: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link
        to="/admin"
        className="bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 shadow-lg border border-gray-700"
      >
        <Shield size={16} />
        <span className="text-sm font-medium">Admin</span>
      </Link>
    </div>
  );
};

export default App;