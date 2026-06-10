import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Button from '../../components/common/Button/Button'
import { EmailSentIcon } from '../../components/common/icons'
import { reenviarConfirmacao } from '../../services/authService'
import { PENDING_EMAIL_KEY } from '../../constants/auth'
import heroImg from '../../assets/hero.png'
import styles from './ConfirmEmailPage.module.css'

const COUNTDOWN = 60

function ConfirmEmailPage() {
  const navigate = useNavigate()
  const email = sessionStorage.getItem(PENDING_EMAIL_KEY) || ''
  const [seconds, setSeconds] = useState(COUNTDOWN)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  async function handleResend() {
    setLoading(true)
    try {
      await reenviarConfirmacao(email)
    } finally {
      setSeconds(COUNTDOWN)
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      illustration={<img src={heroImg} alt="" className={styles.illustration} />}
      narrativeTitle="Falta um clique"
      narrativeText="Confirme seu e-mail e a tripulação está completa."
    >
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
        aria-label="Voltar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12H5M5 12l7 7M5 12l7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.content}>
        <EmailSentIcon />

        <h1 className={styles.title}>CONFIRME SEU E-MAIL</h1>

        <p className={styles.description}>
          Enviamos um link de confirmação para{' '}
          <strong className={styles.emailHighlight}>{email || 'seu e-mail'}</strong>
          . Clique no link para ativar sua conta.
        </p>

        <Button
          type="button"
          variant="primary"
          fullWidth
          pill
          disabled={seconds > 0}
          isLoading={loading}
          onClick={handleResend}
        >
          {seconds > 0 ? `Reenviar e-mail · ${seconds}s` : 'Reenviar e-mail'}
        </Button>

        <p className={styles.hint}>
          Não recebeu? Verifique sua caixa de spam ou{' '}
          <Link to="/cadastro" className={styles.changeEmailLink}>
            altere o e-mail
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ConfirmEmailPage
