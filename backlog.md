# Backlog — SAGRES Monitoria

> **Projeto:** SAGRES Monitoria  
> **Disciplina:** Arquitetura de Software / IHC  
> **Stack:** React.js (Frontend) · Spring Boot / Java (Backend) · PostgreSQL  
> **Arquitetura:** Monólito Modular em Camadas  
> **Última atualização:** Junho 2026  

---

## Legenda de Prioridade

| Prioridade | Descrição |
|---|---|
| 🔴 Alta | Funcionalidade central do MVP; bloqueia outros itens |
| 🟡 Média | Complementa o MVP; entrega valor significativo |
| 🟢 Baixa | Melhoria de UX / refinamento pós-MVP |

---

## Legenda de Status

| Status | Descrição |
|---|---|
| ✅ Concluído | Implementado e validado no protótipo |
| 🔲 A fazer | Não iniciado |
| 🔧 Em progresso | Em desenvolvimento |

---

## Épico 1 — Autenticação e Cadastro (`modulo-usuario`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-01 | Como visitante, quero me cadastrar com meu e-mail institucional UFG para acessar a plataforma | Validação do domínio `@discente.ufg.br` e `@ufg.br` em tempo real; senha forte com indicador visual; termos de uso obrigatórios | 🔴 Alta | ✅ |
| US-02 | Como visitante, quero confirmar meu e-mail após o cadastro para ativar minha conta | E-mail de confirmação enviado; countdown de 60s para reenvio; opção de alterar e-mail na mesma tela | 🔴 Alta | ✅ |
| US-03 | Como usuário cadastrado, quero fazer login com e-mail e senha para acessar minha conta | Tratamento de erro inline ("credenciais inválidas"); link para recuperação de senha | 🔴 Alta | ✅ |
| US-04 | Como usuário, quero recuperar minha senha via e-mail para não perder acesso à conta | Link de redefinição expira em 1h; feedback genérico por segurança ("se o e-mail estiver cadastrado…"); tela de redefinição de senha funcional | 🔴 Alta | ✅ |
| US-05 | Como usuário, quero permanecer logado entre sessões para não precisar autenticar toda vez | Refresh token; sessão persistida no cliente; logout seguro | 🟡 Média | 🔲 |

---

## Épico 2 — Dashboard (`modulo-usuario` / `modulo-agendamento`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-06 | Como aluno, quero ver um dashboard com meu resumo de atividades ao fazer login | KPIs: próximas monitorias, solicitações pendentes, avaliações a fazer, nota média; alternância de visão Aluno/Monitor | 🔴 Alta | ✅ |
| US-07 | Como monitor, quero ver solicitações recebidas no dashboard com ações rápidas | Botões "Aceitar" e "Recusar" inline; badge "X novas" em solicitações; sem necessidade de abrir cada item | 🔴 Alta | ✅ |
| US-08 | Como usuário, quero ver avaliações pendentes no dashboard para não esquecer de avaliar | Cards de avaliação pendente com botão "Avaliar" acessível direto no dashboard | 🟡 Média | ✅ |
| US-09 | Como monitor, quero ver meu desempenho resumido no dashboard | Posição no ranking, ganhos do mês, monitorias realizadas, alunos atendidos | 🟡 Média | ✅ |
| US-10 | Como usuário novo, quero ver um onboarding guiado no primeiro acesso | Estado vazio com CTA visível **acima da dobra**; orientação para cadastrar matérias ou buscar monitoria *(correção P1 — Avaliação Heurística)* | 🟡 Média | 🔲 |

---

