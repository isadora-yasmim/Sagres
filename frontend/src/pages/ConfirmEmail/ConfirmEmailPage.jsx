import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Button from '../../components/common/Button/Button'
import { reenviarConfirmacao } from '../../services/authService'
import { PENDING_EMAIL_KEY } from '../../constants/auth'
import heroImg from '../../assets/hero.png'
import styles from './ConfirmEmailPage.module.css'

const COUNTDOWN = 60

function EmailIcon() {
  return (
    <div className={styles.iconWrapper}>
      <div className={styles.iconCircle}>
        <svg
          className={styles.envelopeIcon}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2" y="4" width="20" height="16" rx="2"
            stroke="currentColor" strokeWidth="1.5"
          />
          <path
            d="M2 7l10 7 10-7"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className={styles.checkBadge} aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" className={styles.checkIcon}>
          <circle cx="10" cy="10" r="10" fill="#22c55e" />
          <path
            d="M5.5 10.5l3 3 6-6"
            stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}

function ConfirmEmailPage() {
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
      illustration={
        <img src={heroImg} alt="" className={styles.illustration} />
      }
      narrativeTitle="Falta um clique"
      narrativeText="Confirme seu e-mail e a tripulação está completa."
    >
      <div className={styles.content}>
        <EmailIcon />

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
