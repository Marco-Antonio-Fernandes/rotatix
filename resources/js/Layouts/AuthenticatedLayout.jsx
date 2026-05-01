import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthenticatedLayout({ header, children }) {
    const { user, visitorMode, leaveVisitorMode, setUser } = useAuth();
    const navigate = useNavigate();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const isAdmin = user?.perfil === 'admin';

    const sair = async () => {
        if (visitorMode) {
            leaveVisitorMode();
            navigate('/login');
            return;
        }
        await axios.post(route('logout'));
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {visitorMode && (
                <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-100">
                    Modo visitante — só visualização. Para alterar dados, inicie sessão.
                </div>
            )}
            <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link to="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-emerald-500" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink to="/" end>Início</NavLink>
                                <NavLink to="/empresas">Empresas</NavLink>
                                <NavLink to="/impedimentos">Impedimentos</NavLink>
                                {isAdmin && (
                                    <NavLink to="/usuarios">Usuários</NavLink>
                                )}
                                <NavLink to="/relatorios">Relatórios</NavLink>
                                <NavLink to="/ajuda">Ajuda</NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium leading-4 text-zinc-300 transition duration-150 ease-in-out hover:text-emerald-400 focus:outline-none"
                                            >
                                                {visitorMode ? 'Visitante' : user?.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-zinc-900 border border-zinc-800">
                                        {!visitorMode && (
                                            <Dropdown.Link to="/profile">
                                                Perfil
                                            </Dropdown.Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={sair}
                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-zinc-200 transition duration-150 ease-in-out hover:bg-zinc-800 hover:text-emerald-400 focus:bg-zinc-800 focus:outline-none"
                                        >
                                            Sair
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 transition duration-150 ease-in-out hover:bg-zinc-800 hover:text-zinc-200 focus:bg-zinc-800 focus:text-zinc-200 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink to="/" end>Início</ResponsiveNavLink>
                        <ResponsiveNavLink to="/empresas">Empresas</ResponsiveNavLink>
                        <ResponsiveNavLink to="/impedimentos">Impedimentos</ResponsiveNavLink>
                        {isAdmin && (
                            <ResponsiveNavLink to="/usuarios">
                                Usuários
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink to="/relatorios">Relatórios</ResponsiveNavLink>
                        <ResponsiveNavLink to="/ajuda">Ajuda</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-zinc-800 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-zinc-200">
                                {visitorMode ? 'Visitante' : user?.name}
                            </div>
                            {!visitorMode && (
                                <div className="text-sm font-medium text-zinc-500">
                                    {user?.email}
                                </div>
                            )}
                        </div>

                        <div className="mt-3 space-y-1">
                            {!visitorMode && (
                                <ResponsiveNavLink to="/profile">
                                    Perfil
                                </ResponsiveNavLink>
                            )}
                            <button
                                type="button"
                                onClick={sair}
                                className="flex w-full items-start border-l-4 border-transparent py-2 pe-4 ps-3 text-base font-medium text-zinc-400 transition duration-150 ease-in-out hover:border-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-100 focus:border-zinc-600 focus:bg-zinc-800/60 focus:text-zinc-100 focus:outline-none"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-zinc-800 bg-zinc-900/40">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