## Épico 3 — Busca e Descoberta de Monitores (`modulo-monitoria`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-11 | Como aluno, quero buscar monitores por matéria, curso ou nome para encontrar quem preciso | Campo de busca full-text; resultados em tempo real | 🔴 Alta | ✅ |
| US-12 | Como aluno, quero filtrar monitores por curso, período, modalidade, faixa de preço e avaliação mínima | 6 filtros simultâneos; contador de resultados ("18 resultados encontrados") | 🔴 Alta | ✅ |
| US-13 | Como aluno, quero limpar todos os filtros de uma vez para voltar à listagem completa | Botão "Limpar filtros" visível assim que o primeiro filtro for ativado *(correção P6 — Avaliação Heurística)* | 🟡 Média | 🔲 |
| US-14 | Como aluno, quero ver uma mensagem orientadora quando a busca não retornar resultados | Ícone contextual + mensagem + CTA "Limpar filtros" no estado vazio | 🟡 Média | ✅ |
| US-15 | Como aluno, quero ordenar os resultados por relevância, avaliação ou preço | Dropdown "Ordenar por" com opções funcionais | 🟡 Média | ✅ |
| US-16 | Como aluno, quero ver cards de monitores com informações essenciais na listagem | Foto, nome, curso, período, nota, nº de avaliações, matéria, modalidades, preço/h | 🔴 Alta | ✅ |

---

## Épico 4 — Perfil do Monitor (`modulo-usuario` / `modulo-monitoria`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-17 | Como aluno, quero visualizar o perfil detalhado de um monitor para decidir se quero agendar | Seções: Sobre, Hard Skills, Soft Skills, Avaliações (com breakdown dimensional), Matérias com preço/modalidade, Disponibilidade com calendário | 🔴 Alta | ✅ |
| US-18 | Como aluno, quero ver avaliações do monitor vinculadas à disciplina específica | Exibir a matéria avaliada junto com cada review *(correção P13 — Avaliação Heurística)* | 🟡 Média | 🔲 |
| US-19 | Como aluno, quero clicar no card/foto de um monitor no ranking para acessar seu perfil | Cards e fotos do ranking são clicáveis com cursor pointer e efeito hover *(correção P3 — Avaliação Heurística)* | 🟡 Média | 🔲 |

---

## Épico 5 — Agendamento (`modulo-agendamento`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-20 | Como aluno, quero selecionar data e horário disponível do monitor para agendar uma monitoria | Calendário interativo com slots disponíveis/ocupados/selecionados; legenda de destaque com rótulos textuais visíveis *(correção P5 — Avaliação Heurística)* | 🔴 Alta | ✅ / 🔲* |
| US-21 | Como aluno, quero ver um resumo da solicitação em tempo real enquanto preencho o formulário | Painel lateral com data, horário, modalidade e valor atualizado dinamicamente | 🟡 Média | ✅ |
| US-22 | Como aluno, quero escolher entre modalidade remota ou presencial ao solicitar monitoria | Toggle ou radio de modalidade; endereço ou link exibido conforme seleção | 🔴 Alta | ✅ |
| US-23 | Como sistema, quero impedir agendamentos duplicados no mesmo horário do monitor | Validação de conflito no backend; slot ocupado exibido no frontend imediatamente | 🔴 Alta | 🔲 |
| US-24 | Como aluno, quero receber um código de confirmação após o agendamento | Código alfanumérico (ex.: A4B7Q2) gerado e exibido na tela de confirmação; enviado também por e-mail | 🔴 Alta | ✅ |
| US-25 | Como aluno ou monitor, quero cancelar uma monitoria confirmada com regras claras | Política de cancelamento exibida antes da confirmação; modal de confirmação em 2 etapas | 🟡 Média | ✅ |

> *US-20: calendário ✅ concluído; melhoria da legenda de slots 🔲 pendente.

---

## Épico 6 — Pagamento (`modulo-pagamento`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-26 | Como aluno, quero pagar a monitoria com cartão de crédito de forma segura | Visualização em tempo real dos dados do cartão; integração com gateway (Mercado Pago); tokenização; HTTPS | 🔴 Alta | ✅ |
| US-27 | Como aluno, quero entender para onde vai meu dinheiro antes de pagar | Detalhamento do resumo: valor da monitoria + taxa da plataforma separados; explicação do escrow *(correção P2 — Avaliação Heurística)* | 🟡 Média | 🔲 |
| US-28 | Como sistema, quero reter o pagamento até a confirmação da monitoria (escrow) | Valor retido na plataforma; liberado ao monitor somente após código duplo de confirmação; estorno automático em caso de não confirmação | 🔴 Alta | ✅ (design) / 🔲 (backend) |
| US-29 | Como aluno, quero receber reembolso automático em caso de cancelamento elegível | Política de reembolso com prazos claros; processo automatizado no backend | 🟡 Média | 🔲 |

