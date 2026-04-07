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

export default function UsuariosCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        papel: 'usuario',
    });
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    function set(campo) {
        return (e) => setForm((p) => ({ ...p, [campo]: e.target.value }));
    }

    async function salvar(e) {
        e.preventDefault();
        setSalvando(true);
        setErros({});
        try {
            await axios.post('/api/usuarios', form);
            navigate('/usuarios');
        } catch (err) {
            if (err.response?.data?.errors) setErros(err.response.data.errors);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-zinc-100">Novo Usuário</h2>}
        >
            <div className="py-10">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <form onSubmit={salvar} className="space-y-4">
                            <Campo label="Nome *" erro={erros.name?.[0]}>
                                <input value={form.name} onChange={set('name')} className={inputCls} autoFocus required />
                            </Campo>
                            <Campo label="E-mail *" erro={erros.email?.[0]}>
                                <input type="email" value={form.email} onChange={set('email')} className={inputCls} required />
                            </Campo>
                            <Campo label="Papel" erro={erros.papel?.[0]}>
                                <select value={form.papel} onChange={set('papel')} className={inputCls}>
                                    <option value="usuario">Usuário</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </Campo>
                            <Campo label="Senha *" erro={erros.password?.[0]}>
                                <input type="password" value={form.password} onChange={set('password')} className={inputCls} required />
                            </Campo>
                            <Campo label="Confirmar Senha *" erro={erros.password_confirmation?.[0]}>
                                <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} className={inputCls} required />
                            </Campo>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/usuarios')}
                                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando…' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
