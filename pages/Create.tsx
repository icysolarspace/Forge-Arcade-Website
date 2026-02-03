
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileCode, ImageIcon, X, Loader2, Save, 
  AlertCircle, Rocket, LayoutGrid, Type, AlignLeft, CheckCircle2
} from 'lucide-react';
import { User, GENRES, Genre } from '../types';
import { publishGame } from '../store';

interface CreateProps {
  user: User;
  onPublish: () => void;
  t: any;
}

const Create: React.FC<CreateProps> = ({ user, onPublish, t }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Arcade');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [htmlFileName, setHtmlFileName] = useState<string>('');
  
  // UI State
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHtmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      setError('Please upload a valid .html file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlCode(content);
      setHtmlFileName(file.name);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Game title is required.');
    if (!htmlCode) return setError('HTML5 game file is required.');

    setIsPublishing(true);
    try {
      publishGame({
        title,
        description,
        genre: selectedGenre,
        htmlCode,
        coverImage: coverImage || undefined,
        creator: user.username
      });

      onPublish();
      setTimeout(() => navigate('/my-games'), 1000);
    } catch (err) {
      setError('Failed to publish game. Please try again.');
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
            <Rocket className="w-3 h-3" /> New Module Deployment
          </div>
          <h1 className="text-5xl font-black font-space text-white uppercase tracking-tighter mb-2">Publish Game</h1>
          <p className="text-slate-500 font-light text-lg">Upload your HTML5 playable build to the arcade.</p>
        </div>
      </header>

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Main Content Area */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  <Type className="w-3 h-3" /> {t.create.gameTitle}
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-indigo-100 font-space text-lg outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-800" 
                  placeholder="The name of your masterpiece..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  <AlignLeft className="w-3 h-3" /> {t.create.description}
                </label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-300 min-h-[120px] outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-800 resize-none" 
                  placeholder="What is this game about? How do you play it?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    <LayoutGrid className="w-3 h-3" /> {t.create.genre}
                  </label>
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value as Genre)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-400 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{t.genres[g] || g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* HTML Upload Zone */}
            <div className="pt-6 border-t border-slate-800/50">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">
                <FileCode className="w-3 h-3" /> HTML5 Game Build
              </label>
              
              <div 
                onClick={() => htmlInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center text-center ${
                  htmlCode 
                  ? 'bg-green-500/5 border-green-500/30 hover:border-green-500/50' 
                  : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <input type="file" ref={htmlInputRef} className="hidden" accept=".html" onChange={handleHtmlUpload} />
                
                {htmlCode ? (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-4 shadow-lg shadow-green-500/10">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">{htmlFileName}</h4>
                    <p className="text-green-500/60 text-xs font-black uppercase tracking-widest">Code Ready to Deploy</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-4 border border-slate-800 group-hover:border-indigo-500/30 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h4 className="text-slate-300 font-bold mb-1">Click to upload .html build</h4>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Single-file HTML5 games only</p>
                  </>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isPublishing || !htmlCode || !title}
            className="w-full bg-white text-black hover:bg-indigo-400 disabled:opacity-30 disabled:hover:bg-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
          >
            {isPublishing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Deploying...</>
            ) : (
              <><Save className="w-6 h-6" /> Publish to Arcade</>
            )}
          </button>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* Side Panel: Cover Image */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-400/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.create.visualCore}</h2>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-800 overflow-hidden flex flex-col items-center justify-center relative group cursor-pointer hover:border-purple-500/50 transition-all"
            >
              {coverImage ? (
                <img src={coverImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-700 mx-auto mb-3 border border-slate-800 group-hover:text-purple-400 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">Click to upload<br/>cover image (16:9)</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            
            <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
              Recommended size: 1280x720px.<br/>Accepted formats: PNG, JPG, WebP.
            </p>
          </section>

          {/* Guidelines */}
          <section className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Deployment Guide</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 bg-indigo-500/10 rounded flex items-center justify-center shrink-0 text-[10px] font-black text-indigo-400 border border-indigo-500/20">1</div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Your game must be contained in a <strong>single .html file</strong> (CSS/JS can be inline or linked to external CDNs).</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 bg-indigo-500/10 rounded flex items-center justify-center shrink-0 text-[10px] font-black text-indigo-400 border border-indigo-500/20">2</div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">The arcade runs games in a sandboxed iframe for security. Ensure your game doesn't rely on cookie access from other domains.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 bg-indigo-500/10 rounded flex items-center justify-center shrink-0 text-[10px] font-black text-indigo-400 border border-indigo-500/20">3</div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Games are stored <strong>locally in your browser</strong>. Export your profile from Settings to keep a backup of your work.</p>
              </li>
            </ul>
          </section>
        </div>
      </form>
    </div>
  );
};

export default Create;