---

## Épico 7 — Gerenciamento de Monitorias (`modulo-agendamento`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-30 | Como usuário, quero ver minhas monitorias organizadas em abas (Próximas, Pendentes, Histórico) | Cards com status visual (Confirmada, Em andamento, Pendente, Cancelada, Realizada); ações contextuais por status | 🔴 Alta | ✅ |
| US-31 | Como usuário, quero ver uma mensagem de estado vazio ao fim de cada aba | "Você não tem mais monitorias próximas agendadas" ao final da lista *(correção P4 — Avaliação Heurística)* | 🟢 Baixa | 🔲 |
| US-32 | Como usuário, quero ver detalhes completos de uma monitoria confirmada | Tela de detalhes com abas: Informações / Monitor / Avaliação; ações: Abrir chat, Adicionar à agenda, Cancelar, Denunciar | 🔴 Alta | ✅ |
| US-33 | Como usuário, quero adicionar uma monitoria ao meu calendário externo | Ação "Adicionar à agenda" exporta evento (Google Calendar / .ics) | 🟢 Baixa | 🔲 |

---

## Épico 8 — Chat (`modulo-chat`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-34 | Como aluno ou monitor, quero trocar mensagens em tempo real durante a monitoria | Layout split: lista de conversas à esquerda, chat ativo à direita; WebSocket; indicador de status online; horário por mensagem | 🔴 Alta | ✅ (design) / 🔲 (backend) |
| US-35 | Como usuário, quero enviar arquivos (PDF) e imagens no chat | Upload de arquivo com nome exibido; preview de imagem inline | 🟡 Média | ✅ |
| US-36 | Como usuário, quero saber se minha mensagem foi lida pelo destinatário | Indicador de leitura (check simples = entregue; check duplo/colorido = lida) *(correção P8 — Avaliação Heurística)* | 🟢 Baixa | 🔲 |
| US-37 | Como sistema, quero encerrar o chat automaticamente após a conclusão da monitoria | Banner de aviso "Este chat será encerrado em Xh Xmin"; somente leitura por 24h após encerramento | 🟡 Média | ✅ (design) |
| US-38 | Como usuário, quero receber notificação de novas mensagens | Badge numérico no ícone de chat na navbar; alerta em tempo real | 🟡 Média | ✅ |

---

## Épico 9 — Avaliação (`modulo-avaliacao`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-39 | Como aluno, quero avaliar o monitor após a monitoria | Modal de avaliação com: estrelas gerais (1–5), dimensões (Clareza, Paciência, Domínio, Comunicação), campo de texto livre, toggle de visibilidade pública | 🔴 Alta | ✅ |
| US-40 | Como monitor, quero que minhas avaliações impactem meu ranking | Cálculo automático de nota média; atualização do ranking após nova avaliação | 🔴 Alta | 🔲 |
| US-41 | Como usuário, quero poder denunciar comportamento inapropriado | Ação "Denunciar" disponível nos detalhes da monitoria e no chat | 🟡 Média | ✅ (design) / 🔲 (backend) |

---

## Épico 10 — Perfil do Usuário (`modulo-usuario`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-42 | Como usuário, quero editar minhas informações pessoais | Edição de nome, foto de perfil, curso, período, bio | 🟡 Média | ✅ |
| US-43 | Como usuário, quero gerenciar minhas Hard e Soft Skills | Adicionar e remover habilidades com tags; remoção com modal de confirmação "Tem certeza?" *(correção P9 — Avaliação Heurística)* | 🟡 Média | ✅ / 🔲* |
| US-44 | Como monitor, quero cadastrar as matérias que posso monitorar | Fluxo de 5 etapas: Matéria → Comprovação → Oferta → Horários → Revisão; botão "Continuar" desabilitado até seleção válida *(correção P7 — Avaliação Heurística)* | 🔴 Alta | ✅ / 🔲* |
| US-45 | Como monitor, quero anexar comprovante de aprovação na disciplina | Upload de PDF ou imagem; preview/miniatura do arquivo antes de confirmar o envio *(correção P10 — Avaliação Heurística)* | 🔴 Alta | ✅ / 🔲* |
| US-46 | Como usuário, quero ver as avaliações que recebi no meu perfil | Aba "Avaliações Recebidas" com nota geral, breakdown dimensional e reviews com texto | 🟡 Média | ✅ |

