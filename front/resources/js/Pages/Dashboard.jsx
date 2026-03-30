import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const horasSemanaMock = 32;
const limiteHoras = 40;
const percentualHoras = Math.min(
    100,
    Math.round((horasSemanaMock / limiteHoras) * 100),
);

const atividadesRecentesMock = [
    {
        id: 1,
        titulo: 'Limpeza Urbana LTDA entrou no rodízio',
        detalhe: 'Sequência atualizada · há 2 h',
    },
    {
        id: 2,
        titulo: 'Horas da semana ajustadas — Manutenção Verdes',
        detalhe: '32 h registradas · há 5 h',
    },
    {
        id: 3,
        titulo: 'Ciclo concluído — todas as empresas atendidas',
        detalhe: 'Novo ciclo iniciado · ontem',
    },
    {
        id: 4,
        titulo: 'Recicla Tudo — abaixo do limite de 40 h',
        detalhe: '15 h na semana · há 2 dias',
    },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-zinc-100">
                        Início
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Visão geral do rodízio e da carga horária semanal
                    </p>
                </div>
            }
        >
            <Head title="Início" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Empresa em foco
                            </p>
                            <p className="mt-2 text-lg font-semibold text-zinc-100">
                                Limpeza Urbana LTDA
                            </p>
                            <span className="mt-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                Ativa no rodízio
                            </span>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Horas da semana (agregado)
                            </p>
                            <p className="mt-2 font-mono text-2xl font-semibold text-emerald-400">
                                {horasSemanaMock} h
                                <span className="text-base font-normal text-zinc-500">
                                    {' '}
                                    / {limiteHoras} h
                                </span>
                            </p>
                            <div className="mt-4">
                                <div className="mb-1 flex justify-between text-xs text-zinc-500">
                                    <span>Uso do limite semanal</span>
                                    <span>{percentualHoras}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                                        style={{ width: `${percentualHoras}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-emerald-500/30">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Ciclo atual
                            </p>
                            <p className="mt-2 text-lg font-semibold text-zinc-100">
                                3 empresas no ciclo
                            </p>
                            <p className="mt-2 text-sm text-zinc-500">
                                Próxima após todas serem utilizadas neste ciclo.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 sm:rounded-xl">
                        <div className="border-b border-zinc-800 px-6 py-4">
                            <h3 className="text-sm font-semibold text-zinc-200">
                                Atividades recentes
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Dados de exemplo — conecte ao backend quando o
                                endpoint estiver definido
                            </p>
                        </div>
                        <ul className="divide-y divide-zinc-800">
                            {atividadesRecentesMock.map((item) => (
                                <li
                                    key={item.id}
                                    className="px-6 py-4 transition-colors hover:bg-zinc-800/40"
                                >
                                    <p className="text-sm font-medium text-zinc-200">
                                        {item.titulo}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {item.detalhe}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
