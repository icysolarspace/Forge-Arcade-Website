
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getAppState } from '../store';
import { Rocket, ArrowRight, UserPlus, LogIn, AlertCircle, UserCircle, ChevronRight, History, Loader2 } from 'lucide-react';
import { User } from '../types';

const Login: React.FC<{ onLogin: () => void; t: any }> = ({ onLogin, t }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [localAccounts, setLocalAccounts] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const state = getAppState();
    setLocalAccounts(state.allUsers || []);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(username);
  };

  const handleAction = async (targetUsername: string) => {
    setError('');
    const cleanUsername = targetUsername.trim();
    if (!cleanUsername) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        const user = await registerUser(cleanUsername);
        if (user) {
          onLogin();
          navigate('/');
        } else {
          setError(t.login.taken);
        }
      } else {
        const user = await loginUser(cleanUsername);
        if (user) {
          onLogin();
          navigate('/');
        } else {
          setError(t.login.notFound);
        }
      }
    } catch (err) {
      setError("Connection to global vault failed. Check network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-20 animate-in fade-in duration-700">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600/20 text-indigo-400 mb-6 shadow-inner">
            <Rocket className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black font-space mb-2 tracking-tighter uppercase text-white">
            {mode === 'login' ? t.login.titleLogin : t.login.titleRegister}
          </h1>
          <p className="text-slate-500 font-light">
            {mode === 'login' ? t.login.subLogin : t.login.subRegister}
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex gap-1 bg-slate-950 p-1 rounded-2xl mb-8">
            <button 
              disabled={loading}
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-grow py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LogIn className="w-3.5 h-3.5" /> {t.login.loginMode}
            </button>
            <button 
              disabled={loading}
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-grow py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${mode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <UserPlus className="w-3.5 h-3.5" /> {t.login.registerMode}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.login.usernameLabel}</label>
              <input 
                required
                autoFocus
                disabled={loading}
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-indigo-400 font-space text-lg focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
                placeholder={t.login.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-red-400 uppercase leading-tight tracking-wide">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-indigo-400 font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 group disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authorizing...</>
              ) : (
                <>
                  {mode === 'login' ? t.login.submitLogin : t.login.submitRegister}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-[9px] text-center text-slate-600 uppercase font-black tracking-widest leading-relaxed">
              Global identity protocol active. Your data is synced to the cloud.
            </p>
          </form>
        </div>
      </div>

      {localAccounts.length > 0 && (
        <div className="w-full max-w-xs space-y-6 animate-in slide-in-from-right duration-700">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <History className="w-4 h-4" />
            <h2 className="text-[10px] font-black uppercase tracking-widest">Recent Profiles</h2>
          </div>
          <div className="space-y-3">
            {localAccounts.map(acc => (
              <button 
                key={acc.username}
                disabled={loading}
                onClick={() => {
                  setMode('login');
                  setUsername(acc.username);
                  handleAction(acc.username);
                }}
                className="w-full bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {acc.profilePicture ? (
                    <img src={acc.profilePicture} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-slate-700" />
                  )}
                </div>
                <div className="text-left flex-grow">
                  <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{acc.username}</div>
                  <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Active session</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