> *US-43: listagem ✅; confirmação de exclusão 🔲 pendente. US-44: fluxo ✅; disabled state do botão 🔲 pendente. US-45: upload ✅; preview do arquivo 🔲 pendente.

---

## Épico 11 — Ranking (`modulo-avaliacao` / `modulo-monitoria`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-47 | Como visitante, quero ver o ranking público dos melhores monitores da semana | Top monitores na landing page com foto, nome, nota e matéria; atualizados semanalmente | 🟡 Média | ✅ |
| US-48 | Como usuário logado, quero ver o ranking completo com filtros | Página de ranking com cards clicáveis (acesso ao perfil), hover e cursor pointer *(correção P3 — Avaliação Heurística)* | 🟡 Média | ✅ / 🔲* |
| US-49 | Como sistema, quero exibir uma mensagem adequada quando não houver dados suficientes para o ranking | Estado vazio específico para ranking sem dados | 🟢 Baixa | ✅ |

---

## Épico 12 — Notificações (`modulo-usuario`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-50 | Como usuário, quero receber notificações de eventos importantes na plataforma | Dropdown de notificações acessível por 1 clique no sino; badge numérico na navbar | 🟡 Média | ✅ |
| US-51 | Como usuário, quero entender o significado do indicador de notificação não lida | Legenda explicando o ponto colorido; diferenciação visual clara entre lidas e não lidas *(correção P12 — Avaliação Heurística)* | 🟢 Baixa | 🔲 |
| US-52 | Como usuário, quero receber lembrete automático 1h antes da monitoria | Notificação push/e-mail com data, hora e nome do participante | 🟡 Média | 🔲 |

---

## Épico 13 — Configurações (`modulo-usuario`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-53 | Como usuário, quero alterar minha senha nas configurações de conta | Campos: senha atual, nova senha, confirmar nova senha; validação inline | 🟡 Média | ✅ |
| US-54 | Como usuário, quero gerenciar quais notificações recebo | Toggles granulares por categoria (monitorias, pagamentos, chat, marketing) | 🟢 Baixa | ✅ |
| US-55 | Como usuário, quero ajustar minhas preferências de privacidade | Toggle: perfil público/privado; quem pode me contatar; dados visíveis para outros | 🟡 Média | ✅ |
| US-56 | Como usuário, quero alterar o idioma da interface | Seletor de idioma (PT-BR / EN) | 🟢 Baixa | ✅ (design) |
| US-57 | Como usuário, quero exportar meus dados pessoais (LGPD) | Botão de exportação em Configurações → Privacidade; download de JSON/ZIP com dados do usuário | 🟡 Média | ✅ (design) / 🔲 (backend) |
| US-58 | Como usuário, quero excluir minha conta permanentemente | Ação na "Zona de Perigo"; confirmação em 2 etapas (modal + digitação de confirmação); deleção real dos dados (LGPD) | 🟡 Média | ✅ (design) / 🔲 (backend) |

---

## Épico 14 — Central de Ajuda (`modulo-usuario`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-59 | Como usuário, quero acessar um FAQ organizado por categorias | Categorias: Começando, Buscando, Agendando, Pagamento, Monitor, Avaliações, Chat, Segurança | 🟢 Baixa | ✅ |
| US-60 | Como usuário, quero entrar em contato com o suporte | Aba "Contato" na Central de Ajuda com formulário ou canal de atendimento | 🟢 Baixa | ✅ |
| US-61 | Como usuário, quero acessar os Termos de Uso e Política de Privacidade | Aba "Termos e Políticas" na Central de Ajuda; também acessível pela landing page | 🟡 Média | ✅ |

