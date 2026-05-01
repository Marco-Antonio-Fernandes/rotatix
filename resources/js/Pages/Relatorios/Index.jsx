import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuth } from '@/contexts/AuthContext';
import { exportarCsv } from '@/utils/exportarCsv';
import axios from 'axios';
import { useEffect, useState } from 'react';

const LIMITE_HORAS = 40;

const ABAS = [
    { id: 'prestadores', label: 'Prestadores por Categoria' },
    { id: 'servicos', label: 'Catálogo de Serviços' },
    { id: 'impedimentos', label: 'Impedimentos' },
    { id: 'mensal', label: 'Consolidado Mensal' },
];

function PainelResetSemana() {
    const { visitorMode } = useAuth();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    async function executar() {
        if (
            !window.confirm(
                'Zerar horas semanais (contador 40h) e deslocamentos em todas as empresas? A posição na fila não muda. Exporte os relatórios antes, se precisar do período.',
            )
        ) {
            return;
        }
        setLoading(true);
        setMsg('');
        setErr('');
        try {
            await axios.post('/api/relatorios/resetar-semana');
            setMsg('Contadores da semana zerados.');
        } catch (e) {
            setErr(
                typeof e.response?.data?.message === 'string'
                    ? e.response.data.message
                    : 'Não foi possível resetar.',
            );
        } finally {
            setLoading(false);
        }
    }

    if (visitorMode) {
        return null;
    }

    return (
        <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/5 px-5 py-4">
            <p className="text-sm text-zinc-300">
                Depois de gerar e guardar o relatório da semana, use o reset para começar um novo período: zera o
                contador semanal de horas de <span className="font-medium text-zinc-100">todas</span> as empresas. A
                ordem da fila (posição) não muda.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={loading}
                    onClick={executar}
                    className="rounded-md border border-amber-600/50 bg-amber-600/20 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-600/30 disabled:opacity-50"
                >
                    {loading ? '…' : 'Resetar contadores da semana'}
                </button>
                {msg && <span className="text-sm text-emerald-400">{msg}</span>}
                {err && <span className="text-sm text-red-400">{err}</span>}
            </div>
        </div>
    );
}

