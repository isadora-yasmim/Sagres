import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Input from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar/PasswordStrengthBar'
import { cadastrar } from '../../services/authService'
import { PENDING_EMAIL_KEY } from '../../constants/auth'
import heroImg from '../../assets/hero.png'
import styles from './RegisterPage.module.css'

const EMAIL_REGEX = /^[\w.]+@(discente\.)?ufg\.br$/

function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm({ mode: 'onTouched' })

  const senha = watch('senha', '')

  useEffect(() => {
    if (touchedFields.confirmarSenha) trigger('confirmarSenha')
  }, [senha]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data) {
    setServerError(null)
    setLoading(true)
    try {
      await cadastrar({ nome: data.nome, email: data.email, senha: data.senha })
      sessionStorage.setItem(PENDING_EMAIL_KEY, data.email)
      navigate('/confirmar-email')
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      illustration={
        <img src={heroImg} alt="" className={styles.illustration} />
      }
      narrativeTitle="Junte-se à tripulação."
      narrativeText="Crie sua conta com o e-mail institucional da universidade e comece a aprender, ou a ensinar."
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
        <h1 className={styles.title}>CRIE SUA CONTA</h1>

        <div className={styles.fields}>
          <Input
            label="NOME COMPLETO"
            placeholder="Maria da Silva"
            autoComplete="name"
            error={errors.nome?.message}
            {...register('nome', { required: 'Nome é obrigatório' })}
          />

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

          <div className={styles.passwordWrapper}>
            <Input
              label="SENHA"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.senha?.message}
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: { value: 8, message: 'Mínimo de 8 caracteres' },
                validate: {
                  hasUpper: (v) =>
                    /[A-Z]/.test(v) || 'Deve conter ao menos uma letra maiúscula',
                  hasNumber: (v) =>
                    /[0-9]/.test(v) || 'Deve conter ao menos um número',
                  hasSymbol: (v) =>
                    /[^A-Za-z0-9]/.test(v) || 'Deve conter ao menos um símbolo',
                },
              })}
            />
            <PasswordStrengthBar password={senha} />
          </div>

          <Input
            label="CONFIRMAR SENHA"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmarSenha?.message}
            {...register('confirmarSenha', {
              required: 'Confirme sua senha',
              validate: (v) => v === senha || 'As senhas não conferem',
            })}
          />
        </div>

        <div className={styles.terms}>
          <label className={styles.termsLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              {...register('termos', { required: 'Aceite os termos para continuar' })}
            />
            <span className={styles.termsText}>
              Li e aceito os{' '}
              <Link to="/termos" className={styles.termsLink} target="_blank" rel="noreferrer">
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link to="/privacidade" className={styles.termsLink} target="_blank" rel="noreferrer">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {errors.termos && (
            <span className={styles.termsError}>{errors.termos.message}</span>
          )}
        </div>

        {serverError && (
          <p className={styles.serverError} role="alert">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          pill
          disabled={!isValid}
          isLoading={loading}
        >
          Continuar
        </Button>

        <p className={styles.loginLink}>
          Já tem conta?{' '}
          <Link to="/login" className={styles.loginLinkAnchor}>
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
