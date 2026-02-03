
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  FileText,
  HelpCircle,
  LayoutGrid,
  Mail
} from 'lucide-react';
import { getAppState, logoutUser } from './store';
import { AppState, User, Language } from './types';
import { translations } from './translations';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar: React.FC<{ user: User | null; onLogout: () => void; t: any }> = ({ user, onLogout, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  return (
    <nav className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              <Gamepad2 className="w-8 h-8 text-indigo-400" />
              <span className="hidden sm:inline font-space tracking-tight">FORGEARCADE</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.browse}</Link>
                <Link to="/howto" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/howto' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.howTo}</Link>
                {!user && (
                   <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/contact' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.contact}</Link>
                )}
                {user && (
                  <>
                    <Link to="/create" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/create' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.create}</Link>
                    <Link to="/my-games" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/my-games' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.myGames}</Link>
                    <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/dashboard' ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>{t.nav.dashboard}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 transition-all">
                    <UserIcon className="w-4 h-4" />
                    {user.username}
                  </Link>
                  <Link to="/settings" className="p-2 text-gray-400 hover:text-white transition-transform hover:rotate-45">
                    <SettingsIcon className="w-5 h-5" />
                  </Link>
                  <button onClick={onLogout} className="p-2 text-red-400 hover:text-red-300 transition-all hover:scale-110">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40">
                  {t.nav.login}
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 pb-3 px-2 pt-2 space-y-1 animate-in slide-in-from-top duration-200">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.browse}</Link>
          <Link to="/howto" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.howTo}</Link>
          {!user && (
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.contact}</Link>
          )}
          {user ? (
            <>
              <Link to="/create" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.create}</Link>
              <Link to="/my-games" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.myGames}</Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.dashboard}</Link>
              <Link to={`/profile/${user.username}`} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Profile</Link>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">{t.nav.settings}</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800">{t.nav.logout}</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:bg-slate-800">{t.nav.login}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

// Pages
import Home from './pages/Home';
import Play from './pages/Play';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HowTo from './pages/HowTo';
import MyGames from './pages/MyGames';
import EditGame from './pages/EditGame';
import GenrePage from './pages/GenrePage';
import Contact from './pages/Contact';

export default function App() {
  const [state, setState] = useState<AppState>(getAppState());

  const handleLogout = () => {
    logoutUser();
    setState(getAppState());
    window.location.hash = '/';
  };

  const refreshState = () => {
    setState(getAppState());
  };

  const currentLang = state.language || 'en';
  const t = translations[currentLang] || translations.en;

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar user={state.currentUser} onLogout={handleLogout} t={t} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home games={state.games} user={state.currentUser} t={t} />} />
            <Route path="/howto" element={<HowTo />} />
            <Route path="/contact" element={!state.currentUser ? <Contact t={t} /> : <Navigate to="/settings" />} />
            <Route path="/genre/:genreName" element={<GenrePage games={state.games} />} />
            <Route path="/play/:id" element={<Play games={state.games} currentUser={state.currentUser} onReaction={refreshState} t={t} />} />
            <Route path="/login" element={<Login onLogin={refreshState} t={t} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile/:username" element={<Profile games={state.games} allUsers={state.allUsers} />} />
            
            {/* Protected Routes */}
            <Route path="/create" element={
              state.currentUser ? <Create user={state.currentUser} onPublish={refreshState} t={t} /> : <Navigate to="/login" />
            } />
            <Route path="/edit/:id" element={
              state.currentUser ? <EditGame user={state.currentUser} games={state.games} onUpdate={refreshState} t={t} /> : <Navigate to="/login" />
            } />
            <Route path="/my-games" element={
              state.currentUser ? <MyGames user={state.currentUser} games={state.games} onUpdate={refreshState} /> : <Navigate to="/login" />
            } />
            <Route path="/dashboard" element={
              state.currentUser ? <Dashboard user={state.currentUser} games={state.games} onUpdate={refreshState} t={t} /> : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              state.currentUser ? <Settings user={state.currentUser} onUpdate={refreshState} onLogout={handleLogout} t={t} currentLang={currentLang} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
        
        <footer className="bg-slate-900/80 backdrop-blur-sm py-10 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-white font-space font-bold text-lg mb-1 tracking-wider uppercase">ForgeArcade AI</p>
                <p className="text-gray-500 text-sm">Built with love.</p>
              </div>
              <div className="flex gap-8 text-sm text-gray-400">
                <Link to="/terms" className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors"><FileText className="w-4 h-4" /> Terms</Link>
                <Link to="/privacy" className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors"><ShieldCheck className="w-4 h-4" /> Privacy</Link>
                <Link to="/howto" className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors"><HelpCircle className="w-4 h-4" /> Guide</Link>
                {!state.currentUser && <Link to="/contact" className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors"><Mail className="w-4 h-4" /> Contact</Link>}
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-gray-600 text-[11px] tracking-widest uppercase">
              &copy; {new Date().getFullYear()} FORGEARCADE DIGITAL. ALL SYSTEMS NOMINAL.
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
