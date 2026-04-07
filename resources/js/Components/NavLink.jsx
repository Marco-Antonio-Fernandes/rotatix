import { NavLink as RouterNavLink } from 'react-router-dom';

export default function NavLink({ to, end = false, className = '', children }) {
    return (
        <RouterNavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (isActive
                    ? 'border-emerald-500 text-emerald-400 focus:border-emerald-400'
                    : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 focus:border-zinc-600 focus:text-zinc-200') +
                className
            }
        >
            {children}
        </RouterNavLink>
    );
}
