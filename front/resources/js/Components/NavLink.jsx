import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-emerald-500 text-emerald-400 focus:border-emerald-400'
                    : 'border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 focus:border-zinc-600 focus:text-zinc-200') +
                className
            }
        >
            {children}
        </Link>
    );
}
