import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDisplayName } from '../../utils/text'
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar'
import SummaryCard from '../../components/dashboard/SummaryCard/SummaryCard'
import styles from './DashboardPage.module.css'

// ─── Mock data ────────────────────────────────────────────────────

const MOCK_MONITORIAS = [
  {
    id: 1,
    dia: '19',
    mes: 'NOV',
    materia: 'Algoritmos e Estruturas de Dados',
    monitor: 'Carlos Sobrec',
    horario: '14:00 – 16:30',
    local: 'Remoto',
    presencial: false,
    status: 'Confirmado',
  },
  {
    id: 2,
    dia: '21',
    mes: 'NOV',
    materia: 'Programação Orientada a Objetos',
    monitor: 'Ana Beatriz Rocha',
    horario: '10:00 – 11:00',
    local: 'INF 213',
    presencial: true,
    status: 'Confirmado',
  },
  {
    id: 3,
    dia: '21',
    mes: 'NOV',
    materia: 'Banco de Dados',
    monitor: 'Felipe Andrade',
    horario: '14:00 – 15:40',
    local: 'INF 313',
    presencial: true,
    status: 'Confirmado',
  },
]

const MOCK_SOLICITACOES = [
  { id: 1, nome: 'Lucas Almeida', curso: 'Ciência da Computação' },
  { id: 2, nome: 'Rute Barbosa', curso: 'MC' },
  { id: 3, nome: 'Camila Souza', curso: 'Projeto de Software' },
  { id: 4, nome: 'Gustavo Santana', curso: 'GEO 9' },
  { id: 5, nome: 'Sabrina Arantes', curso: 'Teste de Software' },
]

const MOCK_AVALIACOES = [
  { id: 1, materia: 'POO', monitor: 'Ana Beatriz Rocha', data: '10 Jun' },
  { id: 2, materia: 'Introdução à Programação', monitor: 'José Bezerra', data: '05 Jun' },
]

const MOCK_DESEMPENHO = {
  ranking: '#10',
  ganhosMes: 'R$ 320',
  monitoriasRealizadas: 45,
  alunosAtendidos: 38,
}

// ─── Helpers ──────────────────────────────────────────────────────

function avatarColor(name) {
  const palette = ['#2a6cb8', '#27b36b', '#efb23c', '#f0584f', '#7c3aed', '#e07c00']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

function Initials({ name, size = 'md' }) {
  const parts = name.trim().split(/\s+/)
  const letters = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2)
  return (
    <div
      className={`${styles.initials} ${styles[`initials_${size}`]}`}
      style={{ backgroundColor: avatarColor(name) }}
      aria-hidden="true"
    >
      {letters.toUpperCase()}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function SearchStepIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarStepIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function StarStepIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarSumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockSumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarSumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function TrophySumIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v5a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 7H3a2 2 0 002 2M18 7h3a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15v4M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function TrophyPerfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v5a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 7H3a2 2 0 002 2M18 7h3a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15v4M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v12M9 8.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5c0 2.5-6 2.5-6 5 0 1.38 1.34 2.5 3 2.5s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── First access view ────────────────────────────────────────────

function FirstAccessView({ name }) {
  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.banner}>
            <h1 className={styles.bannerTitle}>Bom dia, {name}!</h1>
            <p className={styles.bannerSubtitle}>Você ainda não tem atividade por aqui. Vamos começar?</p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepIcon}><SearchStepIcon /></div>
              <h3 className={styles.stepTitle}>1. Encontre um monitor</h3>
              <p className={styles.stepDesc}>Busque por matéria, curso ou nome e filtre pela avaliação.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepIcon}><CalendarStepIcon /></div>
              <h3 className={styles.stepTitle}>2. Agende a monitoria</h3>
              <p className={styles.stepDesc}>Escolha um horário livre e envie sua solicitação.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepIcon}><StarStepIcon /></div>
              <h3 className={styles.stepTitle}>3. Aprenda e avalie</h3>
              <p className={styles.stepDesc}>Participe da aula e deixe sua avaliação para ajudar a tripulação.</p>
            </div>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><CompassIcon /></div>
            <h2 className={styles.emptyTitle}>Tudo pronto, {name}!</h2>
            <p className={styles.emptyDesc}>
              Sua jornada na SAGRES começou. Busque sua primeira monitoria ou
              cadastre-se como monitor para ajudar colegas e ganhar uma renda extra.
            </p>
            <div className={styles.emptyActions}>
              <button className={styles.btnPrimary}>
                <SearchStepIcon />
                Buscar monitoria
              </button>
              <button className={styles.btnSecondary}>
                <CompassIcon />
                Quero ser monitor
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// ─── Main dashboard view ──────────────────────────────────────────

