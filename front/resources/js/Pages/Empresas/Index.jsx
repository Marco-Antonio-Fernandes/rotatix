import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';

export default function Index() {
    const empresas = [
        {
            id: 1,
            nome: 'Limpeza Urbana LTDA',
            cnpj: '12.345.678/0001-90',
            horas_semanais: 32,
        },
        {
            id: 2,
            nome: 'Manutenção Verdes',
            cnpj: '98.765.432/0001-10',
            horas_semanais: 40,
        },
        {
            id: 3,
            nome: 'Recicla Tudo',
            cnpj: '11.222.333/0001-44',
            horas_semanais: 15,
        },
    ];

    useEffect(() => {
        document.title = `Empresas — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-zinc-100">
                    Gestão de Empresas (Rodízio)
                </h2>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
                        <div className="p-6 text-zinc-100">
                            <div className="mb-6 flex justify-between">
                                <h3 className="text-lg font-medium">
                                    Empresas Cadastradas
                                </h3>
                                <button
                                    type="button"
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
                                >
                                    Nova Empresa
                                </button>
                            </div>

                            <table className="min-w-full border-collapse">
                                <thead className="bg-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                            Nome
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                            CNPJ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-400">
                                            Status (40h)
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-zinc-400">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                    {empresas.map((empresa) => (
                                        <tr key={empresa.id}>
                                            <td className="px-6 py-4">{empresa.nome}</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">
                                                {empresa.cnpj}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                                                        empresa.horas_semanais >=
                                                        40
                                                            ? 'bg-red-500/15 text-red-400'
                                                            : 'bg-emerald-500/15 text-emerald-400'
                                                    }`}
                                                >
                                                    {empresa.horas_semanais}h /
                                                    40h
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <button
                                                    type="button"
                                                    className="text-emerald-400 hover:text-emerald-300"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
