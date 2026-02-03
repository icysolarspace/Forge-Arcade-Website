
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play as PlayIcon, Maximize2, RotateCcw, Tag as TagIcon, Share2, Gamepad, Edit3, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Game, User } from '../types';
import { getAppState, saveAppState, addReaction } from '../store';

const EMOJIS = ['👍', '❤️', '🚀', '🔥', '🕹️'];

interface PlayProps {
  games: Game[];
  currentUser: User | null;
  onReaction: () => void;
  t: any;
}

const Play: React.FC<PlayProps> = ({ games, currentUser, onReaction, t }) => {
  const { id } = useParams();
  const game = games.find(g => g.id === id);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (game) {
      const state = getAppState();
      const updatedGames = state.games.map(g => g.id === game.id ? { ...g, plays: g.plays + 1 } : g);
      state.games = updatedGames;
      saveAppState(state);
      onReaction();
    }
  }, [id]);

  const handleReact = (emoji: string) => {
    if (!game || !currentUser) return;
    addReaction(game.id, emoji, currentUser.username);
    onReaction();
  };

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <Gamepad className="w-16 h-16 text-slate-800 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-4 font-space text-white">{t.play.lostTitle}</h2>
        <p className="text-slate-500 mb-8">{t.play.lostSub}</p>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold transition-all">{t.play.back}</Link>
      </div>
    );
  }

  const isCreator = currentUser && currentUser.username === game.creator;
  const userEmoji = currentUser ? game.userReactions?.[currentUser.username] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group uppercase font-bold text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t.play.back}
        </Link>
        <div className="flex items-center gap-4">
           {game.moderated && (
             <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest">
               <ShieldCheck className="w-3 h-3" /> Safety Scanned
             </div>
           )}
          {isCreator && (
            <Link to={`/edit/${game.id}`} className="inline-flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white px-4 py-2 rounded-xl border border-indigo-500/30 transition-all font-bold text-xs uppercase tracking-widest">
              <Edit3 className="w-4 h-4" /> {t.play.edit}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="p-6 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
              <PlayIcon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-space tracking-tight leading-none uppercase">{game.title}</h1>
              <Link to={`/profile/${game.creator}`} className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-1">
                <UserIcon className="w-2.5 h-2.5" />
                By {game.creator}
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setKey(prev => prev + 1)} className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title={t.play.reboot}>
              <RotateCcw className="w-5 h-5" />
            </button>
            <button className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all" title={t.play.fullscreen}>
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          <iframe 
            key={key}
            srcDoc={game.htmlCode}
            title={game.title}
            className="w-full h-full border-0 shadow-2xl"
            sandbox="allow-scripts allow-forms allow-modals"
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Link to={`/genre/${game.genre}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded border border-indigo-400/20 hover:bg-indigo-400/20 transition-colors">
                  {t.genres[game.genre] || game.genre}
                </Link>
              </div>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t.play.about}</h2>
              <p className="text-slate-300 text-lg font-light leading-relaxed mb-10">
                {game.description}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.play.reactions}</h3>
                <div className="flex flex-wrap gap-4">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(emoji)}
                      className={`group flex items-center gap-2 border px-4 py-2 rounded-2xl transition-all active:scale-95 ${
                        userEmoji === emoji 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`text-xl transition-transform ${userEmoji === emoji ? 'scale-125' : 'group-hover:scale-125'}`}>{emoji}</span>
                      <span className="text-sm font-bold">
                        {game.reactions?.[emoji] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 text-center">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plays</div>
                <div className="text-4xl font-black text-white font-space tracking-tighter">{game.plays}</div>
              </div>
              <button className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                <Share2 className="w-5 h-5" /> {t.play.share}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
