import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    const { setUser, enterVisitorMode, leaveVisitorMode } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.title = `Entrar — ${import.meta.env.VITE_APP_NAME ?? 'Rotatix'}`;
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.get('/sanctum/csrf-cookie');
            const { data } = await axios.post(route('login'), {
                email,
                password,
                remember,
            });
            leaveVisitorMode();
            setUser(data.user);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setProcessing(false);
        }
    };

    const fieldClass =
        'mt-1 block w-full !rounded-lg !border-slate-600 !bg-slate-800/60 !text-slate-100 !shadow-none placeholder:!text-slate-500 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500/40';

    return (
        <GuestLayout>
            {status && (
                <div className="mb-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-50">
                    Bem-vindo de volta
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Inicie sessão para continuar
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="!text-slate-300"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className={fieldClass}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputError message={errors.email?.[0]} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value="Palavra-passe"
                        className="!text-slate-300"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        className={fieldClass}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputError
                        message={errors.password?.[0]}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="!rounded !border-slate-500 !bg-slate-800 !text-emerald-500 !shadow-none focus:!ring-emerald-500/50"
                        />
                        <span className="ms-2 text-sm text-slate-400">
                            Lembrar-me
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <PrimaryButton
                        disabled={processing}
                        className="w-full justify-center !border-transparent !bg-gradient-to-r !from-emerald-600 !to-teal-600 !px-5 !py-2.5 !text-sm !font-semibold !normal-case !tracking-normal !shadow-lg !shadow-emerald-900/40 transition hover:!from-emerald-500 hover:!to-teal-500 focus:!outline-none focus:!ring-2 focus:!ring-emerald-400 focus:!ring-offset-2 focus:!ring-offset-slate-900 disabled:!opacity-40"
                    >
                        Entrar
                    </PrimaryButton>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={async () => {
                            setProcessing(true);
                            try {
                                await enterVisitorMode();
                                navigate('/');
                            } finally {
                                setProcessing(false);
                            }
                        }}
                        className="w-full rounded-lg border border-slate-600 bg-slate-800/40 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40"
                    >
                        Entrar como visitante
                    </button>
                    <p className="text-center text-xs text-slate-500">
                    
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
