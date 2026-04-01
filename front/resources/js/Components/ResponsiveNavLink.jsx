import { NavLink as RouterNavLink } from 'react-router-dom';

export default function ResponsiveNavLink({
    to,
    end = false,
    className = '',
    children,
}) {
    return (
        <RouterNavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                    isActive
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 focus:border-emerald-400 focus:bg-emerald-950/50 focus:text-emerald-300'
                        : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-100 focus:border-zinc-600 focus:bg-zinc-800/60 focus:text-zinc-100'
                } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`
            }
        >
            {children}
        </RouterNavLink>
    );
}
