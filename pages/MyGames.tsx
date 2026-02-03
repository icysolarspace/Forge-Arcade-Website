
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Game, User } from '../types';
import { Play, Rocket, LayoutGrid, Tag, Trash2, Edit3, Loader2 } from 'lucide-react';
import { deleteGame } from '../store';

interface MyGamesProps {
  user: User;
  games: Game[];
  onUpdate: () => void;
}

const MyGames: React.FC<MyGamesProps> = ({ user, games, onUpdate }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const userGames = games.filter(g => g.creator.toLowerCase() === user.username.toLowerCase());

  const handleDelete = async (e: React.MouseEvent, gameId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`PERMANENT DELETION: Are you 100% sure you want to erase "${title}"? This cannot be undone.`)) {
      setIsRefreshing(true);
      try {
        deleteGame(gameId);
        // We call onUpdate() which triggers refreshState() in App.tsx
        // which forces a full re-render with fresh localStorage data
        onUpdate();
      } catch (err) {
        console.error("Deletion failed:", err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black font-space text-white uppercase tracking-tighter mb-3">Project Hangar</h1>
          <p className="text-slate-500 font-light text-lg">Inventory of your forged cosmic experiences and digital assets.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            {userGames.length} Total Units
          </div>
          {isRefreshing && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        </div>
      </header>

      {userGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {userGames.map(game => (
            <div 
              key={game.id} 
              className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all shadow-2xl flex flex-col group/card"
            >
              <Link to={`/play/${game.id}`} className="aspect-video relative overflow-hidden bg-slate-800 block">
                {game.coverImage ? (
                  <img src={game.coverImage} className="w-full h-full object-cover transition-transform group-hover/card:scale-110 duration-700" alt={game.title} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 to-slate-900 flex items-center justify-center text-slate-800">
                    <Rocket className="w-16 h-16 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                   <div className="bg-indigo-600 p-4 rounded-full text-white shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-300">
                     <Play className="w-8 h-8 fill-current" />
                   </div>
                </div>
              </Link>
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <Link to={`/play/${game.id}`} className="font-space font-bold text-2xl text-white uppercase tracking-tight group-hover/card:text-indigo-400 transition-colors">
                    {game.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-black bg-indigo-400/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-400/20 uppercase tracking-widest">
                    {game.genre}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed mb-8">{game.description}</p>
                
                <div className="flex justify-between items-center pt-8 border-t border-slate-800/50 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Play className="w-3.5 h-3.5 text-indigo-400" /> {game.plays} Total Plays</span>
                  <div className="flex gap-3">
                    <Link to={`/edit/${game.id}`} className="p-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-600/10 text-slate-500 hover:text-indigo-400 rounded-xl transition-all" title="Modify Source Code">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={(e) => handleDelete(e, game.id, game.title)}
                      className="p-2.5 bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-red-600/10 text-slate-500 hover:text-red-400 rounded-xl transition-all"
                      title="Decommission Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50">
          <div className="w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-800">
            <Rocket className="w-12 h-12 text-slate-800" />
          </div>
          <h2 className="text-2xl font-black font-space text-white mb-2 uppercase tracking-tight">Hangar Depleted</h2>
          <p className="text-slate-500 mb-10 font-light max-w-sm mx-auto text-lg leading-relaxed">No game units currently detected in your private creation sector.</p>
          <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/20">
            Initiate Forge
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGames;
