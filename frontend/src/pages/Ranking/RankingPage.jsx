import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar/Navbar'
import Footer from '../../components/layout/Footer/Footer'
import Button from '../../components/common/Button/Button'
import { getRankingCompleto } from '../../services/authService'
import { getInitials } from '../../utils/text'
import { StarFilledIcon } from '../../components/common/icons'
import styles from './RankingPage.module.css'

// ─── Ícones inline ─────────────────────────────────────────────────

const InfoIcon = () => (
  <svg className={styles.infoBannerIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ─── Sub-componentes ───────────────────────────────────────────────

function PodiumAvatar({ nome, avatar, ringClass }) {
  return (
    <div className={[styles.podiumAvatar, ringClass].join(' ')}>
      {avatar ? <img src={avatar} alt={nome} /> : getInitials(nome)}
    </div>
  )
}

function ListAvatar({ nome, avatar }) {
  if (avatar) return <img src={avatar} alt={nome} className={styles.listAvatar} />
  return <div className={styles.listAvatarFallback} aria-hidden="true">{getInitials(nome)}</div>
}

// ─── Componente principal ──────────────────────────────────────────

function RankingPage() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getRankingCompleto()
      .then(setRanking)
      .catch(() => setError('Não foi possível carregar o ranking. Tente novamente mais tarde.'))
      .finally(() => setLoading(false))
  }, [])

  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3, 8)

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── Cabeçalho ─────────────────────────────────────────────── */}
      <header className={styles.pageHeader}>
        <div className={styles.inner}>
          <h1 className={styles.pageTitle}>Ranking Público</h1>
          <p className={styles.pageSubtitle}>Os 10 melhores monitores avaliados da UFG</p>
        </div>
      </header>

      {/* ── Conteúdo ──────────────────────────────────────────────── */}
      <main className={styles.pageContent}>
        <div className={styles.inner}>
          <div className={styles.infoBanner}>
            <InfoIcon />
            <p className={styles.infoBannerText}>
              Faça login para aplicar filtros e acessar os perfis completos dos monitores.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/cadastro')}>
              Criar conta
            </Button>
          </div>

          {loading && <p className={styles.loadingText}>Carregando ranking...</p>}
          {error   && <p className={styles.errorText}>{error}</p>}

          {!loading && !error && top3.length >= 3 && (
            <div className={styles.rankingLayout}>
              {/* Pódio */}
              <div className={styles.podiumCard}>
                <div className={styles.podium}>
                  {/* 2º lugar — esquerda */}
                  <div className={styles.podiumItem}>
                    <PodiumAvatar nome={top3[1].nome} avatar={top3[1].avatar} ringClass={styles.ringSilver} />
                    <p className={styles.podiumName}>{top3[1].nome}</p>
                    <div className={styles.podiumRating}>
                      <StarFilledIcon /> {top3[1].nota.toFixed(1)}
                    </div>
                    <div className={[styles.podiumBase, styles.baseSecond].join(' ')}>
                      <span className={styles.podiumPosition}>2</span>
                    </div>
                  </div>

                  {/* 1º lugar — centro */}
                  <div className={styles.podiumItem}>
                    <PodiumAvatar nome={top3[0].nome} avatar={top3[0].avatar} ringClass={styles.ringGold} />
                    <p className={styles.podiumName}>{top3[0].nome}</p>
                    <div className={styles.podiumRating}>
                      <StarFilledIcon /> {top3[0].nota.toFixed(1)}
                    </div>
                    <div className={[styles.podiumBase, styles.baseFirst].join(' ')}>
                      <span className={styles.podiumPosition}>1</span>
                    </div>
                  </div>

                  {/* 3º lugar — direita */}
                  <div className={styles.podiumItem}>
                    <PodiumAvatar nome={top3[2].nome} avatar={top3[2].avatar} ringClass={styles.ringBronze} />
                    <p className={styles.podiumName}>{top3[2].nome}</p>
                    <div className={styles.podiumRating}>
                      <StarFilledIcon /> {top3[2].nota.toFixed(1)}
                    </div>
                    <div className={[styles.podiumBase, styles.baseThird].join(' ')}>
                      <span className={styles.podiumPosition}>3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista 4º–10º */}
              <div className={styles.listCard}>
                {rest.map((monitor, index) => (
                  <div key={monitor.id} className={styles.listItem}>
                    <span className={styles.listPosition}>{index + 4}</span>
                    <ListAvatar nome={monitor.nome} avatar={monitor.avatar} />
                    <div className={styles.listInfo}>
                      <p className={styles.listName}>{monitor.nome}</p>
                      <p className={styles.listMeta}>
                        {monitor.curso} · {monitor.monitorias} monitorias
                      </p>
                    </div>
                    <div className={styles.listRating}>
                      <StarFilledIcon />
                      <span>{monitor.nota.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RankingPage
