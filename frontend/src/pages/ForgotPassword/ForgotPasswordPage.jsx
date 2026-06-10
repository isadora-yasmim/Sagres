import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Input from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import { esqueciSenha } from '../../services/authService'
import heroImg from '../../assets/hero.png'
import styles from './ForgotPasswordPage.module.css'

const EMAIL_REGEX = /^[\w.]+@(discente\.)?ufg\.br$/

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  async function onSubmit(data) {
    setLoading(true)
    try {
      await esqueciSenha(data.email)
    } finally {
      setLoading(false)
      navigate('/link-enviado')
    }
  }

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

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.header}>
          <h1 className={styles.title}>ESQUECEU A SENHA?</h1>
          <p className={styles.description}>
            Informe seu e-mail institucional e enviaremos um link para criar uma nova senha.
          </p>
        </div>

        <Input
          label="E-MAIL INSTITUCIONAL"
          type="email"
          placeholder="mariadasilva@discente.ufg.br"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'E-mail é obrigatório',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Use um e-mail @ufg.br ou @discente.ufg.br',
            },
          })}
        />

        <Button type="submit" variant="primary" fullWidth pill isLoading={loading}>
          Enviar link
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
