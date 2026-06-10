import styles from './Button.module.css'

function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  isLoading = false,
  fullWidth = false,
  type = 'button',
  disabled,
  onClick,
  ...props
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
    fullWidth ? styles.fullWidth : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button
