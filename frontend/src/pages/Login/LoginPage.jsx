import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout'
import Input from '../../components/common/Input/Input'
import Button from '../../components/common/Button/Button'
import Alert from '../../components/common/Alert/Alert'
import { login as loginService, reenviarConfirmacao } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import heroImg from '../../assets/hero.png'
import styles from './LoginPage.module.css'

const EMAIL_REGEX = /^[\w.]+@(discente\.)?ufg\.br$/

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [emailInvalid, setEmailInvalid] = useState(false)
  const [senhaInvalid, setSenhaInvalid] = useState(false)
  const [dangerAlert, setDangerAlert] = useState(false)
  const [warningAlert, setWarningAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const { register, handleSubmit, getValues } = useForm()

  const emailReg = register('email')
  const senhaReg = register('senha')

  function clearErrors() {
    setEmailInvalid(false)
    setSenhaInvalid(false)
    setDangerAlert(false)
    setWarningAlert(null)
  }

  async function onSubmit(data) {
    const emailOk = EMAIL_REGEX.test(data.email)
    const passwordOk = isStrongPassword(data.senha)

    if (!emailOk || !passwordOk) {
      setEmailInvalid(!emailOk)
      setSenhaInvalid(!passwordOk)
      setDangerAlert(true)
      return
    }

    setEmailInvalid(false)
    setSenhaInvalid(false)
    setDangerAlert(false)
    setWarningAlert(null)
    setLoading(true)

    try {
      const result = await loginService({ email: data.email, senha: data.senha })
      login(result.token)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (status === 403) {
        setWarningAlert({ email: data.email })
      } else {
        setEmailInvalid(true)
        setSenhaInvalid(true)
        setDangerAlert(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    const email = warningAlert?.email || getValues('email')
    setResending(true)
    try {
      await reenviarConfirmacao(email)
    } finally {
      setResending(false)
      navigate('/link-enviado')
    }
  }

  return (
    <AuthLayout
      illustration={<img src={heroImg} alt="" className={styles.illustration} />}
      narrativeTitle="Que bom te ver de novo"
      narrativeText="Sua tripulação de monitores da UFG está a postos. Bora estudar?"
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className={styles.title}>BEM-VINDO(A) DE VOLTA</h1>

        {dangerAlert && (
          <Alert variant="danger">E-mail ou senha incorretos.</Alert>
        )}

        {warningAlert && (
          <Alert variant="warning">
            Sua conta ainda não foi validada.{' '}
            <button
              type="button"
              className={styles.alertAction}
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Enviando...' : 'Reenviar e-mail'}
            </button>
          </Alert>
        )}

        <div className={styles.fields}>
          <Input
            label="E-MAIL INSTITUCIONAL"
            type="email"
            placeholder="mariadasilva@discente.ufg.br"
            autoComplete="email"
            invalid={emailInvalid}
            {...emailReg}
            onChange={(e) => {
              emailReg.onChange(e)
              clearErrors()
            }}
          />

          <div className={styles.passwordField}>
            <Input
              label="SENHA"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              invalid={senhaInvalid}
              {...senhaReg}
              onChange={(e) => {
                senhaReg.onChange(e)
                clearErrors()
              }}
            />
            <div className={styles.forgotRow}>
              <Link to="/esqueci-senha" className={styles.forgotLink}>
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth pill isLoading={loading}>
          Entrar
        </Button>

        <div className={styles.divider}>
          <span className={styles.dividerText}>ou</span>
        </div>

        <p className={styles.registerLink}>
          Não tem conta?{' '}
          <Link to="/cadastro" className={styles.registerLinkAnchor}>
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
