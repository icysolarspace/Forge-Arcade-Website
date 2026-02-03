
import React from 'react';
import { Rocket, Heart, Play, Activity, Cpu, Cloud, CloudOff } from 'lucide-react';
import { User, Game } from '../types';

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

const Dashboard: React.FC<DashboardProps> = ({ user, games, t }) => {
  const userGames = games.filter(g => g.creator.toLowerCase() === user.username.toLowerCase());
  const totalPlays = userGames.reduce((acc, curr) => acc + curr.plays, 0);
  const totalReactions = userGames.reduce((acc: number, curr: Game) => {
    const reactions = curr.reactions || {};
    return acc + Object.values(reactions).reduce((a: number, b: number) => a + b, 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black font-space text-white uppercase tracking-tighter mb-2">{t.dashboard.title}</h1>
        <p className="text-slate-500 font-light">{t.dashboard.sub}</p>
      </header>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">Your Stats</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Cpu className="w-48 h-48" />
             </div>
             <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-400" />
                {t.dashboard.systemStatus}
             </h2>
             <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-indigo-400" /> Supabase Storage
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-green-500">
                    Live Cluster Connected
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Visibility</span>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-500">
                    Public Hangar
                  </span>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="font-bold font-space text-white text-lg mb-4 uppercase tracking-tight">Session Log</h3>
            <div className="space-y-4 text-slate-500 text-sm font-light leading-relaxed">
              <p>• Connected to ikjiwax...supabase.co</p>
              <p>• Logged in as {user.username}.</p>
              <p>• Community syncing active (60s).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
