import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/Landing/LandingPage'
import RankingPage from '../pages/Ranking/RankingPage'
import TermosPage from '../pages/Legal/TermosPage'
import PrivacidadePage from '../pages/Legal/PrivacidadePage'
import PrivateRoute from './PrivateRoute'

// Placeholders temporários — substituídos conforme as páginas forem implementadas
function Placeholder({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontFamily: 'sans-serif', color: '#6b7e96', fontSize: '1.25rem' }}>{title}</p>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/termos" element={<TermosPage />} />
      <Route path="/privacidade" element={<PrivacidadePage />} />
      <Route path="/cadastro" element={<Placeholder title="Criar Conta" />} />
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/confirmar-email" element={<Placeholder title="Confirmar E-mail" />} />
      <Route path="/esqueci-senha" element={<Placeholder title="Esqueci Minha Senha" />} />
      <Route path="/nova-senha/:token" element={<Placeholder title="Nova Senha" />} />

      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
      </Route>

      {/* Qualquer rota desconhecida volta para a raiz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