// ── Prestadores por Categoria ─────────────────────────────────────────────────
function RelatorioPrestadores() {
    const [segmentos, setSegmentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [segmentoFiltro, setSegmentoFiltro] = useState('');

    useEffect(() => {
        axios.get('/api/segmentos').then(({ data }) => {
            setSegmentos(data);
            setCarregando(false);
        });
    }, []);

    const listaSegmentos =
        segmentoFiltro === '' ? segmentos : segmentos.filter((s) => String(s.id) === segmentoFiltro);

    function exportarExcel() {
        const linhas = [];
        listaSegmentos.forEach((seg) => {
            (seg.empresas ?? []).forEach((emp) => {
                linhas.push([
                    seg.nome,
                    emp.nome_fantasia || emp.razao_social,
                    emp.razao_social ?? '',
                    Number(emp.horas_semanais_acumuladas ?? 0).toFixed(1),
                ]);
            });
        });
        exportarCsv('relatorio_prestadores', ['Segmento', 'Nome', 'Razão social', 'Horas acumuladas'], linhas);
    }

    if (carregando) return <Carregando />;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
                <div>
                    <label className="mb-1 block text-xs text-zinc-500">Segmento</label>
                    <select
                        value={segmentoFiltro}
                        onChange={(e) => setSegmentoFiltro(e.target.value)}
                        className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                    >
                        <option value="">Todos</option>
                        {segmentos.map((s) => (
                            <option key={s.id} value={String(s.id)}>
                                {s.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={exportarExcel}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                    Exportar Excel (CSV)
                </button>
            </div>
            {segmentos.length === 0 ? (
                <Vazio texto="Nenhum segmento cadastrado." />
            ) : (
                listaSegmentos.map((seg) => (
                    <div key={seg.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-semibold text-zinc-100">{seg.nome}</h4>
                            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                                {seg.empresas?.length ?? 0} empresa(s)
                            </span>
                        </div>
                        {!seg.empresas?.length ? (
                            <p className="text-sm text-zinc-600">Nenhuma empresa neste segmento.</p>
                        ) : (
                            <div className="divide-y divide-zinc-800/60">
                                {seg.empresas.map((emp) => {
                                    const pct = Math.min(
                                        ((emp.horas_semanais_acumuladas ?? 0) / LIMITE_HORAS) * 100,
                                        100,
                                    );
                                    const cor =
                                        pct >= 100 ? 'bg-red-500'
                                        : pct >= 75 ? 'bg-yellow-400'
                                        : 'bg-emerald-500';
                                    return (
                                        <div key={emp.id} className="flex items-center justify-between py-2.5">
                                            <span className="text-sm text-zinc-300">
                                                {emp.nome_fantasia || emp.razao_social}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24">
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                                                        <div className={`h-full rounded-full ${cor}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                                <span className="w-14 text-right text-xs text-zinc-500">
                                                    {Number(emp.horas_semanais_acumuladas ?? 0).toFixed(1)}h
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

// ── Catálogo de Serviços Ativos ───────────────────────────────────────────────
function RelatorioServicos() {
    const [servicos, setServicos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        axios.get('/api/servicos').then(({ data }) => {
            setServicos(data);
            setCarregando(false);
        });
    }, []);

    function exportarExcel() {
        const linhas = servicos.map((s) => [
            s.nome,
            s.descricao ?? '',
            s.segmento?.nome ?? '',
            String(s.empresas_count ?? 0),
        ]);
        exportarCsv('relatorio_servicos', ['Serviço', 'Descrição', 'Segmento', 'Empresas vinculadas'], linhas);
    }

    if (carregando) return <Carregando />;

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={exportarExcel}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                    Exportar Excel (CSV)
                </button>
            </div>
        <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="min-w-full border-collapse">
                <thead className="bg-zinc-800/80">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Serviço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Descrição</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">Empresas vinculadas</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                    {servicos.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-10 text-center text-zinc-500">Nenhum serviço cadastrado.</td>
                        </tr>
                    ) : (
                        servicos.map((s) => (
                            <tr key={s.id}>
                                <td className="px-6 py-4 font-medium text-zinc-100">{s.nome}</td>
                                <td className="px-6 py-4 text-sm text-zinc-400">{s.descricao ?? '—'}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                                        {s.empresas_count ?? 0}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
}

// ── Justificativas / Impedimentos ─────────────────────────────────────────────
function RelatorioImpedimentos() {
    const [impedimentos, setImpedimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        axios.get('/api/impedimentos').then(({ data }) => {
            setImpedimentos(data);
            setCarregando(false);
        });
    }, []);

    if (carregando) return <Carregando />;

    function exportarExcel() {
        const linhas = impedimentos.map((imp) => [
            imp.data,
            imp.empresa?.nome_fantasia || imp.empresa?.razao_social || '',
            imp.justificativa ?? '',
        ]);
        exportarCsv('relatorio_impedimentos', ['Data', 'Empresa', 'Justificativa'], linhas);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={exportarExcel}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                    Exportar Excel (CSV)
                </button>
            </div>

            {impedimentos.length === 0 ? (
                <Vazio texto="Nenhum impedimento registrado." />
            ) : (
                <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-zinc-800/80">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Empresa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Descrição</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                            {impedimentos.map((imp) => (
                                <tr key={imp.id}>
                                    <td className="px-6 py-4 text-sm text-zinc-400">{imp.data}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-300">
                                        {imp.empresa?.nome_fantasia || imp.empresa?.razao_social || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-400">{imp.justificativa ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── Consolidado Mensal de Horas ───────────────────────────────────────────────
function RelatorioMensal() {
    const hoje = new Date();
    const [mes, setMes] = useState(String(hoje.getMonth() + 1).padStart(2, '0'));
    const [ano, setAno] = useState(String(hoje.getFullYear()));
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        buscar();
    }, [mes, ano]);

    async function buscar() {
        setCarregando(true);
        const { data } = await axios.get(`/api/lancamento-horas?mes=${mes}&ano=${ano}`);
        setDados(data);
        setCarregando(false);
    }

    const totalHoras = dados.reduce((acc, l) => acc + Number(l.horas ?? 0), 0);

    function exportarExcel() {
        const linhasDet = dados.map((l) => [
            l.data,
            l.empresa?.nome_fantasia || l.empresa?.razao_social || '',
            typeof l.servico === 'string' ? l.servico : l.servico?.nome ?? '',
            String(l.horas ?? ''),
        ]);
        exportarCsv(
            `relatorio_horas_${ano}_${mes}`,
            ['Data', 'Empresa', 'Serviço', 'Horas'],
            linhasDet,
        );
    }

    const porEmpresa = dados.reduce((acc, l) => {
        const nome = l.empresa?.nome_fantasia || l.empresa?.razao_social || `#${l.empresa_id}`;
        acc[nome] = (acc[nome] ?? 0) + Number(l.horas ?? 0);
        return acc;
    }, {});

    const anos = Array.from({ length: 5 }, (_, i) => String(hoje.getFullYear() - i));

    return (
        <div className="space-y-6">
            {/* Filtro */}
            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m, i) => (
                        <option key={m} value={m}>
                            {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <select
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                    {anos.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={exportarExcel}
                    disabled={carregando || dados.length === 0}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                    Exportar Excel (CSV)
                </button>
            </div>

            {carregando ? (
                <Carregando />
            ) : (
                <>
                    {/* Totais */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total de horas</p>
                            <p className="mt-1 text-3xl font-bold text-zinc-100">{totalHoras.toFixed(1)}h</p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Lançamentos</p>
                            <p className="mt-1 text-3xl font-bold text-zinc-100">{dados.length}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Empresas atendidas</p>
                            <p className="mt-1 text-3xl font-bold text-zinc-100">{Object.keys(porEmpresa).length}</p>
                        </div>
                    </div>

                    {/* Por empresa */}
                    {Object.keys(porEmpresa).length > 0 && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900">
                            <div className="border-b border-zinc-800 px-6 py-4">
                                <h4 className="text-sm font-semibold text-zinc-300">Horas por empresa</h4>
                            </div>
                            <div className="divide-y divide-zinc-800">
                                {Object.entries(porEmpresa)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([nome, horas]) => {
                                        const pct = Math.min((horas / totalHoras) * 100, 100);
                                        return (
                                            <div key={nome} className="flex items-center justify-between px-6 py-3">
                                                <span className="text-sm text-zinc-300">{nome}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32">
                                                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                                                            <div
                                                                className="h-full rounded-full bg-emerald-500"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="w-12 text-right text-sm font-medium text-zinc-100">
                                                        {horas.toFixed(1)}h
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Lançamentos detalhados */}
                    {dados.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-zinc-800">
                            <table className="min-w-full border-collapse text-sm">
                                <thead className="bg-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Empresa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">Serviço</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">Horas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                    {dados.map((l) => (
                                        <tr key={l.id}>
                                            <td className="px-6 py-3 text-zinc-400">{l.data}</td>
                                            <td className="px-6 py-3 text-zinc-300">
                                                {l.empresa?.nome_fantasia || l.empresa?.razao_social || '—'}
                                            </td>
                                            <td className="px-6 py-3 text-zinc-400">
                                                {typeof l.servico === 'string' ? l.servico : l.servico?.nome ?? '—'}
                                            </td>
                                            <td className="px-6 py-3 text-right font-medium text-zinc-100">{l.horas}h</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-zinc-800/50">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right text-xs font-semibold uppercase text-zinc-500">
                                            Total
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-zinc-100">{totalHoras.toFixed(1)}h</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}

                    {dados.length === 0 && <Vazio texto="Nenhum lançamento neste período." />}
                </>
            )}
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Carregando() {
    return <p className="py-12 text-center text-zinc-500">Carregando…</p>;
}

function Vazio({ texto }) {
    return <p className="py-12 text-center text-zinc-500">{texto}</p>;
}

// ── Página principal ──────────────────────────────────────────────────────────
const COMPONENTES = {
    prestadores: RelatorioPrestadores,
    servicos: RelatorioServicos,
    impedimentos: RelatorioImpedimentos,
    mensal: RelatorioMensal,
};

export default function RelatoriosIndex() {
    const [aba, setAba] = useState('prestadores');

    useEffect(() => {
        document.title = `Relatórios — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
    }, []);

    const Componente = COMPONENTES[aba];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-zinc-100">Relatórios</h2>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <PainelResetSemana />

                    <div className="mb-6 flex flex-wrap gap-1 border-b border-zinc-800">
                        {ABAS.map((a) => (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => setAba(a.id)}
                                className={`rounded-t-md px-4 py-2 text-sm font-medium transition ${
                                    aba === a.id
                                        ? 'border border-b-0 border-zinc-700 bg-zinc-900 text-emerald-400'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    <Componente />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
