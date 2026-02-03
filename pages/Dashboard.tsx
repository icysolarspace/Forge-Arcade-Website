
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Heart, Play, Activity, Cpu, Cloud, CloudOff, 
  AlertTriangle, ExternalLink, ShieldAlert, CheckCircle2, Copy,
  ArrowUpCircle, Loader2, RefreshCcw
} from 'lucide-react';
import { User, Game } from '../types';
import { fetchGlobalData, syncLocalToCloud, getAppState } from '../store';

interface DashboardProps {
  user: User;
  games: Game[];
  onUpdate: () => void;
  t: any;
}

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/50 transition-all">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-2xl font-black text-white font-space tracking-tight">{value}</div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, games, onUpdate, t }) => {
  const [dbStatus, setDbStatus] = useState<{ online: boolean, error?: string }>({ online: true });
  const [showSql, setShowSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [localOnlyCount, setLocalOnlyCount] = useState(0);

  const checkSyncStatus = async () => {
    const result = await fetchGlobalData();
    setDbStatus({ online: result.online, error: result.error });
    
    // Check if we have local-only games
    const { data: cloudGames } = await (window as any).supabase.from('games').select('id');
    const cloudIds = new Set((cloudGames || []).map((g: any) => g.id));
    const local = getAppState();
    const unsynced = (local.games || []).filter(g => !cloudIds.has(g.id));
    setLocalOnlyCount(unsynced.length);
  };

  useEffect(() => {
    checkSyncStatus();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncLocalToCloud();
    alert(`Sync Complete: ${result.success} games pushed to cloud.`);
    await checkSyncStatus();
    onUpdate();
    setSyncing(false);
  };

  const userGames = games.filter(g => g.creator.toLowerCase() === user.username.toLowerCase());
  const totalPlays = userGames.reduce((acc, curr) => acc + curr.plays, 0);
  const totalReactions = userGames.reduce((acc: number, curr: Game) => {
    const reactions = curr.reactions || {};
    return acc + Object.values(reactions).reduce((a: number, b: number) => a + b, 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-space text-white uppercase tracking-tighter mb-2">{t.dashboard.title}</h1>
          <p className="text-slate-500 font-light">{t.dashboard.sub}</p>
        </div>
        <button onClick={checkSyncStatus} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Sync Alert for Local Data */}
      {dbStatus.online && localOnlyCount > 0 && (
        <div className="mb-10 p-6 bg-indigo-600/10 border border-indigo-500/30 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-bounce-subtle">
           <div className="flex items-center gap-4 text-center md:text-left">
             <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
               <ArrowUpCircle className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-white font-black uppercase tracking-tight">Unsynced Local Data Detected</h3>
               <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest">You have {localOnlyCount} games saved only in your browser.</p>
             </div>
           </div>
           <button 
             onClick={handleSync}
             disabled={syncing}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 flex items-center gap-3 disabled:opacity-50"
           >
             {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
             Push to Global Cloud
           </button>
        </div>
      )}

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">System Vitality</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Play className="w-5 h-5 text-indigo-400" />} 
            label={t.dashboard.stats.plays} 
            value={totalPlays > 0 ? totalPlays.toLocaleString() : '0'} 
            color="bg-indigo-400/10" 
          />
          <StatCard 
            icon={<Heart className="w-5 h-5 text-purple-400" />} 
            label={t.dashboard.stats.reactions} 
            value={totalReactions > 0 ? totalReactions.toLocaleString() : '0'} 
            color="bg-purple-400/10" 
          />
          <StatCard 
            icon={<Rocket className="w-5 h-5 text-amber-400" />} 
            label={t.dashboard.stats.games} 
            value={userGames.length > 0 ? userGames.length : '0'} 
            color="bg-amber-400/10" 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Cloud className="w-48 h-48" />
             </div>
             
             <div className="flex justify-between items-center mb-6 relative z-10">
               <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Network Diagnostic
               </h2>
               {dbStatus.online ? (
                 <div className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" /> All Systems Nominal
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <ShieldAlert className="w-3 h-3" /> Link Failure
                 </div>
               )}
             </div>

             <div className="space-y-6 relative z-10">
                {dbStatus.online ? (
                  <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-white font-bold mb-1 uppercase tracking-tight">Handshake Successful</h3>
                        <p className="text-slate-400 text-sm font-light">Your vault is synchronized with the global cluster. All data is being backed up to the cloud in real-time.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Error Logged:</h3>
                        <div className="bg-slate-950 p-4 rounded-xl mb-4 font-mono text-xs text-red-400 border border-red-500/10">
                          {dbStatus.error || "Connection blocked."}
                        </div>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                          Supabase connection is failing. If you already ran the SQL repair code, please try refreshing the page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="font-bold font-space text-white text-lg mb-4 uppercase tracking-tight">System Manifest</h3>
            <div className="space-y-4 text-slate-500 text-sm font-light leading-relaxed">
              <div className="flex items-center justify-between">
                <span>Identity</span>
                <span className="text-white font-bold">{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className={dbStatus.online ? "text-green-400 font-bold" : "text-orange-400 font-bold"}>
                  {dbStatus.online ? "Online" : "Offline Fallback"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
