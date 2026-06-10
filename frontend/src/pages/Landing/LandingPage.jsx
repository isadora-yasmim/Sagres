import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar/Navbar'
import Footer from '../../components/layout/Footer/Footer'
import Button from '../../components/common/Button/Button'
import { getRankingSemana } from '../../services/authService'
import { getInitials } from '../../utils/text'
import { StarFilledIcon } from '../../components/common/icons'
import heroImg from '../../assets/hero.png'
import monitorsImg from '../../assets/monitors.png'
import styles from './LandingPage.module.css'

// ─── Ícones inline ─────────────────────────────────────────────────

const AnchorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M5 11H2l2 9h16l2-9h-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 20a4 4 0 008 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const StarOutlineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
)

const GradCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M22 10L12 5 2 10l10 5 10-5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6 12.5v4.5c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// ─── Sub-componentes ───────────────────────────────────────────────

function MonitorAvatar({ nome, avatar }) {
  if (avatar) return <img src={avatar} alt={nome} className={styles.avatarImg} />
  return (
    <div className={styles.avatarFallback} aria-hidden="true">
      {getInitials(nome)}
    </div>
  )
}

function MonitorCardSkeleton() {
  return <div className={styles.monitorCardSkeleton} aria-hidden="true" />
}

const POSITION_LABELS = ['1º', '2º', '3º', '4º', '5º']
const POSITION_STYLE = [
  styles.badgeGold,
  styles.badgeSilver,
  styles.badgeBronze,
  styles.badgeGray,
  styles.badgeGray,
]

// ─── Dados das etapas ──────────────────────────────────────────────

const STEPS = [
  {
    icon: <SearchIcon />,
    number: '01',
    title: 'Busque por matéria',
    description: 'Filtre por disciplina, modalidade e avaliação para achar o monitor ideal.',
  },
  {
    icon: <CalendarIcon />,
    number: '02',
    title: 'Agende com o monitor',
    description: 'Escolha data e horário disponíveis e pague com segurança.',
  },
  {
    icon: <StarOutlineIcon />,
    number: '03',
    title: 'Aprenda e avalie',
    description: 'Tenha sua monitoria e ajude a comunidade com sua avaliação.',
  },
]

// ─── Componente principal ──────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate()

  const [ranking, setRanking] = useState([])
  const [rankingLoading, setRankingLoading] = useState(true)
  const [rankingError, setRankingError] = useState(null)

  useEffect(() => {
    getRankingSemana()
      .then(setRanking)
      .catch(() => setRankingError('Não foi possível carregar o ranking. Tente novamente mais tarde.'))
      .finally(() => setRankingLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <AnchorIcon />
              Plataforma de monitorias acadêmicas
            </span>

            <h1 className={styles.heroTitle}>
              Encontre monitores qualificados na sua faculdade.
            </h1>

            <p className={styles.heroSubtitle}>
              O SAGRES conecta quem precisa de ajuda a quem pode ajudar — com segurança,
              organização e transparência.
            </p>

            <div className={styles.heroCtas}>
              <Button variant="gold" size="lg" pill onClick={() => navigate('/cadastro')}>
                Comece agora →
              </Button>
              <Button variant="outlineLight" size="lg" pill onClick={() => navigate('/login')}>
                Já tenho conta
              </Button>
            </div>
          </div>

          <div className={styles.heroIllustration}>
            <img
              src={heroImg}
              alt="Estudantes conectados através do SAGRES"
              className={styles.heroImg}
            />
          </div>
        </div>
      </section>

      {/* ── Como Funciona ─────────────────────────────────────────── */}
      <section id="como-funciona" className={styles.howItWorks}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>COMO FUNCIONA</span>
            <h2 className={styles.sectionTitle}>Três passos para começar</h2>
          </div>

          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <div className={styles.stepCardTop}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <span className={styles.stepNumber}>{step.number}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para Monitores ────────────────────────────────────────── */}
      <section className={styles.forMonitors}>
        <div className={styles.sectionInner}>
          <div className={styles.forMonitorsCard}>
            <div className={styles.forMonitorsContent}>
              <span className={styles.forMonitorsEyebrow}>PARA MONITORES</span>
              <h2 className={styles.forMonitorsTitle}>
                Compartilhe conhecimento, gere renda.
              </h2>
              <p className={styles.forMonitorsDesc}>
                Comprove sua aprovação na disciplina, defina seus horários e seu valor. A Sagres
                cuida do agendamento, do chat e do pagamento seguro.
              </p>
              <Button variant="primary" pill onClick={() => navigate('/cadastro')}>
                <GradCapIcon /> Quero ser monitor
              </Button>
            </div>

            <div className={styles.forMonitorsIllustration}>
              <img
                src={monitorsImg}
                alt="Duas monitoras acenando"
                className={styles.monitorsImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Monitores ─────────────────────────────────────────── */}
      <section id="ranking" className={styles.ranking}>
        <div className={styles.sectionInner}>
          <div className={styles.rankingHeader}>
            <h2 className={styles.rankingTitle}>Top monitores da semana</h2>
            <button className={styles.rankingMoreLink} type="button" onClick={() => navigate('/ranking')}>
              Ver ranking completo →
            </button>
          </div>

          {rankingLoading && (
            <div className={styles.rankingGrid}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MonitorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {rankingError && (
            <p className={styles.rankingError}>{rankingError}</p>
          )}

          {!rankingLoading && !rankingError && (
            <div className={styles.rankingGrid}>
              {ranking.map((monitor, index) => (
                <div key={monitor.id} className={styles.monitorCard}>
                  <span className={[styles.positionBadge, POSITION_STYLE[index]].join(' ')}>
                    {POSITION_LABELS[index]}
                  </span>
                  <MonitorAvatar nome={monitor.nome} avatar={monitor.avatar} />
                  <p className={styles.monitorName}>{monitor.nome}</p>
                  <p className={styles.monitorMeta}>
                    {monitor.curso} · {monitor.periodo}
                  </p>
                  <div className={styles.monitorRating}>
                    <StarFilledIcon />
                    <span>{monitor.nota.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
