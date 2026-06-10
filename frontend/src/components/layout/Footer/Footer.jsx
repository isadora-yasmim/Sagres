import { Link } from 'react-router-dom'
import sagresIcon from '../../../assets/icon-sagres.png'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src={sagresIcon} alt="" className={styles.logoIcon} />
              <span className={styles.logoText}>SAGRES</span>
            </div>
            <p className={styles.slogan}>
              A plataforma de monitoria acadêmica feita por estudantes para estudantes.
            </p>
          </div>

          <nav className={styles.links} aria-label="Links do rodapé">
            <div className={styles.linkCol}>
              <span className={styles.colTitle}>PRODUTO</span>
              <ul>
                <li>
                  <a href="/#como-funciona" className={styles.link}>Como funciona</a>
                </li>
                <li>
                  <Link to="/ranking" className={styles.link}>Ranking</Link>
                </li>
                <li>
                  <Link to="/cadastro" className={styles.link}>Cadastre-se</Link>
                </li>
              </ul>
            </div>
            <div className={styles.linkCol}>
              <span className={styles.colTitle}>LEGAL</span>
              <ul>
                <li>
                  <Link to="/termos" className={styles.link}>Termos de Uso</Link>
                </li>
                <li>
                  <Link to="/privacidade" className={styles.link}>Política de Privacidade</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.divider} />
        <p className={styles.copyright}>© 2026 SAGRES — Plataforma de Monitoria Acadêmica</p>
      </div>
    </footer>
  )
}

export default Footer
