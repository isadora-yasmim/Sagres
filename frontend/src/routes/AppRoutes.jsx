import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import LandingPage from '../pages/Landing/LandingPage'
import RankingPage from '../pages/Ranking/RankingPage'
import TermosPage from '../pages/Legal/TermosPage'
import PrivacidadePage from '../pages/Legal/PrivacidadePage'
import RegisterPage from '../pages/Register/RegisterPage'
import ConfirmEmailPage from '../pages/ConfirmEmail/ConfirmEmailPage'
import LoginPage from '../pages/Login/LoginPage'
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage'
import LinkSentPage from '../pages/LinkSent/LinkSentPage'
import ResetPasswordPage from '../pages/ResetPassword/ResetPasswordPage'
import LinkExpiredPage from '../pages/LinkExpired/LinkExpiredPage'
import PrivateRoute from './PrivateRoute'
import DashboardPage from '../pages/Dashboard/DashboardPage'

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/termos" element={<TermosPage />} />
      <Route path="/privacidade" element={<PrivacidadePage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/confirmar-email" element={<ConfirmEmailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
      <Route path="/link-enviado" element={<LinkSentPage />} />
      <Route path="/nova-senha/:token" element={<ResetPasswordPage />} />
      <Route path="/link-expirado" element={<LinkExpiredPage />} />

      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Qualquer rota desconhecida volta para a raiz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default AppRoutes
