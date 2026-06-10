export function getInitials(nome) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getDisplayName(email) {
  if (!email) return 'Aluno(a)'
  const local = email.split('@')[0]
  const first = local.split(/[._-]/)[0]
  if (!first) return 'Aluno(a)'
  return first.charAt(0).toUpperCase() + first.slice(1)
}
