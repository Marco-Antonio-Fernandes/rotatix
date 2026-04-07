import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inputCls =
    'w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none';

function Campo({ label, children, erro }) {
    return (
        <div>
            <label className="mb-1 block text-sm text-zinc-400">{label}</label>
            {children}
            {erro && <p className="mt-1 text-xs text-red-400">{erro}</p>}
        </div>
    );
}

export default function ServicosCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', descricao: '' });
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            await axios.post('/api/servicos', form);
            navigate('/servicos');
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Novo Serviço</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            <Campo label="Nome *" erro={erros.nome?.[0]}>
                                <input
                                    value={form.nome}
                                    onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                                    className={inputCls}
                                    autoFocus
                                    required
                                />
                            </Campo>
                            <Campo label="Descrição" erro={erros.descricao?.[0]}>
                                <textarea
                                    value={form.descricao}
                                    onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                                    className={inputCls}
                                    rows={3}
                                />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/servicos')}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando…' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
