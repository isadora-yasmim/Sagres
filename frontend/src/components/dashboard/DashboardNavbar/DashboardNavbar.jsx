import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getDisplayName } from '../../../utils/text'
import sagresIcon from '../../../assets/icon-sagres.png'
import styles from './DashboardNavbar.module.css'

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v5a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 7H3a2 2 0 002 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 7h3a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15v4M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardNavbar({ messageBadge, notifBadge }) {
  const { user } = useAuth()
  const initial = getDisplayName(user?.email).charAt(0).toUpperCase()

  function navClass({ isActive }) {
    return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
  }

  return (
    <nav className={styles.navbar} aria-label="Navegação principal">
      <div className={styles.inner}>
        <a href="/" className={styles.logo} aria-label="SAGRES — página inicial">
          <img src={sagresIcon} alt="" className={styles.logoIcon} />
          <span className={styles.logoText}>SAGRES</span>
        </a>

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/dashboard" end className={navClass}>
              <HomeIcon />
              Início
            </NavLink>
          </li>
          <li>
            <span className={styles.navLinkDisabled}>
              <SearchIcon />
              Buscar
            </span>
          </li>
          <li>
            <NavLink to="/ranking" className={navClass}>
              <TrophyIcon />
              Ranking
            </NavLink>
          </li>
          <li>
            <span className={styles.navLinkDisabled}>
              <CalendarIcon />
              Minhas Monitorias
            </span>
          </li>
        </ul>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Mensagens">
            <MessageIcon />
            {messageBadge > 0 && <span className={styles.badge}>{messageBadge}</span>}
          </button>
          <button className={styles.iconBtn} aria-label="Notificações">
            <BellIcon />
            {notifBadge > 0 && <span className={styles.badge}>{notifBadge}</span>}
          </button>
          <button className={styles.avatarBtn} aria-label="Perfil do usuário">
            <div className={styles.avatar}>{initial}</div>
            <ChevronIcon />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
