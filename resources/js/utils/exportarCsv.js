export function exportarCsv(nomeArquivo, cabecalhos, linhas) {
    const sep = ';';
    const esc = (v) => {
        const s = String(v ?? '');
        if (s.includes(sep) || s.includes('"') || s.includes('\n') || s.includes('\r')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };
    const head = cabecalhos.map(esc).join(sep);
    const body = linhas.map((row) => row.map(esc).join(sep)).join('\r\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + head + '\r\n' + body], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${nomeArquivo}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}
