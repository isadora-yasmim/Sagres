import iconImg from '../../../assets/icon-sagres.png'
import styles from './AuthLayout.module.css'

function AuthLayout({ illustration, narrativeTitle, narrativeText, children }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.panel} aria-hidden="true">
        <a href="/" className={styles.panelLogo} aria-label="SAGRES — página inicial">
          <img src={iconImg} alt="" width={28} height={28} />
          <span className={styles.panelLogoText}>SAGRES</span>
        </a>

        {illustration && (
          <div className={styles.illustration}>{illustration}</div>
        )}

        {(narrativeTitle || narrativeText) && (
          <div className={styles.narrative}>
            {narrativeTitle && (
              <h2 className={styles.narrativeTitle}>{narrativeTitle}</h2>
            )}
            {narrativeText && (
              <p className={styles.narrativeText}>{narrativeText}</p>
            )}
          </div>
        )}
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formContent}>{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
