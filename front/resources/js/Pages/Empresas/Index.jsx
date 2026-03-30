import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth }) {
    // Dados simulados (Mock) - Depois buscaremos do Java
    const empresas = [
        { id: 1, nome: 'Limpeza Urbana LTDA', cnpj: '12.345.678/0001-90', horas_semanais: 32 },
        { id: 2, nome: 'Manutenção Verdes', cnpj: '98.765.432/0001-10', horas_semanais: 40 },
        { id: 3, nome: 'Recicla Tudo', cnpj: '11.222.333/0001-44', horas_semanais: 15 },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão de Empresas (Rodízio)</h2>}
        >
            <Head title="Empresas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-lg font-medium">Empresas Cadastradas</h3>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                    Nova Empresa
                                </button>
                            </div>

                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status (40h)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {empresas.map((empresa) => (
                                        <tr key={empresa.id}>
                                            <td className="px-6 py-4">{empresa.nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{empresa.cnpj}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    empresa.horas_semanais >= 40 
                                                    ? 'bg-red-100 text-red-700' 
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {empresa.horas_semanais}h / 40h
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
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