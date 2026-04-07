import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit() {
    const { user } = useAuth();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        document.title = `Perfil — ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`;
    }, []);

    const mustVerifyEmail = Boolean(
        user && !user.email_verified_at,
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-zinc-100">
                    Perfil
                </h2>
            }
        >
            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            onStatus={setStatus}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
