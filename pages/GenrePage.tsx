
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, LayoutGrid } from 'lucide-react';
import { Game, Genre } from '../types';

interface GenrePageProps {
  games: Game[];
}

const GenrePage: React.FC<GenrePageProps> = ({ games }) => {
  const { genreName } = useParams();
  const filteredGames = games.filter(g => g.genre === genreName);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group uppercase font-bold text-xs tracking-widest">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO THE ARCHIVE
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black font-space text-white uppercase tracking-tighter">{genreName} Sector</h1>
        </div>
        <p className="text-slate-500 font-light">Showing all verified modules in the {genreName} category.</p>
      </header>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredGames.map(game => (
            <Link key={game.id} to={`/play/${game.id}`} className="group bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col">
              <div className="aspect-[16/10] bg-slate-800 relative overflow-hidden">
                {game.coverImage ? (
                  <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-800">
                    <Play className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-indigo-600 p-4 rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex-grow">
                <h3 className="font-space font-bold text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2 tracking-tight">{game.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-light">{game.description}</p>
              </div>
              <div className="px-5 py-4 bg-slate-900/80 border-t border-slate-800/50 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <span>By {game.creator}</span>
                <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {game.plays}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <p className="text-slate-500 font-light text-lg">No modules detected in this sector.</p>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
