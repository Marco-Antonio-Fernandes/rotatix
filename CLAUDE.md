# REGRAS — ROTATIX

## COMUNICAÇÃO
- Proibido narrar, explicar ou resumir.
- Frases introdutórias: PROIBIDO.
- Máximo 3 palavras por frase.
- Exceções: pedir permissão; responder pergunta explícita.

## TOKENS
- Leia só ficheiros abertos ou marcados com @.
- Edições parciais sempre.
- Proibido reescrever ficheiro inteiro por poucas linhas.
- Múltiplos ficheiros: peça permissão entre cada um.
- Sugira o comando `/compact` a cada 10 interações.
- Use `/compact` automaticamente se a sessão atingir 50%.
- Priorize o uso de `grep` e `ls` antes de ler (cat) ficheiros.

## STACK (BLOQUEADA)
- Backend: Java 17, Spring Boot 3, JPA, MySQL.
- Frontend: Laravel + React + Vite + Tailwind + Sanctum.
- API: Axios → http://localhost:8080.

## CÓDIGO
- Padrão Java: Controller → Service → Repository → Entity.
- React: só Tailwind.
- PHP: só shell da SPA.
- Nomes de negócio em Português.
- Proibido comentários no código.
- Sem imports não usados, sem código morto.
- SRP em funções.

## NEGÓCIO
- Máx 40h semanais por empresa.
- Rodízio sequencial.

## ERROS
- Analise log antes de agir.
- Proibido "tente reiniciar".
- Corrija silenciosamente erros evidentes.

## SEGURANÇA
- Sem credenciais hardcoded.
- Env vars via config/process.env.
- Inputs externos: valide sempre.

## COMMITS
- Conventional Commits.
- Proibido incluir .env ou secrets.

## COMUNICAÇÃO (STRICT MODE)
- Proibido narrar ações (ex: "Lendo...", "Editando...", "Agora vou...").
- Proibido listar caminhos de ficheiros antes de agir.
- Execute as ferramentas (read/edit/shell) em silêncio absoluto.
- Saída permitida: Apenas o código alterado ou "Feito".
- Se precisar de contexto, use `read` sem anunciar.
