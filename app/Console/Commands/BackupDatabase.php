<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Gera dump do banco MySQL e armazena em storage/backups/';

    public function handle(): int
    {
        $dir = storage_path('backups');

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $host     = config('database.connections.mysql.host');
        $port     = config('database.connections.mysql.port', 3306);
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');

        $arquivo = $dir . '/' . $database . '_' . now()->format('Y-m-d_His') . '.sql.gz';

        $cmd = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s %s | gzip > %s',
            escapeshellarg($host),
            escapeshellarg((string) $port),
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($database),
            escapeshellarg($arquivo),
        );

        exec($cmd, $output, $codigo);

        if ($codigo !== 0) {
            $this->error('Backup falhou. Código: ' . $codigo);
            return self::FAILURE;
        }

        $this->info('Backup salvo em: ' . $arquivo);

        $this->purgarAntigos($dir, $database);

        return self::SUCCESS;
    }

    private function purgarAntigos(string $dir, string $database): void
    {
        $arquivos = glob($dir . '/' . $database . '_*.sql.gz');

        if (!$arquivos || count($arquivos) <= 7) {
            return;
        }

        sort($arquivos);

        $remover = array_slice($arquivos, 0, count($arquivos) - 7);

        foreach ($remover as $arquivo) {
            unlink($arquivo);
        }
    }
}
