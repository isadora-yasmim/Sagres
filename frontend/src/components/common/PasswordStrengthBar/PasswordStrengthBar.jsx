import styles from './PasswordStrengthBar.module.css'

function getStrength(password) {
  if (!password || password.length === 0) return 0
  if (password.length < 8) return 1

  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  if (hasUpper && hasNumber && hasSymbol) return 4
  if (hasUpper && hasNumber) return 3
  return 2
}

const STRENGTH_LABELS = ['', 'Senha fraca', 'Senha regular', 'Senha boa', 'Senha forte']
const STRENGTH_CLASSES = ['', styles.weak, styles.regular, styles.good, styles.strong]

function PasswordStrengthBar({ password = '' }) {
  const strength = getStrength(password)
  const showBar = password.length > 0

  return (
    <div className={styles.wrapper} aria-live="polite" aria-atomic="true">
      {showBar && (
        <>
          <div className={styles.segments}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={[
                  styles.segment,
                  i <= strength ? STRENGTH_CLASSES[strength] : styles.empty,
                ].join(' ')}
              />
            ))}
          </div>
          <span className={[styles.label, STRENGTH_CLASSES[strength]].join(' ')}>
            {STRENGTH_LABELS[strength]}
          </span>
        </>
      )}
    </div>
  )
}

export default PasswordStrengthBar
