# ROTATIX — TODO

## BANCO DE DADOS (Migrations)
- [x] `lancamentos_horas` — empresa_id, data, horas, usuario_id
- [x] `impedimentos` — empresa_id, data, justificativa, usuario_id
- [x] `empresa_servico` (pivot) — empresa_id, servico_id
- [x] `audit_logs` — user_id, acao, tabela, registro_id, created_at
- [x] Coluna `perfil` em `users` — ENUM('admin','operador')
- [x] Coluna `posicao_fila` em `empresas`
- [x] Coluna `horas_semana` em `empresas`
- [x] Coluna `ciclo_concluido` (bool) em `empresas`

## MODELS
- [x] `LancamentoHora` — empresa(), usuario()
- [x] `Impedimento` — empresa(), usuario()
- [x] `AuditLog` — user()
- [x] Relação `Empresa hasMany LancamentoHora`
- [x] Relação `Empresa belongsToMany Servico`

## BACKEND (Controllers / Services)
- [x] `LancamentoHoraController` — store (registrar horas diárias)
- [x] `ImpedimentoController` — store, index
- [x] `RotacaoController` — lógica de fila/rodízio
- [x] `RelatorioController` — endpoints de relatórios
- [x] `AuditLogController` (só admin)
- [x] Lógica: somar horas → marcar ciclo_concluido ao atingir 40h
- [x] Lógica: mover empresa para fim da fila após 40h
- [x] Lógica: bloquear empresa "fura-fila"
- [x] Middleware RBAC — admin vs operador
- [x] `UserController` — CRUD (admin only)

## FRONTEND (React Pages)
- [ ] `Servicos/Index.jsx` — listar serviços
- [ ] `Servicos/Create.jsx` — cadastrar serviço
- [ ] `Empresas/Create.jsx` — cadastrar empresa
- [ ] `Empresas/Show.jsx` — detalhe + horas + impedimentos
- [ ] `Empresas/Vinculos.jsx` — vincular empresa ↔ serviço
- [ ] `LancamentoHoras/Create.jsx` — registro diário
- [ ] `Impedimentos/Create.jsx` — registrar impedimento
- [ ] `Impedimentos/Index.jsx` — listar impedimentos
- [ ] `Usuarios/Index.jsx` — gerenciar usuários (admin)
- [ ] `Usuarios/Create.jsx` — criar usuário (admin)
- [ ] `Rotacao/Index.jsx` — painel rodízio (melhorar existente)

## RELATÓRIOS
- [ ] Prestadores por Categoria
- [ ] Catálogo de Serviços Ativos
- [ ] Status do Rodízio Atual
- [ ] Justificativas / Impedimentos
- [ ] Consolidado Mensal de Horas

## SEGURANÇA
- [ ] RBAC middleware (admin / operador)
- [ ] Registro de audit_log em cada mutação
- [ ] Validação de inputs — todos os Controllers

## NÃO-FUNCIONAIS
- [ ] Job/Command backup diário do DB
- [ ] Documentação restore (RESTORE.md)
- [ ] Tela Ajuda — Guia de Registro de Horas
- [ ] Tela Ajuda — Manual do Rodízio
- [ ] Tela Ajuda — Procedimento de Impedimento
