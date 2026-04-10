import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { compararFila } from '@/utils/chaveFila';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LIMITE_HORAS = 40;

function ConsultaServico({ segmentos, onAtualizarSegmentos }) {
    const [segmentoSelecionado, setSegmentoSelecionado] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [pulando, setPulando] = useState(false);
    const [modalIndisp, setModalIndisp] = useState(false);
    const [textoIndisp, setTextoIndisp] = useState('');
    const [erroIndisp, setErroIndisp] = useState('');

    function selecionar(seg) {
        if (segmentoSelecionado?.id === seg.id) {
            setSegmentoSelecionado(null);
            setEmpresa(null);
            return;
        }
        const ativas = (seg.empresas ?? []).filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
        const ordenadas = [...ativas].sort(compararFila);
        const proxima = ordenadas[0] ?? null;
        setSegmentoSelecionado(seg);
        setEmpresa(proxima);
    }

    async function confirmarIndisponivel() {
        if (!segmentoSelecionado || !empresa) return;
        const j = textoIndisp.trim();
        if (j.length < 3) {
            setErroIndisp('Mínimo 3 caracteres.');
            return;
        }
        setErroIndisp('');
        setPulando(true);
        try {
            const { data } = await axios.post(`/api/segmentos/${segmentoSelecionado.id}/indisponivel`, {
                justificativa: j,
            });
            await onAtualizarSegmentos?.();
            setEmpresa(data.proxima ?? null);
            setModalIndisp(false);
            setTextoIndisp('');
        } finally {
            setPulando(false);
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4">
                <h3 className="text-sm font-semibold text-zinc-200">Consultar por Segmento</h3>
                <p className="text-xs text-zinc-500">Selecione o segmento para ver a empresa no topo da rotação</p>
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-2">
                    {segmentos.map((seg) => (
                        <button
                            key={seg.id}
                            type="button"
                            onClick={() => selecionar(seg)}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                                segmentoSelecionado?.id === seg.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400'
                            }`}
                        >
                            {seg.nome}
                        </button>
                    ))}
                </div>

                {segmentoSelecionado && (
                    <div className="mt-6">
                        {empresa ? (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                            Próxima — {segmentoSelecionado.nome}
                                        </p>
                                        <p className="mt-1 text-lg font-semibold text-zinc-100">
                                            {empresa.nome_fantasia || empresa.razao_social}
                                        </p>
                                        {empresa.nome_fantasia && (
                                            <p className="text-xs text-zinc-500">{empresa.razao_social}</p>
                                        )}
                                        <p className="mt-2 text-sm text-zinc-400">
                                            {empresa.horas_semanais_acumuladas.toFixed(1)}h acumuladas
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTextoIndisp('');
                                            setErroIndisp('');
                                            setModalIndisp(true);
                                        }}
                                        disabled={pulando}
                                        className="shrink-0 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                                    >
                                        Indisponível
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 text-center text-sm text-zinc-500">
                                Nenhuma empresa ativa em "{segmentoSelecionado.nome}".
                            </div>
                        )}
                    </div>
                )}
            </div>

            {modalIndisp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
                        <h4 className="text-sm font-semibold text-zinc-100">Indisponível — observação</h4>
                        <textarea
                            value={textoIndisp}
                            onChange={(e) => setTextoIndisp(e.target.value)}
                            className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                            rows={4}
                            placeholder="Por que não pode atender?"
                        />
                        {erroIndisp && <p className="mt-2 text-xs text-red-400">{erroIndisp}</p>}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setModalIndisp(false)}
                                className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={pulando}
                                onClick={confirmarIndisponivel}
                                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                            >
                                {pulando ? '…' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ordenarFilaSegmento(empresas) {
    const ativas = empresas.filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
    const concluidas = empresas.filter((e) => e.horas_semanais_acumuladas >= LIMITE_HORAS);
    return [
        ...ativas.sort(compararFila),
        ...concluidas.sort(compararFila),
    ];
}

function BarraHoras({ horas }) {
    const pct = Math.min((horas / LIMITE_HORAS) * 100, 100);
    const cor =
        pct >= 100
            ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
            : pct >= 75
              ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.35)]'
              : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]';

    return (
        <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-zinc-500">
                <span>Uso do limite semanal</span>
                <span>{pct.toFixed(0)}%</span>
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

export default function Dashboard() {
    const [segmentos, setSegmentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [indiceProximaSegmento, setIndiceProximaSegmento] = useState(0);

    async function recarregarSegmentos() {
        const { data } = await axios.get('/api/segmentos');
        setSegmentos(data);
    }

    useEffect(() => {
        document.title = `Início — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
        recarregarSegmentos().finally(() => setCarregando(false));
    }, []);

    const todasEmpresas = segmentos.flatMap((s) =>
        (s.empresas ?? []).map((e) => ({ ...e, segmento_nome: s.nome })),
    );

    const ativas = todasEmpresas.filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
    const concluidas = todasEmpresas.filter((e) => e.horas_semanais_acumuladas >= LIMITE_HORAS);

    const proximasPorSegmento = useMemo(
        () =>
            segmentos
                .map((seg) => {
                    const ativasSeg = (seg.empresas ?? []).filter(
                        (e) => e.horas_semanais_acumuladas < LIMITE_HORAS,
                    );
                    if (ativasSeg.length === 0) return null;
                    const empresa = [...ativasSeg].sort(compararFila)[0];
                    return { seg, empresa };
                })
                .filter(Boolean),
        [segmentos],
    );

    useEffect(() => {
        setIndiceProximaSegmento((prev) => {
            if (proximasPorSegmento.length === 0) return 0;
            return Math.min(prev, proximasPorSegmento.length - 1);
        });
    }, [proximasPorSegmento]);

    const itemProximaFila = proximasPorSegmento[indiceProximaSegmento] ?? null;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-zinc-100">Início</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Visão geral do rodízio e da carga horária semanal
                    </p>
                </div>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {carregando ? (
                        <div className="flex items-center justify-center py-24 text-zinc-500">
                            Carregando…
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-zinc-400">
                                    Registre horas por segmento, empresa e serviço.
                                </p>
                                <Link
                                    to="/lancamento-horas/criar"
                                    className="inline-flex shrink-0 items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    Registrar horas
                                </Link>
                            </div>

                            {/* ── Stat cards ── */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                {/* Próxima na fila (uma por segmento) */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            Próxima na fila
                                        </p>
                                        {proximasPorSegmento.length > 1 && itemProximaFila && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    aria-label="Segmento anterior"
                                                    onClick={() =>
                                                        setIndiceProximaSegmento(
                                                            (p) =>
                                                                (p - 1 + proximasPorSegmento.length) %
                                                                proximasPorSegmento.length,
                                                        )
                                                    }
                                                    className="rounded-md border border-zinc-700 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                                                >
                                                    ‹
                                                </button>
                                                <span className="min-w-[2.5rem] text-center text-xs text-zinc-500">
                                                    {indiceProximaSegmento + 1}/{proximasPorSegmento.length}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label="Próximo segmento"
                                                    onClick={() =>
                                                        setIndiceProximaSegmento(
                                                            (p) => (p + 1) % proximasPorSegmento.length,
                                                        )
                                                    }
                                                    className="rounded-md border border-zinc-700 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {itemProximaFila ? (
                                        <>
                                            <p className="mt-2 text-lg font-semibold leading-snug text-zinc-100">
                                                {itemProximaFila.empresa.nome_fantasia ||
                                                    itemProximaFila.empresa.razao_social}
                                            </p>
                                            <span className="mt-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                                {itemProximaFila.seg.nome}
                                            </span>
                                            <BarraHoras
                                                horas={itemProximaFila.empresa.horas_semanais_acumuladas}
                                            />
                                        </>
                                    ) : (
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {todasEmpresas.length === 0
                                                ? 'Nenhuma empresa cadastrada.'
                                                : 'Nenhuma ativa por segmento.'}
                                        </p>
                                    )}
                                </div>

                                {/* Ativas no rodízio */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                        Ativas no rodízio
                                    </p>
                                    <p className="mt-2 font-mono text-3xl font-semibold text-emerald-400">
                                        {ativas.length}
                                        <span className="text-base font-normal text-zinc-500">
                                            {' '}/ {todasEmpresas.length}
                                        </span>
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        {ativas.length === 0
                                            ? 'Nenhuma empresa abaixo de 40h.'
                                            : `${ativas.length} empresa${ativas.length > 1 ? 's' : ''} com menos de 40h`}
                                    </p>
                                </div>

                                {/* Ciclo concluído */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30 sm:col-span-2 lg:col-span-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                        Ciclo concluído
                                    </p>
                                    <p className="mt-2 font-mono text-3xl font-semibold text-red-400">
                                        {concluidas.length}
                                        <span className="text-base font-normal text-zinc-500">
                                            {' '}/ {todasEmpresas.length}
                                        </span>
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        {concluidas.length === 0
                                            ? 'Nenhuma empresa atingiu 40h.'
                                            : `${concluidas.length} empresa${concluidas.length > 1 ? 's' : ''} atingiram 40h`}
                                    </p>
                                </div>
                            </div>

                            {/* ── Consulta por segmento ── */}
                            {segmentos.length > 0 && (
                                <ConsultaServico segmentos={segmentos} onAtualizarSegmentos={recarregarSegmentos} />
                            )}

                            {/* ── Filas por segmento ── */}
                            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                                <div className="border-b border-zinc-800 px-6 py-4">
                                    <h3 className="text-sm font-semibold text-zinc-200">
                                        Fila do rodízio
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Até {LIMITE_HORAS}h por empresa no período; fila por serviço (registrou → fim); com {LIMITE_HORAS}h fora da vez até reset em Relatórios
                                    </p>
                                </div>

                                {segmentos.length === 0 || todasEmpresas.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-zinc-500">
                                        Nenhuma empresa cadastrada.{' '}
                                        <a
                                            href="/empresas"
                                            className="text-emerald-400 hover:underline"
                                        >
                                            Cadastre uma empresa
                                        </a>{' '}
                                        para começar.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-800">
                                        {segmentos.map((seg) => {
                                            const filaSeg = ordenarFilaSegmento(
                                                (seg.empresas ?? []).map((e) => ({
                                                    ...e,
                                                    segmento_nome: seg.nome,
                                                })),
                                            );
                                            if (filaSeg.length === 0) {
                                                return (
                                                    <div key={seg.id} className="px-6 py-6">
                                                        <h4 className="text-sm font-semibold text-zinc-300">
                                                            {seg.nome}
                                                        </h4>
                                                        <p className="mt-1 text-sm text-zinc-500">
                                                            Nenhuma empresa neste segmento.
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={seg.id}>
                                                    <div className="bg-zinc-800/40 px-6 py-2">
                                                        <h4 className="text-sm font-semibold text-emerald-400/90">
                                                            {seg.nome}
                                                        </h4>
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <table className="min-w-full border-collapse">
                                                            <thead className="bg-zinc-800/60">
                                                                <tr>
                                                                    <th className="w-10 px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                                                                        #
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                                                                        Empresa
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                                                                        Horas
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                                                                        Status
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-zinc-800">
                                                                {filaSeg.map((emp, idx) => {
                                                                    const concluido =
                                                                        emp.horas_semanais_acumuladas >=
                                                                        LIMITE_HORAS;
                                                                    const pct = Math.min(
                                                                        (emp.horas_semanais_acumuladas /
                                                                            LIMITE_HORAS) *
                                                                            100,
                                                                        100,
                                                                    );
                                                                    return (
                                                                        <tr
                                                                            key={emp.id}
                                                                            className={`transition-colors hover:bg-zinc-800/30 ${concluido ? 'opacity-60' : ''}`}
                                                                        >
                                                                            <td className="px-6 py-4 text-sm font-mono text-zinc-500">
                                                                                {idx + 1}
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <p className="font-medium text-zinc-100">
                                                                                    {emp.nome_fantasia ||
                                                                                        emp.razao_social}
                                                                                </p>
                                                                                {emp.nome_fantasia && (
                                                                                    <p className="text-xs text-zinc-500">
                                                                                        {emp.razao_social}
                                                                                    </p>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <div className="min-w-[120px]">
                                                                                    <div className="mb-1 text-xs font-mono text-zinc-300">
                                                                                        {emp.horas_semanais_acumuladas.toFixed(
                                                                                            1,
                                                                                        )}
                                                                                        h / {LIMITE_HORAS}h
                                                                                    </div>
                                                                                    <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                                                                                        <div
                                                                                            className={`h-full rounded-full ${
                                                                                                concluido
                                                                                                    ? 'bg-red-500'
                                                                                                    : pct >= 75
                                                                                                      ? 'bg-yellow-400'
                                                                                                      : 'bg-emerald-500'
                                                                                            }`}
                                                                                            style={{
                                                                                                width: `${pct}%`,
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4">
                                                                                <span
                                                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                                        concluido
                                                                                            ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                                                                                            : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                                                    }`}
                                                                                >
                                                                                    {concluido
                                                                                        ? 'Concluído'
                                                                                        : 'Ativa'}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <ul className="divide-y divide-zinc-800 sm:hidden">
                                                        {filaSeg.map((emp, idx) => {
                                                            const concluido =
                                                                emp.horas_semanais_acumuladas >= LIMITE_HORAS;
                                                            return (
                                                                <li
                                                                    key={emp.id}
                                                                    className={`px-4 py-4 transition-colors hover:bg-zinc-800/30 ${concluido ? 'opacity-60' : ''}`}
                                                                >
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                                                                                {idx + 1}
                                                                            </span>
                                                                            <div>
                                                                                <p className="font-medium text-zinc-100">
                                                                                    {emp.nome_fantasia ||
                                                                                        emp.razao_social}
                                                                                </p>
                                                                                <p className="text-xs text-zinc-500">
                                                                                    {seg.nome}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <span
                                                                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                                concluido
                                                                                    ? 'bg-red-500/10 text-red-400'
                                                                                    : 'bg-emerald-500/10 text-emerald-400'
                                                                            }`}
                                                                        >
                                                                            {emp.horas_semanais_acumuladas.toFixed(1)}h
                                                                        </span>
                                                                    </div>
                                                                    <div className="mt-3 pl-9">
                                                                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                                                                            <div
                                                                                className={`h-full rounded-full ${concluido ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                                                style={{
                                                                                    width: `${Math.min((emp.horas_semanais_acumuladas / LIMITE_HORAS) * 100, 100)}%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            );
                                        })}
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
