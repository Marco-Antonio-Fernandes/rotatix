import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const LIMITE_HORAS = 40;

// ── Barra de progresso por empresa ──────────────────────────────────────────
function BarraHoras({ horas }) {
    const pct = Math.min((horas / LIMITE_HORAS) * 100, 100);
    const cor =
        pct >= 100 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
        : pct >= 75 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.35)]'
        : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]';

    return (
        <div>
            <div className="mb-1 flex justify-between text-xs text-zinc-500">
                <span>{horas.toFixed(1)}h usadas</span>
                <span>{Math.max(0, LIMITE_HORAS - horas).toFixed(1)}h disponíveis</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${cor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ── Card de empresa ──────────────────────────────────────────────────────────
function CardEmpresa({ empresa, posicao, proxima }) {
    const concluido = empresa.horas_semanais_acumuladas >= LIMITE_HORAS;

    return (
        <div
            className={`rounded-xl border p-5 transition-colors ${
                proxima
                    ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                    : concluido
                    ? 'border-red-500/20 bg-zinc-900/60 opacity-70'
                    : 'border-zinc-800 bg-zinc-900 hover:border-emerald-500/30'
            }`}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${proxima ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {posicao}
                    </span>
                    <div>
                        <p className="font-semibold text-zinc-100">
                            {empresa.nome_fantasia || empresa.razao_social}
                        </p>
                        {empresa.nome_fantasia && (
                            <p className="text-xs text-zinc-500">{empresa.razao_social}</p>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {proxima && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                            Próxima
                        </span>
                    )}
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            concluido
                                ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                                : 'border border-zinc-700 bg-zinc-800 text-zinc-400'
                        }`}
                    >
                        {concluido ? 'Ciclo concluído' : 'Ativa'}
                    </span>
                    <Link
                        to={`/lancamento-horas/criar?empresa_id=${empresa.id}`}
                        className="rounded-md border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400"
                    >
                        + Horas
                    </Link>
                </div>
            </div>
            <BarraHoras horas={empresa.horas_semanais_acumuladas} />
        </div>
    );
}

// ── Formulário inline de novo segmento ──────────────────────────────────────
function FormNovoSegmento({ onCriado, onCancelar }) {
    const [nome, setNome] = useState('');
    const [salvando, setSalvando] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    async function salvar(e) {
        e.preventDefault();
        if (!nome.trim()) return;
        setSalvando(true);
        const { data } = await axios.post('/api/segmentos', { nome: nome.trim() });
        setSalvando(false);
        onCriado(data);
    }

    return (
        <form onSubmit={salvar} className="flex items-center gap-2">
            <input
                ref={inputRef}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do segmento…"
                className="w-44 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
                type="submit"
                disabled={salvando}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
                {salvando ? '…' : 'Criar'}
            </button>
            <button
                type="button"
                onClick={onCancelar}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300"
            >
                ✕
            </button>
        </form>
    );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function RotacaoIndex() {
    const [segmentos, setSegmentos] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState(null);
    const [criarSegmento, setCriarSegmento] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        document.title = `Rotação — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
        carregarSegmentos();
    }, []);

    async function carregarSegmentos() {
        setCarregando(true);
        const { data } = await axios.get('/api/segmentos');
        setSegmentos(data);
        setAbaAtiva((prev) => prev ?? data[0]?.id ?? null);
        setCarregando(false);
    }

    function aoSegmentoCriado(segmento) {
        setSegmentos((prev) => [...prev, { ...segmento, empresas: [] }]);
        setAbaAtiva(segmento.id);
        setCriarSegmento(false);
    }

    async function removerSegmento(id) {
        await axios.delete(`/api/segmentos/${id}`);
        setSegmentos((prev) => prev.filter((s) => s.id !== id));
        setAbaAtiva((prev) => {
            if (prev !== id) return prev;
            const restantes = segmentos.filter((s) => s.id !== id);
            return restantes[0]?.id ?? null;
        });
    }

    const segmentoAtivo = segmentos.find((s) => s.id === abaAtiva) ?? null;

    // Separa ativas (< 40h, ordenadas por horas ASC) das concluídas (>= 40h)
    const empresasAtivas = (segmentoAtivo?.empresas ?? []).filter(
        (e) => e.horas_semanais_acumuladas < LIMITE_HORAS,
    );
    const empresasConcluidas = (segmentoAtivo?.empresas ?? []).filter(
        (e) => e.horas_semanais_acumuladas >= LIMITE_HORAS,
    );
    const empresasOrdenadas = [...empresasAtivas, ...empresasConcluidas];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-zinc-100">
                        Rotação de Serviços
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Acompanhe as empresas por segmento e controle o rodízio de 40h
                    </p>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {carregando ? (
                        <div className="flex items-center justify-center py-24 text-zinc-500">
                            Carregando…
                        </div>
                    ) : (
                        <>
                            {/* ── Painel principal ── */}
                            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">

                                {/* Abas */}
                                <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 px-6 pt-4">
                                    {segmentos.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => { setAbaAtiva(s.id); setCriarSegmento(false); }}
                                            className={`rounded-t-md px-4 py-2 text-sm font-medium transition ${
                                                abaAtiva === s.id
                                                    ? 'border border-b-0 border-zinc-700 bg-zinc-800 text-emerald-400'
                                                    : 'text-zinc-400 hover:text-zinc-200'
                                            }`}
                                        >
                                            {s.nome}
                                            {s.empresas?.length > 0 && (
                                                <span className="ml-1.5 rounded-full bg-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400">
                                                    {s.empresas.length}
                                                </span>
                                            )}
                                        </button>
                                    ))}

                                    {/* Botão / form novo segmento */}
                                    <div className="ml-auto pb-1">
                                        {criarSegmento ? (
                                            <FormNovoSegmento
                                                onCriado={aoSegmentoCriado}
                                                onCancelar={() => setCriarSegmento(false)}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setCriarSegmento(true)}
                                                className="rounded-md px-3 py-1.5 text-sm text-zinc-500 transition hover:text-emerald-400"
                                            >
                                                + Segmento
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Conteúdo da aba ativa */}
                                <div className="p-6">
                                    {segmentos.length === 0 ? (
                                        <div className="py-16 text-center">
                                            <p className="text-zinc-400">Nenhum segmento cadastrado.</p>
                                            <p className="mt-1 text-sm text-zinc-600">
                                                Clique em "+ Segmento" para começar.
                                            </p>
                                        </div>
                                    ) : !segmentoAtivo ? null : empresasOrdenadas.length === 0 ? (
                                        <div className="py-16 text-center">
                                            <p className="text-zinc-400">
                                                Nenhuma empresa associada a este segmento.
                                            </p>
                                            <p className="mt-1 text-sm text-zinc-600">
                                                Vá em Empresas → Nova Empresa e selecione o segmento "{segmentoAtivo.nome}".
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Estatísticas rápidas */}
                                            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 transition-colors hover:border-emerald-500/20">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                        Empresas no segmento
                                                    </p>
                                                    <p className="mt-1 text-2xl font-semibold text-zinc-100">
                                                        {empresasOrdenadas.length}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 transition-colors hover:border-emerald-500/20">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                        Ativas no rodízio
                                                    </p>
                                                    <p className="mt-1 text-2xl font-semibold text-emerald-400">
                                                        {empresasAtivas.length}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 transition-colors hover:border-emerald-500/20">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                        Ciclo concluído
                                                    </p>
                                                    <p className="mt-1 text-2xl font-semibold text-red-400">
                                                        {empresasConcluidas.length}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Lista de empresas */}
                                            <div className="space-y-3">
                                                {empresasOrdenadas.map((emp, idx) => (
                                                    <CardEmpresa
                                                        key={emp.id}
                                                        empresa={emp}
                                                        posicao={idx + 1}
                                                        proxima={idx === 0 && emp.horas_semanais_acumuladas < LIMITE_HORAS}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Rodapé do painel — remover segmento */}
                                {segmentoAtivo && (
                                    <div className="flex justify-end border-t border-zinc-800 px-6 py-3">
                                        <button
                                            type="button"
                                            onClick={() => removerSegmento(segmentoAtivo.id)}
                                            className="text-xs text-zinc-600 transition hover:text-red-400"
                                        >
                                            Remover segmento "{segmentoAtivo.nome}"
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
