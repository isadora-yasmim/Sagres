import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Button from '../../components/common/Button/Button'
import { EmailSentIcon } from '../../components/common/icons'
import heroImg from '../../assets/hero.png'
import styles from './LinkSentPage.module.css'

function LinkSentPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      illustration={<img src={heroImg} alt="" className={styles.illustration} />}
      narrativeTitle="Acontece com todo mundo"
      narrativeText="A gente te ajuda a voltar pra sua conta num instante."
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

        <h1 className={styles.title}>LINK ENVIADO</h1>

        <p className={styles.description}>
          Se este e-mail estiver cadastrado em nossa base de dados, enviamos um link de
          recuperação. Verifique sua caixa de entrada e spam.
        </p>

        <Button
          type="button"
          variant="primary"
          fullWidth
          pill
          onClick={() => navigate('/login')}
        >
          Voltar para o login
        </Button>

        <button
          type="button"
          className={styles.simulateLink}
          onClick={() => navigate('/nova-senha/token-demo')}
        >
          Simular abertura do link de redefinição
        </button>
      </div>
    </AuthLayout>
  )
}

export default LinkSentPage
