import styles from './AuthLayout.module.css'

function AuthLayout({ illustration, narrativeTitle, narrativeText, children }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.panel} aria-hidden="true">
        <div className={styles.panelContent}>
          {illustration && (
            <div className={styles.illustration}>{illustration}</div>
          )}
          {narrativeTitle && (
            <h2 className={styles.narrativeTitle}>{narrativeTitle}</h2>
          )}
          {narrativeText && (
            <p className={styles.narrativeText}>{narrativeText}</p>
          )}
        </div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formContent}>{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
