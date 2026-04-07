import PrimaryButton from '@/Components/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        document.title = `Verificar email — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post(route('verification.send'));
            setStatus('verification-link-sent');
        } finally {
            setProcessing(false);
        }
    };

    const sair = async () => {
        await axios.post(route('logout'));
        setUser(null);
        navigate('/login');
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn&apos;t receive the email, we will gladly send
                you another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <button
                        type="button"
                        onClick={sair}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
