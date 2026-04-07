import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    onStatus,
    className = '',
}) {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setRecentlySuccessful(false);

        try {
            const { data } = await axios.patch(route('profile.update'), {
                name,
                email,
            });
            setUser(data.user);
            setRecentlySuccessful(true);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setProcessing(false);
        }
    };

    const resendVerification = async () => {
        await axios.get('/sanctum/csrf-cookie');
        await axios.post(route('verification.send'));
        onStatus?.('verification-link-sent');
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-zinc-100">
                    Informações do perfil
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    Atualize nome e email da conta.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full border-zinc-700 bg-zinc-800 text-zinc-100"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name?.[0]} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-zinc-700 bg-zinc-800 text-zinc-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email?.[0]} />
                </div>

                {mustVerifyEmail && user?.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-zinc-300">
                            O email ainda não foi verificado.
                            <button
                                type="button"
                                onClick={resendVerification}
                                className="ms-1 rounded-md text-sm text-emerald-400 underline hover:text-emerald-300"
                            >
                                Reenviar email de verificação.
                            </button>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-emerald-400">
                                Um novo link foi enviado para o seu email.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-zinc-400">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
