export function compararFila(a, b) {
    const pa = Number(a.posicao_fila) || 0;
    const pb = Number(b.posicao_fila) || 0;
    if (pa !== pb) return pa - pb;
    return (Number(a.id) || 0) - (Number(b.id) || 0);
}
