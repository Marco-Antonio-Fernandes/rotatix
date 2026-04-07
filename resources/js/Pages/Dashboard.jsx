import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';

const LIMITE_HORAS = 40;

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

    useEffect(() => {
        document.title = `Início — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
        axios.get('/api/segmentos').then(({ data }) => {
            setSegmentos(data);
            setCarregando(false);
        });
    }, []);

    // Todas as empresas de todos os segmentos
    const todasEmpresas = segmentos.flatMap((s) =>
        (s.empresas ?? []).map((e) => ({ ...e, segmento_nome: s.nome })),
    );

    const ativas = todasEmpresas.filter((e) => e.horas_semanais_acumuladas < LIMITE_HORAS);
    const concluidas = todasEmpresas.filter((e) => e.horas_semanais_acumuladas >= LIMITE_HORAS);

    // Próxima na fila = empresa ativa com menos horas
    const proximaNaFila =
        ativas.length > 0
            ? ativas.reduce((min, e) =>
                  e.horas_semanais_acumuladas < min.horas_semanais_acumuladas ? e : min,
              )
            : null;

    // Fila global: ativas (ASC por horas) + concluídas ao final
    const filaGlobal = [
        ...ativas.sort((a, b) => a.horas_semanais_acumuladas - b.horas_semanais_acumuladas),
        ...concluidas.sort((a, b) => a.horas_semanais_acumuladas - b.horas_semanais_acumuladas),
    ];

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
                            {/* ── Stat cards ── */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                {/* Próxima na fila */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                        Próxima na fila
                                    </p>
                                    {proximaNaFila ? (
                                        <>
                                            <p className="mt-2 text-lg font-semibold leading-snug text-zinc-100">
                                                {proximaNaFila.nome_fantasia || proximaNaFila.razao_social}
                                            </p>
                                            <span className="mt-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                                {proximaNaFila.segmento_nome}
                                            </span>
                                            <BarraHoras horas={proximaNaFila.horas_semanais_acumuladas} />
                                        </>
                                    ) : (
                                        <p className="mt-2 text-sm text-zinc-500">
                                            {todasEmpresas.length === 0
                                                ? 'Nenhuma empresa cadastrada.'
                                                : 'Todas concluíram o ciclo.'}
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

                            {/* ── Fila global do rodízio ── */}
                            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                                <div className="border-b border-zinc-800 px-6 py-4">
                                    <h3 className="text-sm font-semibold text-zinc-200">
                                        Fila do rodízio
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Todas as empresas ordenadas por posição na fila
                                    </p>
                                </div>

                                {filaGlobal.length === 0 ? (
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
                                    <>
                                        {/* Tabela em telas maiores */}
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
                                                            Segmento
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
                                                    {filaGlobal.map((emp, idx) => {
                                                        const concluido =
                                                            emp.horas_semanais_acumuladas >= LIMITE_HORAS;
                                                        const pct = Math.min(
                                                            (emp.horas_semanais_acumuladas / LIMITE_HORAS) * 100,
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
                                                                        {emp.nome_fantasia || emp.razao_social}
                                                                    </p>
                                                                    {emp.nome_fantasia && (
                                                                        <p className="text-xs text-zinc-500">
                                                                            {emp.razao_social}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-zinc-400">
                                                                    {emp.segmento_nome}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="min-w-[120px]">
                                                                        <div className="mb-1 text-xs font-mono text-zinc-300">
                                                                            {emp.horas_semanais_acumuladas.toFixed(1)}h / {LIMITE_HORAS}h
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
                                                                                style={{ width: `${pct}%` }}
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
                                                                        {concluido ? 'Concluído' : 'Ativa'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Cards em mobile */}
                                        <ul className="divide-y divide-zinc-800 sm:hidden">
                                            {filaGlobal.map((emp, idx) => {
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
                                                                        {emp.nome_fantasia || emp.razao_social}
                                                                    </p>
                                                                    <p className="text-xs text-zinc-500">
                                                                        {emp.segmento_nome}
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
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