function MainDashboardView({ name }) {
  const [solicitacoes, setSolicitacoes] = useState(MOCK_SOLICITACOES)

  function handleAceitar(id) {
    setSolicitacoes((prev) => prev.filter((s) => s.id !== id))
  }

  function handleRecusar(id) {
    setSolicitacoes((prev) => prev.filter((s) => s.id !== id))
  }

  const novas = solicitacoes.length

  return (
    <div className={styles.page}>
      <DashboardNavbar messageBadge={2} notifBadge={4} />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Banner */}
          <div className={styles.banner}>
            <div>
              <h1 className={styles.bannerTitle}>Bom dia, {name}!</h1>
              <p className={styles.bannerSubtitle}>Aqui está o resumo das suas monitorias.</p>
            </div>
            <div className={styles.bannerBadges}>
              <span className={styles.roleBadge}>
                <span className={styles.roleDot} />
                Você é Aluno
              </span>
              <span className={styles.roleBadge}>
                <span className={styles.roleDot} />
                Você é Monitor
              </span>
            </div>
          </div>

          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            <SummaryCard
              icon={<CalendarSumIcon />}
              color="blue"
              value="2"
              label="Próximas monitorias"
              sublabel="Nos próximos 7 dias"
            />
            <SummaryCard
              icon={<ClockSumIcon />}
              color="orange"
              value="3"
              label="Solicitações pendentes"
              sublabel="Aguardando resposta"
            />
            <SummaryCard
              icon={<StarSumIcon />}
              color="purple"
              value="2"
              label="Avaliações a fazer"
              sublabel="Monitorias realizadas"
            />
            <SummaryCard
              icon={<TrophySumIcon />}
              color="gold"
              value="4.8"
              label="Nota média"
              sublabel="Baseado em 45 avaliações"
            />
          </div>

          {/* Main two-column grid */}
          <div className={styles.mainGrid}>

            {/* Left column */}
            <div className={styles.leftCol}>

              {/* Próximas monitorias */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Próximas monitorias</h2>
                  <button className={styles.seeAllBtn}>Ver todas →</button>
                </div>
                <div className={styles.monitoriaList}>
                  {MOCK_MONITORIAS.map((m) => (
                    <div key={m.id} className={styles.monitoriaItem}>
                      <div className={styles.dateBadge}>
                        <span className={styles.dateDay}>{m.dia}</span>
                        <span className={styles.dateMes}>{m.mes}</span>
                      </div>
                      <div className={styles.monitoriaInfo}>
                        <span className={styles.monitoriaMateria}>{m.materia}</span>
                        <span className={styles.monitoriaDetails}>
                          <span className={styles.monitoriaMonitor}>com {m.monitor}</span>
                          <span className={styles.detailSep}>·</span>
                          <ClockIcon />
                          {m.horario}
                          <span className={styles.detailSep}>·</span>
                          <MapPinIcon />
                          {m.presencial ? `Presencial · ${m.local}` : m.local}
                        </span>
                      </div>
                      <span className={styles.statusConfirmado}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliações pendentes */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Avaliações pendentes</h2>
                  <button className={styles.seeAllBtn}>Ver todas →</button>
                </div>
                <div className={styles.avaliacoesList}>
                  {MOCK_AVALIACOES.map((a) => (
                    <div key={a.id} className={styles.avaliacaoItem}>
                      <Initials name={a.monitor} size="md" />
                      <div className={styles.avaliacaoInfo}>
                        <span className={styles.avaliacaoMateria}>{a.materia}</span>
                        <span className={styles.avaliacaoMeta}>com {a.monitor} · {a.data}</span>
                      </div>
                      <button className={styles.btnAvaliar}>
                        <StarStepIcon />
                        Avaliar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right column */}
            <div className={styles.rightCol}>

              {/* Solicitações recebidas */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Solicitações recebidas</h2>
                  {novas > 0 && (
                    <span className={styles.newsBadge}>{novas} novas</span>
                  )}
                </div>
                <div className={styles.solicitacoesList}>
                  {solicitacoes.map((s) => (
                    <div key={s.id} className={styles.solicitacaoItem}>
                      <Initials name={s.nome} size="sm" />
                      <div className={styles.solicitacaoInfo}>
                        <span className={styles.solicitacaoNome}>{s.nome}</span>
                        <span className={styles.solicitacaoCurso}>{s.curso}</span>
                      </div>
                      <div className={styles.solicitacaoActions}>
                        <button
                          className={styles.btnAceitar}
                          onClick={() => handleAceitar(s.id)}
                        >
                          <CheckIcon />
                          Aceitar
                        </button>
                        <button
                          className={styles.btnRecusar}
                          onClick={() => handleRecusar(s.id)}
                        >
                          <XIcon />
                          Recusar
                        </button>
                      </div>
                    </div>
                  ))}
                  {solicitacoes.length === 0 && (
                    <p className={styles.emptyList}>Nenhuma solicitação pendente.</p>
                  )}
                </div>
              </div>

              {/* Desempenho como monitor */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Seu desempenho como monitor</h2>
                </div>
                <div className={styles.desempenhoList}>
                  <div className={styles.desempenhoItem}>
                    <span className={styles.desempenhoIcon} style={{ color: 'var(--color-gold)' }}>
                      <TrophyPerfIcon />
                    </span>
                    <span className={styles.desempenhoLabel}>Posição no ranking</span>
                    <span className={styles.desempenhoValue}>{MOCK_DESEMPENHO.ranking}</span>
                  </div>
                  <div className={styles.desempenhoItem}>
                    <span className={styles.desempenhoIcon} style={{ color: 'var(--color-ok)' }}>
                      <CoinIcon />
                    </span>
                    <span className={styles.desempenhoLabel}>Ganhos do mês</span>
                    <span className={styles.desempenhoValue}>{MOCK_DESEMPENHO.ganhosMes}</span>
                  </div>
                  <div className={styles.desempenhoItem}>
                    <span className={styles.desempenhoIcon} style={{ color: 'var(--color-primary)' }}>
                      <BookIcon />
                    </span>
                    <span className={styles.desempenhoLabel}>Monitorias realizadas</span>
                    <span className={styles.desempenhoValue}>{MOCK_DESEMPENHO.monitoriasRealizadas}</span>
                  </div>
                  <div className={styles.desempenhoItem}>
                    <span className={styles.desempenhoIcon} style={{ color: '#7c3aed' }}>
                      <UserIcon />
                    </span>
                    <span className={styles.desempenhoLabel}>Alunos atendidos</span>
                    <span className={styles.desempenhoValue}>{MOCK_DESEMPENHO.alunosAtendidos}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// ─── Dashboard page ───────────────────────────────────────────────

function DashboardPage() {
  const { user } = useAuth()
  const name = getDisplayName(user?.email)

  const [isFirstAccess] = useState(() => {
    if (!user?.email) return false
    const key = `new_user_pending_dashboard_${user.email}`
    const isPending = !!localStorage.getItem(key)
    if (isPending) localStorage.removeItem(key)
    return isPending
  })

  if (isFirstAccess) {
    return <FirstAccessView name={name} />
  }

  return <MainDashboardView name={name} />
}

export default DashboardPage
