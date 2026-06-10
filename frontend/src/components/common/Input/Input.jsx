import { forwardRef, useState } from 'react'
import styles from './Input.module.css'

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M3 3l14 14M8.46 8.46A2.5 2.5 0 0012.54 12.54M6.11 6.11C4.45 7.27 3 10 3 10s3.5 6 7 6a7 7 0 003.89-1.11M9.88 4.12C9.92 4.08 9.96 4.04 10 4c3.5 0 7 6 7 6a13.16 13.16 0 01-1.67 2.56"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Input = forwardRef(function Input(
  { id, label, type = 'text', placeholder, error, hint, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  const inputClassNames = [
    styles.input,
    error ? styles.inputError : '',
    isPassword ? styles.inputWithToggle : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          placeholder={placeholder}
          className={inputClassNames}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${inputId}-hint`} className={styles.hintText}>
          {hint}
        </span>
      )}
    </div>
  )
})

export default Input
