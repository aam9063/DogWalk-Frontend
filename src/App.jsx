import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import ChatTest from './Pages/ChatTest'
import ChatDemo from './Pages/ChatDemo'
import Register from './Pages/Register'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import HowItWorks from './Pages/HowItWorks'
import Services from './Pages/Services'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
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
