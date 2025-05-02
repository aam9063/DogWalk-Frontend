import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import ChatTest from './Pages/ChatTest'
import ChatDemo from './Pages/ChatDemo'
import Register from './Pages/Register'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import HowItWorks from './Pages/HowItWorks'
import Services from './Pages/Services'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import { useAuth } from './Context/useAuth'
import './App.css'

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 rounded-full border-t-dog-green border-r-dog-green border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-xl">Verificando credenciales...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar los hijos (la página protegida)
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="/chat-demo" element={<ChatDemo />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/como-funciona" element={<HowItWorks />} />
        <Route path="/servicios" element={<Services />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
