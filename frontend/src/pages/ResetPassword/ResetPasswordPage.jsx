import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Input from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar/PasswordStrengthBar'
import { redefinirSenha } from '../../services/authService'
import heroImg from '../../assets/hero.png'
import styles from './ResetPasswordPage.module.css'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm({ mode: 'onTouched' })

  const novaSenha = watch('novaSenha', '')

  useEffect(() => {
    if (touchedFields.confirmarNovaSenha) trigger('confirmarNovaSenha')
  }, [novaSenha]) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data) {
    setLoading(true)
    try {
      await redefinirSenha(token, data.novaSenha)
      navigate('/login')
    } catch (err) {
      if (err.response?.status === 400) {
        navigate('/link-expirado')
      } else {
        navigate('/link-expirado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      illustration={<img src={heroImg} alt="" className={styles.illustration} />}
      narrativeTitle="Quase pronto."
      narrativeText="Escolha uma senha forte e guarde-a com carinho."
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
          <h1 className={styles.title}>CRIE UMA NOVA SENHA</h1>
          <p className={styles.description}>
            Sua nova senha deve ter pelo menos 8 caracteres, com letra maiúscula, número e símbolo.
          </p>
        </div>

        <div className={styles.fields}>
          <div className={styles.passwordWrapper}>
            <Input
              label="NOVA SENHA"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.novaSenha?.message}
              {...register('novaSenha', {
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
            <PasswordStrengthBar password={novaSenha} />
          </div>

          <Input
            label="CONFIRMAR SENHA"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmarNovaSenha?.message}
            {...register('confirmarNovaSenha', {
              required: 'Confirme sua senha',
              validate: (v) => v === novaSenha || 'As senhas não conferem',
            })}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          pill
          disabled={!isValid}
          isLoading={loading}
        >
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
