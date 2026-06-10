import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Button from '../../components/common/Button/Button'
import heroImg from '../../assets/hero.png'
import styles from './LinkExpiredPage.module.css'

function LinkExpiredPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      illustration={<img src={heroImg} alt="" className={styles.illustration} />}
      narrativeTitle="Não foi dessa vez."
      narrativeText="Links de redefinição expiram para manter sua conta segura. Mas é só pedir um novo."
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={styles.icon}
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 7v5.5M12 16.5v.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className={styles.title}>LINK EXPIRADO</h1>

          <p className={styles.description}>
            Este link de redefinição de senha não é mais válido. Links expiram após 1 hora por
            segurança. Solicite um novo para continuar.
          </p>

          <Button
            type="button"
            variant="primary"
            fullWidth
            pill
            onClick={() => navigate('/esqueci-senha')}
          >
            Solicitar novo link
          </Button>

          <button
            type="button"
            className={styles.loginLink}
            onClick={() => navigate('/login')}
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}

export default LinkExpiredPage
