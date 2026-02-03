
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Upload, ImageIcon, Save, Code as CodeIcon, Play, 
  Settings, ArrowLeft, Trash2
} from 'lucide-react';
import { User, GENRES, Genre, Game } from '../types';
import { updateGame, deleteGame } from '../store';

interface EditGameProps {
  user: User;
  games: Game[];
  onUpdate: () => void;
  t: any;
}

const EditGame: React.FC<EditGameProps> = ({ user, games, onUpdate, t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const originalGame = games.find(g => g.id === id);

  // Form State
  const [activeTab, setActiveTab] = useState<'metadata' | 'source' | 'preview'>('metadata');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Arcade');
  const [htmlCode, setHtmlCode] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (originalGame) {
      if (originalGame.creator !== user.username) {
        navigate('/');
        return;
      }
      setTitle(originalGame.title);
      setDescription(originalGame.description);
      setSelectedGenre(originalGame.genre);
      setHtmlCode(originalGame.htmlCode);
      setCoverImage(originalGame.coverImage || null);
    }
  }, [originalGame, user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!originalGame) return;
    setIsSaving(true);

    try {
      updateGame({
        ...originalGame,
        title,
        description,
        genre: selectedGenre,
        htmlCode,
        coverImage: coverImage || undefined
      });

      onUpdate();
      setTimeout(() => navigate(`/play/${originalGame.id}`), 500);
    } catch (error) {
      console.error("Failed to save changes.");
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!originalGame) return;
    if (window.confirm(`Delete "${originalGame.title}"? This cannot be undone.`)) {
      deleteGame(originalGame.id);
      onUpdate();
      navigate('/my-games');
    }
  };

  if (!originalGame) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/play/${originalGame.id}`} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-black font-space text-white uppercase tracking-tighter leading-none">EDIT: {originalGame.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Module Maintenance</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleUpdate}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Metadata
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">Game Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-indigo-400 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">Category</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value as Genre)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 outline-none">
                  {GENRES.map(g => <option key={g} value={g}>{t.genres[g] || g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 min-h-[120px] outline-none resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Cover Artwork
            </h2>
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative group cursor-pointer"
              >
                {coverImage ? <img src={coverImage} className="w-full h-full object-cover" alt="Cover" /> : <ImageIcon className="w-8 h-8 text-slate-900" />}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 flex flex-col min-h-[600px]">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-grow flex flex-col">
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 flex items-center gap-1">
              <TabButton active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} icon={<Settings className="w-3.5 h-3.5" />} label="Details" />
              <TabButton active={activeTab === 'source'} onClick={() => setActiveTab('source')} icon={<CodeIcon className="w-3.5 h-3.5" />} label="Source Code" />
              <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Play className="w-3.5 h-3.5" />} label="Preview" />
            </div>

            <div className="flex-grow p-0 relative overflow-hidden">
              {activeTab === 'metadata' && (
                <div className="h-full flex flex-col p-8 animate-in slide-in-from-right duration-300">
                  <h3 className="text-xl font-bold font-space text-white uppercase tracking-tight mb-4">Module Details</h3>
                  <p className="text-slate-500 font-light leading-relaxed">
                    Update the metadata for your module. The changes will be applied instantly when you save.
                    To update the actual gameplay, switch to the <strong>Source Code</strong> tab.
                  </p>
                </div>
              )}

              {activeTab === 'source' && (
                <textarea 
                  value={htmlCode} 
                  onChange={(e) => setHtmlCode(e.target.value)} 
                  className="h-full w-full bg-[#1e1e1e] text-[#d4d4d4] p-6 outline-none resize-none font-mono text-sm leading-relaxed" 
                  spellCheck={false} 
                />
              )}

              {activeTab === 'preview' && (
                <div className="h-full bg-black flex items-center justify-center">
                  <iframe srcDoc={htmlCode} className="w-full h-full border-0" sandbox="allow-scripts allow-modals allow-forms" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${active ? 'text-white border-indigo-500 bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-400'}`}>{icon}{label}</button>
);

export default EditGame;
