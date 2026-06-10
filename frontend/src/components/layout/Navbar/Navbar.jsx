import { useNavigate } from 'react-router-dom'
import Button from '../../common/Button/Button'
import sagresIcon from '../../../assets/icon-sagres.png'
import styles from './Navbar.module.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className={styles.navbar} aria-label="Navegação principal">
      <div className={styles.inner}>
        <a href="/" className={styles.logo} aria-label="SAGRES — página inicial">
          <img src={sagresIcon} alt="" className={styles.logoIcon} />
          <span className={styles.logoText}>SAGRES</span>
        </a>

        <div className={styles.spacer} />

        <ul className={styles.navLinks}>
          <li>
            <a href="/#como-funciona" className={styles.navLink}>
              Como funciona
            </a>
          </li>
          <li>
            <a href="/#ranking" className={styles.navLink}>
              Ranking
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <Button variant="outlineLight" size="sm" pill onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button variant="white" size="sm" pill onClick={() => navigate('/cadastro')}>
            Cadastre-se
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
