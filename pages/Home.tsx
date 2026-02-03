
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, Trophy, Clock, Gamepad, Sparkles, LayoutGrid, Rocket, ChevronRight, User as UserIcon, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { Game, User, GENRES } from '../types';

const GameCard: React.FC<{ game: Game }> = ({ game }) => (
  <div className="group bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col group/card">
    <Link to={`/play/${game.id}`} className="aspect-[16/10] bg-slate-800 relative flex items-center justify-center overflow-hidden">
      {game.coverImage ? (
        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center">
          <GamepadAnimation />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-60"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
        <div className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-300">
          <Play className="w-6 h-6 fill-current" />
        </div>
      </div>
    </Link>
    <div className="p-5 flex-grow">
      <Link to={`/play/${game.id}`} className="block">
        <h3 className="font-space font-bold text-xl text-white group-hover/card:text-indigo-400 transition-colors line-clamp-1 mb-2 tracking-tight">
          {game.title}
        </h3>
      </Link>
      <div className="flex items-center gap-2 mb-3">
        <Link to={`/genre/${game.genre}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20 hover:bg-indigo-400/20 transition-colors">
          {game.genre}
        </Link>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10 leading-relaxed font-light">
        {game.description}
      </p>
    </div>
    <div className="px-5 py-4 bg-slate-900/80 border-t border-slate-800/50 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
      <Link to={`/profile/${game.creator}`} className="flex items-center gap-2 hover:text-indigo-400 transition-colors group/creator">
        <UserIcon className="w-3 h-3 text-slate-600 group-hover/creator:text-indigo-400" />
        <span>By {game.creator}</span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-gray-400"><Play className="w-3 h-3" /> {game.plays}</span>
      </div>
    </div>
  </div>
);

const GamepadAnimation = () => (
  <svg className="w-16 h-16 text-slate-700/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12"></line>
    <line x1="8" y1="10" x2="8" y2="14"></line>
    <circle cx="15" cy="13" r="1"></circle>
    <circle cx="18" cy="11" r="1"></circle>
    <path d="M18 11h.01"></path>
    <path d="M15 13h.01"></path>
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/>
  </svg>
);

interface HomeProps {
  games: Game[];
  user: User | null;
  t: any;
}

const Home: React.FC<HomeProps> = ({ games, user, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
        {/* Main Hero */}
        <div className="pt-20 pb-32 text-center px-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" /> System Online: v2.5 Forge
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 whitespace-pre-line animate-in slide-in-from-bottom-8 duration-700">
            {t.home.heroTitle}
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-light tracking-wide mb-12 leading-relaxed animate-in slide-in-from-bottom-12 duration-700">
            {t.home.heroSub}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 animate-in slide-in-from-bottom-16 duration-700">
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95">
              Launch Creator Profile
            </Link>
            <a 
              href="https://discord.gg/amrDXESw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <DiscordIcon />
              {t.home.discordLink}
            </a>
            <button 
              onClick={() => document.getElementById('archive-sector')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
            >
              Explore Archive
            </button>
          </div>
        </div>

        {/* Features / Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           <FeatureCard 
             icon={<Zap className="w-6 h-6 text-indigo-400" />} 
             title={t.home.features.play.title} 
             desc={t.home.features.play.desc} 
           />
           <FeatureCard 
             icon={<Cpu className="w-6 h-6 text-purple-400" />} 
             title={t.home.features.forge.title} 
             desc={t.home.features.forge.desc} 
           />
           <FeatureCard 
             icon={<ShieldCheck className="w-6 h-6 text-green-400" />} 
             title={t.home.features.freedom.title} 
             desc={t.home.features.freedom.desc} 
           />
        </div>

        {/* Neater Locked Area / Creator Portal */}
        <div id="archive-sector" className="relative group">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative text-center py-32 px-8 bg-slate-900/40 rounded-[3rem] border border-slate-800/50 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Rocket className="w-64 h-64 text-indigo-400" />
            </div>
            
            <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Zap className="w-10 h-10 text-indigo-500 animate-pulse" />
            </div>
            
            <h2 className="text-xs font-black text-indigo-400 mb-4 uppercase tracking-[0.4em]">{t.home.archiveEncrypted}</h2>
            
            <h3 className="text-3xl font-black font-space text-white mb-6 uppercase tracking-tight max-w-md mx-auto leading-tight">
              Ready to Forge Your Own Reality?
            </h3>
            
            <p className="text-slate-400 font-light text-lg mb-12 max-w-lg mx-auto leading-relaxed">
              {t.home.loginMessage}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                {t.nav.login}
              </Link>
              <Link to="/howto" className="w-full sm:w-auto text-slate-500 hover:text-white px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-colors">
                View System Manual
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Browse Preview */}
        {games.length > 0 && (
          <div className="mt-32">
             <div className="flex items-center gap-4 mb-12">
               <h2 className="text-xl font-black font-space text-white uppercase tracking-tight">Recent Transmissions</h2>
               <div className="h-px flex-grow bg-slate-800/50"></div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
               {games.slice(0, 4).map(game => (
                 <GameCard key={game.id} game={game} />
               ))}
             </div>
          </div>
        )}
      </div>
    );
  }

  const latestGames = [...games].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  const gamesByGenre = GENRES.map(genre => ({
    genre,
    games: games.filter(g => g.genre === genre)
  })).filter(group => group.games.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black font-space text-white uppercase tracking-tighter">ForgeArcade</h1>
            <p className="text-slate-500 font-light mt-1">Hello, {user.username}. What do you want to play today?</p>
          </div>
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={t.home.searchPlaceholder} 
              className="w-full bg-slate-900/80 border border-slate-800 rounded-full pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* New Games Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
            <Rocket className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black font-space text-white uppercase tracking-tight">{t.home.newGames}</h2>
        </div>
        
        {latestGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500">{t.home.noGames}</p>
          </div>
        )}
      </section>

      {/* By Sector (Genre) Section */}
      <section className="space-y-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 border border-purple-400/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black font-space text-white uppercase tracking-tight">{t.home.byGenre}</h2>
        </div>

        {gamesByGenre.length > 0 ? (
          gamesByGenre.map(group => (
            <div key={group.genre} className="space-y-8 animate-in fade-in duration-700">
              <div className="flex items-center gap-4">
                <Link to={`/genre/${group.genre}`} className="text-xl font-bold font-space text-indigo-300 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                  {t.genres[group.genre] || group.genre}
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="h-px flex-grow bg-slate-800/50"></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{group.games.length} Games</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {group.games.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          ))
        ) : games.length > 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No games found.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-[2rem] hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-500 flex flex-col items-center text-center group">
    <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-lg font-black font-space text-white uppercase tracking-tight mb-3">{title}</h3>
    <p className="text-slate-500 text-sm font-light leading-relaxed">{desc}</p>
  </div>
);

export default Home;
