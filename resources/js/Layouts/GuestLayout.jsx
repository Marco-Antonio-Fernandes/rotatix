import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from 'react-router-dom';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(16,185,129,0.22),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.12),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.08),transparent_40%)]" />

            <div className="relative z-10 flex flex-col items-center">
                <Link
                    to="/"
                    className="group flex flex-col items-center gap-3 outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                    <ApplicationLogo className="h-16 w-16 text-emerald-400 transition-colors group-hover:text-emerald-300" />
                    <span className="text-lg font-semibold tracking-tight text-slate-100">
                        Rotatix
                    </span>
                </Link>
            </div>

            <div className="relative z-10 mt-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/75 px-7 py-8 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl ring-1 ring-white/5">
                {children}
            </div>
        </div>
    );
}
