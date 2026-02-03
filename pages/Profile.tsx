
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Game } from '../types';
import { Gamepad2, Play, Trophy, UserCircle, Calendar, Rocket, BarChart3 } from 'lucide-react';

interface ProfileProps {
  games: Game[];
  allUsers: User[];
}

const Profile: React.FC<ProfileProps> = ({ games, allUsers }) => {
  const { username } = useParams<{ username: string }>();
  
  // Find the target user by username (case-insensitive)
  let user = allUsers.find(u => u.username.toLowerCase() === username?.toLowerCase());
  
  // If user doesn't exist in directory, check if they are a creator of any local games
  if (!user && username) {
    const hasGames = games.some(g => g.creator.toLowerCase() === username.toLowerCase());
    if (hasGames) {
      user = {
        username: username,
        joinedAt: Date.now(), // Fallback for legacy creators
      };
    }
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-800">
          <UserCircle className="w-12 h-12 text-slate-700" />
        </div>
        <h1 className="text-4xl font-black font-space text-white uppercase mb-4 tracking-tighter">Profile Not Found</h1>
        <p className="text-slate-500 mb-8 font-light max-w-md mx-auto">The user "{username}" could not be located in the local data sectors.</p>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs">
          Return to Hub
        </Link>
      </div>
    );
  }

  const userGames = games.filter(g => g.creator.toLowerCase() === user?.username.toLowerCase());
  const totalPlays = userGames.reduce((acc, curr) => acc + curr.plays, 0);
  // Fix: Explicitly type reduce accumulators to avoid 'unknown' type errors during calculation
  const totalReactions = userGames.reduce((acc: number, curr: Game) => {
    const reactions = curr.reactions || {};
    return acc + Object.values(reactions).reduce((a: number, b: number) => a + b, 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl relative group">
          {user.profilePicture ? (
            <img src={user.profilePicture} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt={user.username} />
          ) : (
            <div className="w-full h-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
              <UserCircle className="w-20 h-20" />
            </div>
          )}
        </div>
        
        <div className="flex-grow text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
            <Rocket className="w-3 h-3" /> Certified Creator
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-space text-white uppercase tracking-tighter mb-4">{user.username}</h1>
          <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">
            <Calendar className="w-4 h-4 text-slate-600" />
            Joined {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProfileStat icon={<Gamepad2 className="w-4 h-4 text-indigo-400" />} label="Forged" value={userGames.length} />
            <ProfileStat icon={<Play className="w-4 h-4 text-purple-400" />} label="Plays" value={totalPlays} />
            <ProfileStat icon={<Trophy className="w-4 h-4 text-amber-400" />} label="Likes" value={totalReactions} />
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-black font-space text-white uppercase tracking-tight">Public Portfolio</h2>
          </div>
          <div className="hidden md:block h-px flex-grow mx-8 bg-slate-800/50"></div>
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
            {userGames.length} Modules Online
          </div>
        </div>
        
        {userGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userGames.map(game => (
              <Link 
                key={game.id} 
                to={`/play/${game.id}`}
                className="group bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-800">
                  {game.coverImage ? (
                    <img src={game.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={game.title} />
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-800">
                      <Gamepad2 className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-indigo-600 p-5 rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-space font-bold text-2xl text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">{game.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-black bg-indigo-400/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-400/20 uppercase tracking-widest">
                      {game.genre}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed mb-6">{game.description}</p>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Play className="w-3 h-3" /> {game.plays} Plays</span>
                    <span>View Detail</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50">
            <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
              <Gamepad2 className="w-10 h-10 text-slate-800" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">No active modules found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileStat: React.FC<{ icon: React.ReactNode, label: string, value: number }> = ({ icon, label, value }) => (
  <div className="bg-slate-950/50 px-5 py-4 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-indigo-500/30 transition-colors group">
    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">{label}</div>
      <div className="text-lg font-black text-white font-space leading-none">{value.toLocaleString()}</div>
    </div>
  </div>
);

export default Profile;
