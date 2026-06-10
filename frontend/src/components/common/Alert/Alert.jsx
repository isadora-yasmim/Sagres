import styles from './Alert.module.css'

const icons = {
  danger: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6v5M10 14.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8.68 3.37a1.5 1.5 0 012.64 0l6.18 11.26A1.5 1.5 0 0116.18 17H3.82a1.5 1.5 0 01-1.32-2.37L8.68 3.37z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 8v4M10 14.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v5M10 6.5h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
}

function Alert({ variant = 'info', children }) {
  return (
    <div className={[styles.alert, styles[variant]].join(' ')} role="alert">
      <span className={styles.icon}>{icons[variant]}</span>
      <span className={styles.content}>{children}</span>
    </div>
  )
}

export default Alert
