# Procedimento de Restore — Rotatix

## Localização dos backups

Os arquivos são gerados diariamente às 02:00 e armazenados em:

```
storage/backups/<database>_<YYYY-MM-DD_HHmmss>.sql.gz
```

São mantidos os **7 backups mais recentes** (os anteriores são removidos automaticamente).

---

## Pré-requisitos

- Acesso ao servidor com `mysql` e `gunzip` instalados
- Credenciais do banco (mesmo `.env` de produção)

---

## Restaurar um backup

### 1. Identificar o arquivo

```bash
ls -lh storage/backups/
```

### 2. Descompactar e importar

```bash
gunzip -c storage/backups/<arquivo>.sql.gz | mysql \
  --host=<DB_HOST> \
  --port=<DB_PORT> \
  --user=<DB_USERNAME> \
  --password=<DB_PASSWORD> \
  <DB_DATABASE>
```

### 3. Verificar integridade

```bash
php artisan tinker --execute="echo DB::table('empresas')->count() . ' empresas';"
```

---

## Executar backup manual

```bash
php artisan db:backup
```

---

## Agendar no cron do servidor (produção)

Adicione ao crontab do usuário do servidor web:

```cron
* * * * * cd /caminho/do/projeto && php artisan schedule:run >> /dev/null 2>&1
```

O scheduler dispara `db:backup` todos os dias às **02:00**.

---

## Pontos de atenção

- O arquivo `.env` **não** é incluído no backup — mantenha uma cópia segura separada.
- Em caso de migração de servidor, execute `php artisan migrate` após o restore para garantir que o schema está atualizado.
- Nunca commite arquivos `.sql` ou `.sql.gz` no repositório.