---

## Épico 15 — Área Pública (`modulo-usuario` / `modulo-monitoria`)

| # | História de Usuário | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-62 | Como visitante, quero entender o produto na landing page antes de me cadastrar | Hero com proposta de valor; seção "Como funciona" (3 passos); seção "Para Monitores"; CTA de cadastro e login | 🔴 Alta | ✅ |
| US-63 | Como visitante, quero ver o ranking de monitores sem precisar criar conta | Ranking público com top 5 na landing page; link para ranking completo | 🟡 Média | ✅ |

---

## Épico 16 — Infraestrutura e Segurança

| # | História de Usuário / Tarefa Técnica | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|
| US-64 | Implementar autenticação JWT com refresh token | Spring Security + JWT; endpoints protegidos por role (ALUNO, MONITOR); token com expiração configurável | 🔴 Alta | 🔲 |
| US-65 | Implementar validação de e-mail institucional UFG | Verificação de domínio `@discente.ufg.br` / `@ufg.br`; envio de e-mail de confirmação via SMTP | 🔴 Alta | 🔲 |
| US-66 | Integrar gateway de pagamento (Mercado Pago) | Tokenização de cartão; criação de cobrança; webhook de confirmação; lógica de escrow; estorno automatizado | 🔴 Alta | 🔲 |
| US-67 | Implementar WebSocket para chat em tempo real | Spring WebSocket / STOMP; persistência de histórico no PostgreSQL; ciclo de vida vinculado à monitoria | 🔴 Alta | 🔲 |
| US-68 | Implementar tratamento de erros HTTP (404, 403, 500) | Telas de erro customizadas com código de rastreamento; redirecionamento para Dashboard | 🟡 Média | ✅ (design) / 🔲 (backend) |
| US-69 | Configurar conformidade LGPD | Exportação de dados, deleção de conta, política de privacidade acessível, consentimento no cadastro | 🟡 Média | ✅ (design) / 🔲 (backend) |

---

## Melhorias de UX Priorizadas (Avaliação Heurística — PF4)

Itens derivados dos 13 problemas identificados na avaliação heurística, mapeados nos épicos acima:

| Problema | Heurística | Severidade | US Relacionada | Status |
|---|---|---|---|---|
| P1 — CTAs do onboarding abaixo da dobra | H1, H3, H6, H8 | 2 | US-10 | 🔲 |
| P2 — Falta de detalhamento de valores no pagamento | H1, H2, H5 | 2 | US-27 | 🔲 |
| P3 — Cards do ranking não clicáveis | H2, H3, H4, H6 | 1–2 | US-19, US-48 | 🔲 |
| P4 — Sem indicação de fim de lista em Minhas Monitorias | H1, H4 | 2 | US-31 | 🔲 |
| P5 — Legenda de horários de baixo destaque | H1, H4, H6 | 2 | US-20 | 🔲 |
| P6 — Ausência de "Limpar todos os filtros" | H3, H7 | 2 | US-13 | 🔲 |
| P7 — Botão "Continuar" sempre ativo no cadastro de matéria | H5 | 2 | US-44 | 🔲 |
| P8 — Sem indicador de leitura no chat | H1 | 1 | US-36 | 🔲 |
| P9 — Exclusão de habilidades sem confirmação | H5 | 3 | US-43 | 🔲 |
| P10 — Sem preview do comprovante anexado | H3, H5 | 2 | US-45 | 🔲 |
| P11 — Feedback ambíguo na recuperação de senha | H1 | 1 | US-04 | ✅ (intencional — segurança) |
| P12 — Ponto de notificação sem legenda | H1, H6 | 2 | US-51 | 🔲 |
| P13 — Avaliações sem vínculo à disciplina | H1, H2 | 2 | US-18 | 🔲 |

---

*Gerado com base no protótipo de alta fidelidade (84 frames — Figma), documentação de arquitetura e avaliação heurística de Nielsen (PF4 — Junho 2026).*