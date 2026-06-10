import styles from './SummaryCard.module.css'

function SummaryCard({ icon, color = 'blue', value, label, sublabel }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[color]}`}>
        {icon}
      </div>
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      </div>
    </div>
  )
}

export default SummaryCard
