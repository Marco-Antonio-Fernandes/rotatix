export function formatarCnpjDigitando(valor) {
    const d = valor.replace(/\D/g, '').slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) {
        return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    }
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function formatarTelefoneBrDigitando(valor) {
    const n = valor.replace(/\D/g, '').slice(0, 11);
    if (!n) return '';
    if (n.length <= 2) return `(${n}`;
    const ddd = n.slice(0, 2);
    const loc = n.slice(2);
    if (loc.length <= 4) return `(${ddd}) ${loc}`;
    if (n.length < 11) return `(${ddd}) ${loc.slice(0, 4)}-${loc.slice(4)}`;
    return `(${ddd}) ${loc.slice(0, 5)}-${loc.slice(5)}`;
}
