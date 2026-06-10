import axios from 'axios'
import { TOKEN_KEY } from '../constants/auth'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_DELAY = 500

// ─── Helpers de mock ──────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function mockError(status, message) {
  const error = new Error(message)
  error.response = { status, data: { message } }
  return Promise.reject(error)
}

// Controla quais e-mails mock foram confirmados via "Reenviar e-mail"
const MOCK_CONFIRMED_KEY = 'sagres_mock_confirmed'

function mockIsConfirmed(email) {
  const stored = localStorage.getItem(MOCK_CONFIRMED_KEY) || ''
  return stored.split(',').includes(email)
}

function mockMarkConfirmed(email) {
  const list = (localStorage.getItem(MOCK_CONFIRMED_KEY) || '').split(',').filter(Boolean)
  if (!list.includes(email)) {
    list.push(email)
    localStorage.setItem(MOCK_CONFIRMED_KEY, list.join(','))
  }
}

// Constrói um JWT com payload decodificável para uso nos mocks
function buildMockToken(email) {
  const payload = btoa(
    JSON.stringify({ sub: email, role: 'ALUNO', exp: 9999999999 })
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `mock-header.${payload}.mock-sig`
}

const MOCK_RANKING = [
  { id: 1, nome: 'Ana Beatriz Rocha', curso: 'Ciência da Computação', periodo: '9º', nota: 5.0, avatar: null },
  { id: 2, nome: 'Carlos Solrac', curso: 'Engenharia de Software', periodo: '8º', nota: 4.9, avatar: null },
  { id: 3, nome: 'Felipe Andrade', curso: 'Sistemas de Informação', periodo: '7º', nota: 4.9, avatar: null },
  { id: 4, nome: 'Clara Wang', curso: 'Ciência da Computação', periodo: '10º', nota: 4.8, avatar: null },
  { id: 5, nome: 'José Bezerra', curso: 'Ciência da Computação', periodo: '6º', nota: 4.8, avatar: null },
]

const MOCK_RANKING_COMPLETO = [
  { id: 1,  nome: 'Ana Beatriz Rocha', curso: 'Ciência da Computação',  periodo: '9º período', nota: 5.0, avatar: null, monitorias: 112 },
  { id: 2,  nome: 'Carlos Solrac',     curso: 'Engenharia de Software', periodo: '8º período', nota: 4.9, avatar: null, monitorias: 103 },
  { id: 3,  nome: 'Felipe Andrade',    curso: 'Sistemas de Informação', periodo: '7º período', nota: 4.9, avatar: null, monitorias: 97  },
  { id: 4,  nome: 'Clara Wang',        curso: 'Ciência da Computação',  periodo: '5º período', nota: 4.8, avatar: null, monitorias: 88  },
  { id: 5,  nome: 'José Bezerra',      curso: 'Ciência da Computação',  periodo: '7º período', nota: 4.8, avatar: null, monitorias: 96  },
  { id: 6,  nome: 'Letícia Moraes',    curso: 'Engenharia de Software', periodo: '6º período', nota: 4.6, avatar: null, monitorias: 58  },
  { id: 7,  nome: 'Ana Silva',         curso: 'Engenharia de Software', periodo: '5º período', nota: 4.6, avatar: null, monitorias: 45  },
  { id: 8,  nome: 'Rute Barbosa',      curso: 'Engenharia de Software', periodo: '4º período', nota: 4.6, avatar: null, monitorias: 58  },
  { id: 9,  nome: 'Marcos Oliveira',   curso: 'Sistemas de Informação', periodo: '8º período', nota: 4.5, avatar: null, monitorias: 41  },
  { id: 10, nome: 'Fernanda Costa',    curso: 'Ciência da Computação',  periodo: '6º período', nota: 4.5, avatar: null, monitorias: 39  },
]

// ─── Instância axios ───────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Em 401 limpa o token e redireciona apenas quando havia uma sessão ativa.
// Evita que um 401 de credenciais inválidas no login redirecione antes
// do catch da página tratar o erro.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Qualquer e-mail institucional (@ufg.br ou @discente.ufg.br) com senha forte é aceito.
// Contas abaixo ficam com 403 até o fluxo de reenvio ser concluído.
const UNCONFIRMED_ACCOUNTS = {
  'julia@discente.ufg.br': 'Teste@123',
  'stella@discente.ufg.br': 'Teste@123',
  'cleide@discente.ufg.br': 'Teste@123',
}

function isInstitutionalEmail(email) {
  return /^[\w.]+@(discente\.)?ufg\.br$/.test(email)
}

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

// ─── Métodos de autenticação ───────────────────────────────────────

export function confirmarEmailMock(email) {
  if (USE_MOCK && email) mockMarkConfirmed(email)
}

export async function cadastrar(data) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return { message: 'Cadastro realizado. Verifique seu e-mail para confirmar a conta.' }
  }
  const res = await api.post('/api/auth/cadastrar', data)
  return res.data
}

export async function login(data) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    // Contas não validadas: verificam senha específica antes do 403
    const unconfirmedPassword = UNCONFIRMED_ACCOUNTS[data.email]
    if (unconfirmedPassword !== undefined) {
      if (data.senha !== unconfirmedPassword) {
        return mockError(401, 'Credenciais inválidas.')
      }
      if (!mockIsConfirmed(data.email)) {
        return mockError(403, 'E-mail ainda não confirmado.')
      }
      return { token: buildMockToken(data.email) }
    }
    // Regra geral: e-mail institucional + senha forte → sucesso
    if (!isInstitutionalEmail(data.email) || !isStrongPassword(data.senha)) {
      return mockError(401, 'Credenciais inválidas.')
    }
    return { token: buildMockToken(data.email) }
  }
  const res = await api.post('/api/auth/login', data)
  return res.data
}

export async function confirmarEmail(token) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    if (token === 'expirado') return mockError(400, 'Token expirado ou inválido.')
    return { message: 'E-mail confirmado com sucesso.' }
  }
  const res = await api.get('/api/auth/confirmar-email', { params: { token } })
  return res.data
}

export async function reenviarConfirmacao(email) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    mockMarkConfirmed(email)
    return { message: 'E-mail reenviado.' }
  }
  const res = await api.post('/api/auth/reenviar-confirmacao', { email })
  return res.data
}

export async function esqueciSenha(email) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    // Sempre 200 — não revela se o e-mail existe
    return { message: 'Se o e-mail estiver cadastrado, você receberá um link em breve.' }
  }
  const res = await api.post('/api/auth/esqueci-senha', { email })
  return res.data
}

export async function redefinirSenha(token, novaSenha) {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    if (token === 'expirado') return mockError(400, 'Token expirado ou já utilizado.')
    return { message: 'Senha redefinida com sucesso.' }
  }
  const res = await api.post('/api/auth/redefinir-senha', { token, novaSenha })
  return res.data
}

export async function getRankingSemana() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return MOCK_RANKING
  }
  const res = await api.get('/api/public/ranking-semana')
  return res.data
}

export async function getRankingCompleto() {
  if (USE_MOCK) {
    await delay(MOCK_DELAY)
    return MOCK_RANKING_COMPLETO
  }
  const res = await api.get('/api/public/ranking')
  return res.data
}
