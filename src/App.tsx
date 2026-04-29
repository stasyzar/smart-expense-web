import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';

// Окрема логіка маршрутів для чистоти коду
const AppRoutes = () => {
  // 1. Дістаємо не тільки статус, а й функцію виходу
  const { isAuthenticated, logout } = useAuth();

  return (
    <Routes>
      {/* Публічні маршрути */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} 
      />

      {/* Приватний маршрут (Dashboard) */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? (
          <div className="dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Вітаю, Анастасіє!</h1>
            <p>Ти успішно пройшла автентифікацію в Smart Expense Tracker.</p>
            
            {/* 2. Реальна кнопка виходу */}
            <button 
              onClick={logout} 
              className="logout-button"
              style={{ 
                marginTop: '1.5rem', 
                padding: '10px 25px', 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer' 
              }}
            >
              Вийти з акаунта
            </button>
          </div>
        ) : (
          <Navigate to="/login" />
        )} 
      />

      {/* Редірект для всіх інших шляхів */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;