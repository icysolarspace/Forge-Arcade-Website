
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Heart, Play, Activity, Cpu, Cloud, CloudOff, 
  AlertTriangle, ExternalLink, ShieldAlert, CheckCircle2, Copy,
  ArrowUpCircle, Loader2, RefreshCcw, Wifi, WifiOff, Terminal, ShieldX,
  Search, Globe
} from 'lucide-react';
import { User, Game } from '../types';
import { fetchGlobalData, syncLocalToCloud, getAppState, supabase, testSupabaseReachability } from '../store';

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
  const [pingResult, setPingResult] = useState<{ reachable: boolean; status?: number; error?: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [localOnlyCount, setLocalOnlyCount] = useState(0);

  const checkSyncStatus = async () => {
    // 1. Check reachability via standard fetch
    const ping = await testSupabaseReachability();
    setPingResult(ping);

    // 2. Try global data fetch
    const result = await fetchGlobalData();
    setDbStatus({ online: result.online, error: result.error });
    
    try {
      const { data: cloudGames } = await supabase.from('games').select('id');
      const cloudIds = new Set((cloudGames || []).map((g: any) => g.id));
      const local = getAppState();
      const unsynced = (local.games || []).filter(g => !cloudIds.has(g.id));
      setLocalOnlyCount(unsynced.length);
    } catch (e) {
      setLocalOnlyCount(0);
    }
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
        <button onClick={checkSyncStatus} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Network Reachability Diagnostic */}
      {!dbStatus.online && (
        <div className="mb-10 p-8 bg-slate-900 border-2 border-red-500/30 rounded-[2.5rem] relative overflow-hidden">
           <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 shrink-0">
                <Globe className="w-8 h-8" />
              </div>
              
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-white font-black font-space text-2xl uppercase tracking-tight">Signal Probe Results</h2>
                  <div className="px-3 py-1 bg-black/50 border border-slate-800 rounded-lg font-mono text-[10px] text-slate-500">
                    ID: ikjiwaxclgssyvzocivv
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="p-4 bg-black/40 rounded-xl border border-slate-800">
                         <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Raw Ping Test</div>
                         <div className="flex items-center gap-3">
                            {pingResult?.reachable ? (
                               <div className="text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Reachable</div>
                            ) : (
                               <div className="text-red-400 font-bold flex items-center gap-2"><XCircle className="w-4 h-4" /> Blocked</div>
                            )}
                            <div className="text-slate-500 text-xs font-mono">{pingResult?.status ? `HTTP ${pingResult.status}` : pingResult?.error}</div>
                         </div>
                      </div>

                      <div className="p-4 bg-black/40 rounded-xl border border-slate-800">
                         <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Suggested Fix</div>
                         <p className="text-xs text-slate-400 leading-relaxed">
                            {pingResult?.error?.includes('Failed to fetch') 
                              ? "Your environment is preventing the browser from reaching 'supabase.co'. This is almost always an Ad-Blocker (uBlock, Brave) or a School/Work Firewall."
                              : "The domain is reachable but the credentials might be outdated. Check the Supabase Dashboard -> Settings -> API."}
                         </p>
                      </div>
                   </div>

                   <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                      <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> System Log
                      </h3>
                      <div className="font-mono text-[11px] text-slate-400 leading-tight space-y-1">
                         <div className="text-slate-600 font-bold">> curl --head https://ikjiwax...</div>
                         <div className="text-red-400/80">ERROR: {dbStatus.error}</div>
                         <div className="pt-2 text-slate-500 italic">Recommendation: Try accessing via a Mobile Hotspot to confirm if your current network is blocking the Supabase API.</div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Sync Alert for Local Data */}
      {dbStatus.online && localOnlyCount > 0 && (
        <div className="mb-10 p-6 bg-indigo-600/10 border border-indigo-500/30 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-bounce-subtle">
           <div className="flex items-center gap-4 text-center md:text-left">
             <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
               <ArrowUpCircle className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-white font-black uppercase tracking-tight">Sync Ready</h3>
               <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-widest">{localOnlyCount} units await cloud deployment</p>
             </div>
           </div>
           <button 
             onClick={handleSync}
             disabled={syncing}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 flex items-center gap-3 disabled:opacity-50 transition-all active:scale-95"
           >
             {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
             Commit to Cloud
           </button>
        </div>
      )}

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">Identity Vitals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Play className="w-5 h-5 text-indigo-400" />} 
            label={t.dashboard.stats.plays} 
            value={totalPlays.toLocaleString()} 
            color="bg-indigo-400/10" 
          />
          <StatCard 
            icon={<Heart className="w-5 h-5 text-purple-400" />} 
            label={t.dashboard.stats.reactions} 
            value={totalReactions.toLocaleString()} 
            color="bg-purple-400/10" 
          />
          <StatCard 
            icon={<Rocket className="w-5 h-5 text-amber-400" />} 
            label={t.dashboard.stats.games} 
            value={userGames.length} 
            color="bg-amber-400/10" 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Terminal className="w-48 h-48" />
             </div>
             
             <div className="flex justify-between items-center mb-8 relative z-10">
               <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Connection Hub
               </h2>
               {dbStatus.online ? (
                 <div className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 shadow-lg shadow-green-500/5">
                    <Wifi className="w-3 h-3" /> Secure Link Active
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 shadow-lg shadow-red-500/5">
                    <WifiOff className="w-3 h-3" /> Link Fractured
                 </div>
               )}
             </div>

             <div className="space-y-6 relative z-10">
                {dbStatus.online ? (
                  <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 shrink-0">
                         <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-black uppercase tracking-tight mb-2">Transmission Verified</h3>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                          Your vault is successfully synchronized with the global cluster. All local project data is being backed up to the distributed cloud in real-time.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-950/80 border border-red-500/10 rounded-2xl">
                    <div className="flex items-start gap-4 text-slate-500">
                      <ShieldAlert className="w-6 h-6 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-slate-300 font-bold uppercase tracking-tight mb-2">Restricted Mode Active</h3>
                        <p className="text-xs font-light leading-relaxed mb-4">
                          The system has transitioned to <strong>Local Fallback</strong>. You can still forge and play games, but they won't be visible to other pilots until the cloud link is restored.
                        </p>
                        <button onClick={checkSyncStatus} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white flex items-center gap-2 transition-colors">
                          <RefreshCcw className="w-3 h-3" /> Force Re-Probe
                        </button>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="font-black font-space text-white text-lg mb-6 uppercase tracking-tight">Pilot Manifest</h3>
            <div className="space-y-5 text-slate-500 text-sm font-light">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest">Callsign</span>
                <span className="text-white font-bold">{user.username}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                <span className={dbStatus.online ? "text-green-400 font-bold" : "text-orange-400 font-bold uppercase text-[10px]"}>
                  {dbStatus.online ? "Global" : "Local-Only"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[10px] font-black uppercase tracking-widest">Vault ID</span>
                <span className="text-[10px] font-mono text-slate-600">ARC-{Math.random().toString(36).substr(2, 5).toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="w-full bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl flex items-center justify-between group transition-all">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                 <ExternalLink className="w-5 h-5" />
               </div>
               <div>
                  <span className="block text-xs font-black text-white uppercase tracking-widest">Cloud Console</span>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Monitor Cluster</span>
               </div>
             </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default Dashboard;
