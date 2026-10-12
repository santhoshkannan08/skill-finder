import { NavLink, Outlet } from 'react-router-dom';
import { BrainCircuit, ClipboardCheck, LayoutDashboard, LogOut, Map, UserRound } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/skillproof', label: 'SkillProof', icon: BrainCircuit },
  { to: '/profile', label: 'Profile', icon: UserRound }
];

export default function AppLayout() {
  const { user, loading, logout } = useAppContext();
  if (loading) return <div className="min-h-screen bg-slate-50 p-8 text-slate-500">Loading your workspace...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <div className="min-h-screen bg-slate-950 md:flex">
    <aside className="border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-5 flex items-center gap-3 px-2 text-xl font-bold text-slate-900"><span className="rounded-xl bg-blue-600 p-2 text-white"><BrainCircuit size={20} /></span> SkillFinder</div>
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
      <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto pb-1 md:block">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `mb-2 flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18} strokeWidth={1.8} />{label}</NavLink>)}
      </nav>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Learning intelligence hub</p><h1 className="mt-1 text-lg font-semibold text-slate-900">Build skills with direction.</h1></div><div className="flex items-center gap-3"><span className="hidden max-w-48 truncate text-sm text-slate-500 sm:inline">{user.email}</span><button aria-label="Log out" className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900" onClick={() => logout().catch(() => {})}><LogOut size={16} /> <span className="hidden sm:inline">Log out</span></button></div></header>
      <div className="mx-auto max-w-7xl p-5 md:p-8"><Outlet /></div>
    </main>
  </div>;
}
