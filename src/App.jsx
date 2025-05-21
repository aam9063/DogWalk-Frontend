import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import ChatTest from './Pages/ChatTest'
import ChatDemo from './Pages/ChatDemo'
import Register from './Pages/Register'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import HowItWorks from './Pages/HowItWorks'
import Services from './Pages/Services'
import Contact from './Pages/Contact'
import DSADisclosure from './Pages/DSADisclosure'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import PaseadorDashboard from './Pages/PaseadorDashboard'
import SearchCaregivers from './Pages/SearchCaregivers'
import Shop from './Pages/Shop'
import ProductDetail from './Pages/ProductDetail'
import ScrollToTopButton from './Components/ScrollToTopButton'
import ChatAssistant from './Components/ChatAssistant'
import ScrollProgress from './Components/ScrollProgress'
import useAuthStore from './store/authStore'
import useInitAuth from './hooks/useInitAuth'
import CheckoutSuccess from './Pages/CheckoutSuccess'
import PaseadorProfile from './Pages/PaseadorProfile'
import { startAutoRefresh, stopAutoRefresh } from './Services/autoRefreshService'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import './App.css'

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const user = useAuthStore(state => state.user);
  
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

  // Si hay roles permitidos especificados y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    // Redirigir al dashboard correspondiente según el rol
    if (user?.rol === 'Paseador') {
      return <Navigate to="/paseador/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si está autenticado y tiene el rol adecuado, mostrar los hijos (la página protegida)
  return children;
}

function App() {
  // Inicializar autenticación al cargar la app
  useInitAuth();
  
  // Estado de autenticación para controlar el auto-refresh
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Iniciar/detener la renovación automática según el estado de autenticación
  useEffect(() => {
    if (isAuthenticated) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
    
    // Limpiar al desmontar
    return () => stopAutoRefresh();
  }, [isAuthenticated]);

  return (
    <>
      <BrowserRouter>
        {/* Barra de progreso de scroll */}
        <ScrollProgress />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Usuario']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/paseador/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Paseador']}>
                <PaseadorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/chat-test" element={<ChatTest />} />
          <Route path="/chat-demo" element={<ChatDemo />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/como-funciona" element={<HowItWorks />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/dsadisclosure" element={<DSADisclosure />} />
          <Route path="/ley-de-servicios-digitales" element={<DSADisclosure />} />
          <Route path="/buscar-cuidadores" element={<SearchCaregivers />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/tienda/producto/:productId" element={<ProductDetail />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/paseador/:paseadorId" element={<PaseadorProfile />} />
        </Routes>
        
        {/* Botón para volver arriba */}
        <ScrollToTopButton />
        
        {/* Asistente virtual */}
        <ChatAssistant />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
